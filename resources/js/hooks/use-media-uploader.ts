import axios, { isAxiosError } from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { z } from "zod";

type UnsignedData = {
    key: string;
    type: string;
    size: number;
};

type SignedUpload = {
    id: number;
    key: string;
    url: string;
    headers: Record<string, any>;
    file: File;
};

type UnsignedUpload = { key: string; file: File; state: "unsigned" };
type PendingUpload = SignedUpload & { state: "pending" };
type ProcessingUpload = SignedUpload & {
    state: "processing";
    progress: number;
};
type SuccessfulUpload = SignedUpload & { state: "successful" };
type FailedUpload = SignedUpload & { state: "failed" };

type Upload =
    | UnsignedUpload
    | PendingUpload
    | ProcessingUpload
    | SuccessfulUpload
    | FailedUpload;

type UploadMap = Record<string, Upload>;

export function useMediaUploader(): {
    error: string | null;
    uploads: Array<Upload>;
    save: (files: Array<File>) => void;
} {
    const [unsignedQueue, setUnsignedQueue] = useState<Array<UnsignedUpload>>(
        []
    );
    const [pendingQueue, setPendingQueue] = useState<Array<PendingUpload>>([]);
    const [processingUploads, setProcessingUploads] = useState<
        Record<string, ProcessingUpload>
    >({});
    const [successfulUploads, setSuccessfulUploads] = useState<
        Array<SuccessfulUpload>
    >([]);
    const [failedUploads, setFailedUploads] = useState<Array<FailedUpload>>([]);
    const [error, setError] = useState<string | null>(null);

    const uploadMap = useMemo(
        () =>
            [
                ...unsignedQueue,
                ...pendingQueue,
                ...Object.values(processingUploads),
                ...successfulUploads,
                ...failedUploads,
            ].reduce<UploadMap>((map, upload) => {
                map[upload.key] = upload;
                return map;
            }, {}),
        [
            unsignedQueue,
            pendingQueue,
            processingUploads,
            successfulUploads,
            failedUploads,
        ]
    );

    const save = useCallback(
        (files: Array<File>) => {
            const unsigned = files.flatMap<UnsignedUpload>((file) =>
                uploadMap[file.name]
                    ? []
                    : [{ key: file.name, file, state: "unsigned" }]
            );
            setUnsignedQueue((prev) => [...prev, ...unsigned]);
        },
        [uploadMap]
    );

    useEffect(() => {
        generatePresignedUrl(unsignedQueue)
            .then((pendingUploads) => {
                setPendingQueue((prev) => [...prev, ...pendingUploads]);
            })
            .catch((err) => {
                setError(err);
            });
    }, [unsignedQueue]);

    useEffect(() => {
        uploadToBucket(pendingQueue, {
            onProgress(key, progress) {
                setProcessingUploads((prev) => {
                    const upload = prev[key];
                    if (!upload) return prev;
                    return { ...prev, [key]: { ...upload, progress } };
                });
            },
        }).then(({ successfulUploads, failedUploads }) => {
            setProcessingUploads((prev) => {
                const next = { ...prev };
                [...successfulUploads, ...failedUploads].forEach((upload) => {
                    delete next[upload.key];
                });
                return next;
            });
            setSuccessfulUploads((prev) => [...prev, ...successfulUploads]);
            setFailedUploads((prev) => [...prev, ...failedUploads]);

            setPendingQueue([]);
        });
    }, [pendingQueue]);

    useEffect(() => {
        confirmUploads(successfulUploads, {
            onError(error) {
                setError(error);
            },
        });
    }, [successfulUploads]);

    return { uploads: Object.values(uploadMap), save, error };
}

/** GENERATING PRESIGNED URLS */

const signedDataSchema = z.array(
    z.object({
        id: z.number(),
        key: z.string(),
        url: z.string(),
        headers: z.record(z.any()),
    })
);

async function generatePresignedUrl(
    unsignedUploads: Array<UnsignedUpload>
): Promise<Array<PendingUpload>> {
    try {
        const [uploads, fileMap] = unsignedUploads.reduce<
            [Array<UnsignedData>, Record<string, File>]
        >(
            ([uploads, fileMap], upload) => {
                return [
                    [
                        ...uploads,
                        {
                            key: upload.key,
                            type: upload.file.type,
                            size: upload.file.size,
                        },
                    ],
                    { ...fileMap, [upload.key]: upload.file },
                ];
            },
            [[], {}]
        );

        const result = await axios.post(route("media.post"), { uploads });

        const pendingUploads: Array<PendingUpload> = signedDataSchema
            .parse(result.data)
            .map((data) => {
                const file = fileMap[data.key];
                return { ...data, file, state: "pending" };
            });

        return pendingUploads;
    } catch (error) {
        // TODO: Add error tracking here when I have it.
        const message =
            isAxiosError(error) || error instanceof Error
                ? error.message
                : "Error generating a presigned url.";

        throw message;
    }
}

/** UPLOADING TO BUCKET */
type BucketUploadReturn = {
    successfulUploads: Array<SuccessfulUpload>;
    failedUploads: Array<FailedUpload>;
};
async function uploadToBucket(
    pendingUploads: Array<PendingUpload>,
    { onProgress }: { onProgress(key: string, progress: number): void }
): Promise<BucketUploadReturn> {
    const results = await Promise.allSettled(
        pendingUploads.map((data) =>
            axios
                .put(data.url, data.file, {
                    headers: data.headers,
                    onUploadProgress: ({ loaded, total }) => {
                        const percentCompleted = total
                            ? Math.floor(loaded / total) * 100
                            : 0;

                        onProgress(data.key, percentCompleted);
                    },
                })
                .then(
                    () =>
                        ({
                            ...data,
                            state: "successful",
                        } satisfies SuccessfulUpload)
                )
                .catch((error) => {
                    // TODO: Add error tracking here when I have it.
                    throw { ...data, state: "failed" };
                })
        )
    );

    return results.reduce<BucketUploadReturn>(
        ({ successfulUploads, failedUploads }, result) => {
            if (result.status === "fulfilled") {
                successfulUploads.push(result.value);
            } else {
                failedUploads.push(result.reason);
            }
            return { successfulUploads, failedUploads };
        },
        { successfulUploads: [], failedUploads: [] }
    );
}

/** CONFIRMING UPLOADS IN DATABASE */

function confirmUploads(
    uploads: Array<SuccessfulUpload>,
    { onError }: { onError(error: string): void }
) {
    axios
        .patch(route("media.patch"), { uploads: uploads.map(({ id }) => id) })
        .catch((error) => {
            // TODO: Add error tracking here when I have it.
            const message =
                isAxiosError(error) || error instanceof Error
                    ? error.message
                    : "Error generating a presigned url.";
            onError(message);
        });
}
