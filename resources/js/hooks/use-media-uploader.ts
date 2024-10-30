import { SignedUploadData } from "@/types/app";
import axios, { isAxiosError } from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { z } from "zod";

type UnsignedData = {
    path: string;
    type: string;
    size: number;
};

type SignedUpload = SignedUploadData & {
    file: File;
};

type UnsignedUpload = { path: string; file: File; state: "unsigned" };
type PendingUpload = SignedUpload & { state: "pending" };
type ProcessingUpload = SignedUpload & {
    state: "processing";
    progress: number;
};
export type SuccessfulUpload = SignedUpload & { state: "successful" };
type FailedUpload = SignedUpload & { state: "failed" };

export type Upload =
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
                map[upload.path] = upload;
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
            if (!files.length) return;

            const unsigned = files.flatMap<UnsignedUpload>((file) => {
                const [name, extension] = file.name.split(".");
                const path = `${name}-${crypto.randomUUID()}.${extension}`;
                return uploadMap[path]
                    ? []
                    : [{ path, file, state: "unsigned" }];
            });

            if (!unsigned.length) return;

            setUnsignedQueue((prev) => [...prev, ...unsigned]);
        },
        [uploadMap]
    );

    useEffect(() => {
        if (!unsignedQueue.length) return;
        generatePresignedUrl(unsignedQueue)
            .then((pendingUploads) => {
                setPendingQueue((prev) => [...prev, ...pendingUploads]);
            })
            .catch((err) => {
                setError(err);
            });
    }, [unsignedQueue]);

    useEffect(() => {
        if (!pendingQueue.length) return;

        setProcessingUploads((prev) => {
            const next = { ...prev };
            pendingQueue.forEach((upload) => {
                next[upload.path] = {
                    ...upload,
                    state: "processing",
                    progress: 0,
                };
            });
            return next;
        });

        uploadToBucket(pendingQueue, {
            onProgress(path, progress) {
                setProcessingUploads((prev) => {
                    const upload = prev[path];
                    if (!upload) return prev;
                    return { ...prev, [path]: { ...upload, progress } };
                });
            },
        }).then(({ successfulUploads, failedUploads }) => {
            if (!successfulUploads.length && !failedUploads.length) return;

            setProcessingUploads((prev) => {
                const next = { ...prev };
                [...successfulUploads, ...failedUploads].forEach((upload) => {
                    delete next[upload.path];
                });
                return next;
            });
            setPendingQueue([]);

            if (successfulUploads.length) {
                setSuccessfulUploads((prev) => [...prev, ...successfulUploads]);
            }

            if (failedUploads.length) {
                setFailedUploads((prev) => [...prev, ...failedUploads]);
            }
        });
    }, [pendingQueue]);

    useEffect(() => {
        if (!successfulUploads.length) return;

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
        path: z.string(),
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
                            path: upload.path,
                            type: upload.file.type,
                            size: upload.file.size,
                        },
                    ],
                    { ...fileMap, [upload.path]: upload.file },
                ];
            },
            [[], {}]
        );

        const result = await axios.post(route("media.sign"), { uploads });

        const pendingUploads: Array<PendingUpload> = signedDataSchema
            .parse(result.data)
            .map((data) => {
                const file = fileMap[data.path];
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
    { onProgress }: { onProgress(path: string, progress: number): void }
): Promise<BucketUploadReturn> {
    const results = await Promise.allSettled(
        pendingUploads.map((data) =>
            axios
                .put(data.url, data.file, {
                    headers: data.headers,
                    onUploadProgress: ({ loaded, total, ...event }) => {
                        const percentCompleted = total
                            ? Math.floor((loaded / total) * 100)
                            : 0;
                        onProgress(data.path, percentCompleted);
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
        .patch(route("media.confirm"), {
            media: uploads.map(({ id }) => ({ id })),
        })
        .catch((error) => {
            // TODO: Add error tracking here when I have it.
            const message =
                isAxiosError(error) || error instanceof Error
                    ? error.message
                    : "Error generating a presigned url.";
            onError(message);
        });
}
