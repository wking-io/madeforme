import { ErrorMessage } from "@/components/form";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import {
    useMediaUploader,
    Upload as TUpload,
} from "@/hooks/use-media-uploader";
import { useEffect, useRef } from "react";

export default function PostCreate() {
    const { uploads, save, error } = useMediaUploader();

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Create Media
                </h2>
            }
        >
            <Head title="Create Media" />
            <label>Media</label>
            <input
                type="file"
                multiple
                accept=".webp,.webm"
                onChange={(e) => save(Array.from(e.target.files ?? []))}
            />
            {error && <ErrorMessage error={error} />}
            {uploads.map(({ key, ...upload }) => (
                <Upload key={key} {...upload} />
            ))}
        </AuthenticatedLayout>
    );
}

function Upload(upload: TUpload) {
    return (
        <div className="flex gap-2">
            <div className="w-32">
                {upload.file.type.startsWith("image/") ? (
                    <ImagePreview file={upload.file} />
                ) : (
                    <VideoPreview file={upload.file} />
                )}
            </div>
            <div>
                <div>{upload.file.name}</div>
                <div>{upload.state}</div>
                {upload.state === "processing" ? (
                    <div className="flex items-center gap-1.5 text-xs">
                        <progress
                            className="h-2 rounded-full overflow-hidden"
                            value={upload.progress}
                            max={100}
                        />
                        <p>{upload.progress}%</p>
                    </div>
                ) : null}
            </div>
        </div>
    );
}

function ImagePreview({ file }: { file: File }) {
    const ref = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            if (ref.current) {
                ref.current.src = reader.result as string;
            }
        });

        reader.readAsDataURL(file);
    }, [file]);

    return (
        <div className="bg-gray-100">
            <img ref={ref} alt={file.name} />
        </div>
    );
}

function VideoPreview({ file }: { file: File }) {
    const ref = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            if (ref.current) {
                ref.current.src = reader.result as string;
            }
        });

        reader.readAsDataURL(file);
    }, [file]);

    return (
        <div className="bg-gray-100">
            <video ref={ref} controls />
        </div>
    );
}
