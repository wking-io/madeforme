import { z } from "zod";
import { ErrorMessage, Form } from "@/components/form";
import useForm from "@/hooks/use-form";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import { CategoryData, SourceData, SignatureData } from "@/types/app";
import { Head, router } from "@inertiajs/react";
import { sign } from "crypto";
import {
    ChangeEventHandler,
    FormEventHandler,
    useCallback,
    useState,
} from "react";
import axios from "axios";

const signatureDataSchema = z.record(
    z.object({
        id: z.number(),
        path: z.string(),
        url: z.string(),
        headers: z.any(),
    })
);

type ClientSignatureData = SignatureData & {
    file: File;
    progress: null | number;
    headers: any;
};

function filterOutExistingSignatures({
    signatures,
    files,
}: {
    signatures: Record<string, ClientSignatureData>;
    files: FileList;
}): Array<File> {
    return Array.from(files).filter(
        (file) => signatures[file.name] === undefined
    );
}

interface UploadProps {
    name: string
    size: number
    type: string
}

function processFiles(files: Array<File>) {
    return files.reduce<{
        uploads: UploadProps[];
        fileMap: Record<string, File>;
    }>(
        ({uploads, fileMap}, file) => {
            // const name = `${crypto.randomUUID()}.${file.name.split(".").pop()}`;
            fileMap[name] = file.name;
            uploads.push({
                name:file.name,
                type: file.type,
                size: file.size,
            });
            return {uploads, fileMap};
        },
        {uploads: [], fileMap: {}}
    );
}

class UploadError extends Error {
    public statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message); // Pass the message to the base Error class
        this.statusCode = statusCode;

        // Maintains proper stack trace (only available on V8 engines like in Chrome, Node.js)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, UploadError);
        }

        this.name = "UploadError"; // Assign a custom name to your error type
    }
}

function uploadFileToR2({
    url,
    file,
    onProgress,
}: {
    url: string;
    file: File;
    onProgress?: (percent: number) => void;
}) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        // Open the request with the PUT method (since presigned URLs typically use PUT)
        xhr.open("PUT", url, true);

        // Set the content type of the file (this should match what the presigned URL expects)
        xhr.setRequestHeader("Content-Type", file.type);

        // Set up event listener for tracking upload progress
        xhr.upload.onprogress = function (event) {
            if (event.lengthComputable && onProgress) {
                const percentComplete = (event.loaded / event.total) * 100;
                onProgress(percentComplete);
            }
        };

        // Set up event listener for successful upload
        xhr.onload = function () {
            if (xhr.status === 200) {
                resolve(true);
            } else {
                reject(
                    new UploadError(
                        `Failed to upload file: ${xhr.statusText}`,
                        xhr.status
                    )
                );
            }
        };

        // Set up event listener for error during upload
        xhr.onerror = function () {
            reject(
                new UploadError(
                    `Failed to upload file: ${xhr.statusText}`,
                    xhr.status
                )
            );
        };

        xhr.send(file);
    });
}

export default function PostCreate() {
    const { submit, errors } = useForm();
    const [signatures, setSignatures] = useState<
        Record<string, ClientSignatureData>
    >({});

    const handleSubmit = useCallback(
        (form: HTMLFormElement) => {
            Promise.all(
                Object.entries(signatures).map(([key, signature]) => {
                    console.log(signature.headers);
                    return axios.put(signature.url, signature.file, {
                        headers: signature.headers,
                        // onUploadProgress(progress) {
                        //     setSignatures((prev) => {
                        //         const signature = prev[key];
                        //         if (!signature) return prev;

                        //         return {
                        //             ...prev,
                        //             [key]: {
                        //                 ...prev[key],
                        //                 progress: Math.round(
                        //                     progress.loaded / progress.total
                        //                 ),
                        //             },
                        //         };
                        //     });
                        // },
                    });
                })
            )
                .then(() => submit(form))
                .catch(console.error);
            // submit(form);
        },
        [signatures]
    );

    const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback(
        (e) => {
            const files = e.target.files;
            if (!files) {
                return;
            }

            const { fileMap, uploads } = processFiles(
                filterOutExistingSignatures({ signatures, files })
            );

            router.post(
                route("media.store"),
                { uploads },
                {
                    onError(errors) {
                        console.error(errors);
                    },
                    onSuccess(page) {
                        const validation = signatureDataSchema.safeParse(
                            page.props.signatures
                        );

                        if (!validation.success) {
                            console.log(validation.error);
                            return {};
                        }

                        let newSignatures: Record<string, ClientSignatureData> =
                            {};

                        for (const key in validation.data) {
                            const file = fileMap[key];
                            if (file) {
                                newSignatures[key] = {
                                    ...validation.data[key],
                                    file,
                                    progress: null,
                                };
                            }
                        }

                        setSignatures((prev) => ({
                            ...prev,
                            ...newSignatures,
                        }));
                    },
                }
            );
        },
        [signatures]
    );
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Create Media
                </h2>
            }
        >
            <Head title="Create Media" />
            <Form
                method="patch"
                onSubmit={handleSubmit}
                className="flex flex-col"
                encType="multipart/form-data"
            >
                {Object.values(signatures).map((signature, index) => (
                    <input
                        key={signature.id}
                        type="hidden"
                        name={`media[${index}][id]`}
                        value={signature.id}
                    />
                ))}
                <label>Media</label>
                <input
                    type="file"
                    multiple
                    accept=".webp,.webm"
                    onChange={handleChange}
                />
                <ErrorMessage error={errors["media"]} />
                <ErrorMessage error={errors["media.*"]} />
                <button type="submit">Save Post</button>
            </Form>
        </AuthenticatedLayout>
    );
}
