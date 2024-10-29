import { Checkbox, CheckboxField } from "@/components/checkbox";
import { Editor } from "@/components/editor";
import { ErrorMessage as Error, Form, Label } from "@/components/form";
import { Input } from "@/components/input";
import { Listbox, ListboxLabel, ListboxOption } from "@/components/listbox";
import useForm from "@/hooks/use-form";
import {
    SuccessfulUpload,
    Upload,
    useMediaUploader,
} from "@/hooks/use-media-uploader";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import { PropsWithClassName } from "@/types";
import { CategoryData, SourceData } from "@/types/app";
import { cn } from "@/utils/classnames";
import {
    Description,
    Dialog,
    DialogBackdrop,
    DialogPanel,
    DialogTitle,
    Field,
    Fieldset,
    Input as RawInput,
    InputProps,
    Legend,
} from "@headlessui/react";
import { Head } from "@inertiajs/react";
import {
    ChangeEventHandler,
    CSSProperties,
    FormEventHandler,
    HTMLInputTypeAttribute,
    MouseEventHandler,
    PropsWithChildren,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { set } from "zod";

export default function PostCreate({
    sources,
    categories,
}: {
    sources?: Array<SourceData>;
    categories: Array<CategoryData>;
}) {
    const [slug, setSlug] = useState("");
    const [showNewSource, setShowNewSource] = useState(!sources?.length);
    const { submit, errors } = useForm();
    const [newCategories, setNewCategories] = useState<Array<{ name: string }>>(
        []
    );
    const hasCategories = categories?.length || newCategories?.length;
    const [newCategory, setNewCategory] = useState<string | null>(
        hasCategories ? null : EMPTY_CATEGORY
    );

    const handleChangeSource: (value: string) => void = useCallback((value) => {
        if (value === "") {
            setShowNewSource(true);
        } else {
            setShowNewSource(false);
        }
    }, []);

    return (
        <AuthenticatedLayout>
            <Head title="Create Post" />

            <Form
                method="post"
                onSubmit={submit}
                className="p-6 mt-2 flex flex-col"
                encType="multipart/form-data"
            >
                <div className="flex justify-between items-center">
                    <div className="py-2">
                        <h2 className="font-medium text-lg">Create Post</h2>
                        <p className="text-sm text-foreground-muted">
                            All posts are created as drafts and need to be
                            published before they are visible to the public.
                        </p>
                    </div>
                    <button
                        type="button"
                        className="group/button button isolate relative text-white pt-[3px] pb-[5px] px-5 cursor-pointer"
                    >
                        <span className="absolute z-[-1] bg-gradient-to-b group-active/button:from-primary-600/70 from-primary-600/30 via-primary to-primary-400/50 rounded-sm inset-0.5"></span>
                        <span className="absolute z-[-2] bg-primary rounded-sm inset-0.5"></span>
                        <span className="absolute z-[-3] rounded-[4px] bg-gradient-to-b from-primary-300 via-primary to-primary-600 inset-0" />
                        <span className="absolute z-[-4] top-2 left-2 -right-2 -bottom-1 bg-foreground/20 group-active/button:-right-1 group-active/button:-bottom-0.5 group-active/button:-right-1 blur-sm" />
                        <span className="absolute -inset-[5px] rounded-[9px] z-[-5] bg-gradient-to-br from-primary/20 to-primary/30" />
                        <span className="absolute z-[-6] -left-[5px] -top-[5px] -bottom-[6px] -right-[6px] bg-white rounded-[8px]"></span>
                        Save Post
                    </button>
                </div>
                <div className="flex gap-12">
                    <div className="flex flex-col gap-3 flex-1">
                        <input type="hidden" name="slug" value={slug} />
                        <Field className="grid gap-1">
                            <Label>Title</Label>
                            <div className="rounded-sm border border-primary-900/30 bg-white flex flex-col focus-within:ring-2 focus-within:ring-primary-600/20 focus-within:border-primary-900/50">
                                <RawInput
                                    type="text"
                                    name="title"
                                    className="border-none py-1 px-2 focus:outline-none"
                                    onChange={(e) =>
                                        setSlug(slugify(e.target.value))
                                    }
                                />
                                <p className="bg-primary-600/10 text-primary-700 font-mono text-xs py-1 px-2">
                                    {slug.length
                                        ? slug
                                        : "Start typing to see slug"}
                                </p>
                            </div>
                            <Error>
                                {mergeErrors(errors, ["title", "slug"]) ??
                                    "This is an error"}
                            </Error>
                        </Field>
                        <Field>
                            <Label className="sr-only">Description</Label>
                            <Editor name="description" content="Hello world" />
                            <Error>{errors["description"]}</Error>
                        </Field>
                        <Field>
                            <Listbox
                                onChange={handleChangeSource}
                                name="source[id]"
                                defaultValue={sources?.[0]?.id.toString() ?? ""}
                            >
                                {sources?.map((source) => (
                                    <ListboxOption
                                        key={source.id}
                                        value={source.id.toString()}
                                    >
                                        <ListboxLabel>
                                            {source.name}
                                        </ListboxLabel>
                                    </ListboxOption>
                                ))}
                                <ListboxOption value="">
                                    New Source
                                </ListboxOption>
                            </Listbox>
                            <Error>{errors["source.id"]}</Error>
                        </Field>
                        {showNewSource ? (
                            <Fieldset className="grid gap-1">
                                <Legend>New Source</Legend>
                                <div className="flex gap-3">
                                    <SourceField>
                                        <SourceLabel>Name</SourceLabel>
                                        <SourceInput
                                            type="text"
                                            name="source[name]"
                                        />
                                        <Error>{errors["source.name"]}</Error>
                                    </SourceField>
                                    <SourceField>
                                        <SourceLabel>URL</SourceLabel>
                                        <SourceInput
                                            type="text"
                                            name="source[url]"
                                        />
                                        <Error> {errors["source.url"]}</Error>
                                    </SourceField>
                                </div>
                            </Fieldset>
                        ) : null}

                        <Field>
                            <Label>Media</Label>
                            <MediaField />
                            <Error>{errors["media"]}</Error>
                            <Error>{errors["media.*"]}</Error>
                        </Field>
                    </div>
                    <div className="flex-1 max-w-72 flex flex-col gap-2">
                        <PreviewField errors={errors} />
                        <PanelWrapper>
                            <Fieldset className="grid gap-1">
                                <Legend className="font-medium px-2">
                                    Categories
                                </Legend>
                                <Panel className="p-2 overflow-auto max-h-[308px] grid gap-1">
                                    {categories?.map((category, index) => (
                                        <CategoryInput
                                            value={category.id}
                                            label={category.name}
                                            index={index}
                                        />
                                    ))}
                                    {newCategories?.map((category, index) => (
                                        <CategoryInput
                                            label={category.name}
                                            index={categories.length + index}
                                            defaultChecked
                                        />
                                    ))}
                                </Panel>
                                {newCategory !== null || !hasCategories ? (
                                    <Panel className="p-2">
                                        <Field className="grid gap-1">
                                            <Label htmlFor="new-category">
                                                New Category
                                            </Label>
                                            <Input
                                                type="text"
                                                id="new-category"
                                                value={newCategory ?? ""}
                                                onChange={(e) =>
                                                    setNewCategory(
                                                        e.target.value
                                                    )
                                                }
                                            />
                                            <button
                                                type="button"
                                                className="bg-foreground text-background hover:bg-foreground-muted pt-[3px] pb-[5px] px-4 cursor-pointer rounded text-sm mt-1"
                                                onClick={() => {
                                                    if (newCategory?.length) {
                                                        setNewCategories(
                                                            (categories) => [
                                                                ...categories,
                                                                {
                                                                    name: newCategory,
                                                                },
                                                            ]
                                                        );
                                                        setNewCategory(null);
                                                    }
                                                }}
                                            >
                                                Add New
                                            </button>
                                        </Field>
                                    </Panel>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setNewCategory(EMPTY_CATEGORY)
                                        }
                                        className="bg-foreground text-background hover:bg-foreground-muted pt-[3px] pb-[5px] px-4 cursor-pointer rounded text-sm mt-1"
                                    >
                                        Add New
                                    </button>
                                )}
                            </Fieldset>
                        </PanelWrapper>
                    </div>
                </div>
            </Form>
        </AuthenticatedLayout>
    );
}

function PreviewField({ errors }: { errors: Record<string, string> }) {
    const [previewImage, setPreviewImage] = useState<SuccessfulUpload | null>(
        null
    );
    const [previewVideo, setPreviewVideo] = useState<SuccessfulUpload | null>(
        null
    );
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Fieldset>
                <legend className="sr-only">Preview</legend>
                <PreviewWrapper>
                    {previewImage && previewVideo ? (
                        <FullPreview
                            image={previewImage.file}
                            video={previewVideo.file}
                        />
                    ) : (
                        <button
                            className="w-full h-full"
                            onClick={() => setIsOpen(true)}
                            type="button"
                        >
                            Upload preview
                        </button>
                    )}
                </PreviewWrapper>
                {previewImage ? (
                    <input
                        type="hidden"
                        value={previewImage.id}
                        name="preview_image"
                    />
                ) : null}
                {previewVideo ? (
                    <input
                        type="hidden"
                        name="preview_video"
                        value={previewVideo.id}
                    />
                ) : null}
                <Error>{errors["preview_video"]}</Error>
                <Error>{errors["preview_image"]}</Error>
            </Fieldset>
            <Dialog
                open={isOpen}
                onClose={() => setIsOpen(false)}
                className="relative z-50"
            >
                <DialogBackdrop
                    transition
                    className="fixed inset-0 duration-300 ease-out bg-foreground/10 backdrop-blur opacity-100 data-[closed]:opacity-0"
                />
                <DialogPanel
                    transition
                    className="fixed top-2 right-2 bottom-2 w-80 rounded-md bg-background shadow-lg p-4 duration-300 ease-out translate-x-0 data-[closed]:translate-x-full"
                >
                    <DialogTitle className="font-medium">
                        Upload & Select Media
                    </DialogTitle>
                    <Description className="text-sm text-foreground-muted">
                        Use the options specified below to upload media to
                        storage for preview
                    </Description>
                    <div className="grid gap-3 mt-3">
                        <PreviewWrapper>
                            <UploadPreview
                                onSelect={setPreviewImage}
                                accept=".webp"
                            >
                                Upload Preview Image
                            </UploadPreview>
                        </PreviewWrapper>
                        <PreviewWrapper>
                            <UploadPreview
                                onSelect={setPreviewVideo}
                                accept=".webm"
                            >
                                Upload Preview Video
                            </UploadPreview>
                        </PreviewWrapper>
                    </div>
                </DialogPanel>
            </Dialog>
        </>
    );
}

function PanelWrapper({ children }: PropsWithChildren) {
    return (
        <div className="w-full rounded-md p-1 isolate before:absolute relative before:-inset-px before:bg-gradient-to-br before:from-primary-300/60 before:via-primary-200/80 before:to-primary-300/60 before:z-[-2] after:absolute after:inset-0 after:bg-primary-50/70 before:rounded-[7px] after:rounded-md after:z-[-1]">
            {children}
        </div>
    );
}

function Panel({ children, className }: PropsWithChildren<PropsWithClassName>) {
    return (
        <div className={cn(className, "bg-background rounded")}>{children}</div>
    );
}

function PreviewWrapper({ children }: PropsWithChildren) {
    return (
        <PanelWrapper>
            <div className="relative w-full h-full bg-primary-200 rounded aspect-[5/3] text-primary-700 cursor-pointer overflow-hidden">
                {children}
            </div>
        </PanelWrapper>
    );
}

function UploadPreview({
    onSelect,
    accept,
    children,
}: Pick<HTMLInputElement, "accept"> &
    PropsWithChildren<{ onSelect: (upload: SuccessfulUpload) => void }>) {
    const inputRef = useRef<HTMLInputElement>(null);
    const { uploads, save, error } = useMediaUploader();

    const upload = useMemo(() => uploads[0], [uploads]);

    useEffect(() => {
        if (upload?.state === "successful") {
            onSelect(upload);
        }
    }, [upload]);

    return upload ? (
        <div className="w-full h-full relative group/uploadPreview text-foreground">
            {upload.file.type.startsWith("image/") ? (
                <ImagePreview file={upload.file} />
            ) : (
                <VideoPreview file={upload.file} />
            )}
            <div
                className={cn(
                    "absolute inset-0 p-1 flex flex-col bg-gradient-to-b from-background/50 via-background/0 to-background/0 group-hover/uploadPreview:opacity-0 pointer-events-none"
                )}
            >
                <div className="flex items-baseline justify-between">
                    {upload.state === "processing" ? (
                        <div className="flex items-center gap-1.5 text-[10px] font-mono pl-2">
                            <progress
                                style={
                                    {
                                        "--progress-bar-bg":
                                            "var(--color-primary-100)",
                                        "--progress-bar":
                                            "var(--color-primary-600)",
                                    } as CSSProperties
                                }
                                className="h-1.5 rounded-full overflow-hidden"
                                value={upload.progress}
                                max={100}
                            />
                            <p>{upload.progress}%</p>
                        </div>
                    ) : (
                        <p className="font-mono text-[10px] pl-2">
                            {upload.file.name}
                        </p>
                    )}
                    <UploadStatus status={upload.state} />
                </div>
            </div>
        </div>
    ) : (
        <>
            <button
                onClick={() => inputRef.current?.click()}
                className="w-full h-full"
            >
                {children}
            </button>
            <input
                type="file"
                ref={inputRef}
                accept={accept}
                onChange={(e) => {
                    save(Array.from(e.target.files ?? []));
                }}
                className="sr-only"
            />
        </>
    );
}

const sharedStatusClasses = "rounded-sm py-px px-1.5 text-[10px] font-mono";
const colorClasses: Record<Upload["state"], string> = {
    unsigned: "bg-gray-500 text-gray-100",
    pending: "bg-blue-500 text-blue-100",
    processing: "bg-blue-500 text-blue-100",
    successful: "bg-green-500 text-green-100",
    failed: "bg-red-500 text-red-100",
};
function UploadStatus({ status }: { status: Upload["state"] }) {
    return (
        <span className={cn(sharedStatusClasses, colorClasses[status])}>
            {status}
        </span>
    );
}

function FullPreview({ image, video }: { image: File; video: File }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const videoReader = new FileReader();
        const imageReader = new FileReader();

        videoReader.addEventListener("load", () => {
            if (videoRef.current) {
                videoRef.current.src = videoReader.result as string;
            }
        });

        imageReader.addEventListener("load", () => {
            if (imageRef.current) {
                imageRef.current.src = imageReader.result as string;
            }
        });

        videoReader.readAsDataURL(video);
        imageReader.readAsDataURL(image);
    }, [video, image]);

    const handlePlay: MouseEventHandler = useCallback(() => {
        if (videoRef.current) {
            videoRef.current.play();
        }
    }, []);

    const handlePause: MouseEventHandler = useCallback(() => {
        {
            if (videoRef.current) {
                videoRef.current.pause();
            }
        }
    }, []);

    return (
        <div
            className="w-full h-full group/fullPreview relative"
            onMouseEnter={handlePlay}
            onMouseLeave={handlePause}
        >
            <img
                ref={imageRef}
                alt={image.name}
                className="object-cover group-hover/fullPreview:opacity-0 transition-opacity absolute inset-0"
            />
            <video ref={videoRef} loop className="w-full h-full object-cover" />
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
        <img ref={ref} alt={file.name} className="w-full h-full object-cover" />
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

    return <video ref={ref} controls className="w-full h-full object-cover" />;
}

function SourceField({ children }: PropsWithChildren) {
    return (
        <Field className="rounded-sm border border-primary-900/30 bg-white flex focus-within:ring-2 focus-within:ring-primary-600/20 focus-within:border-primary-900/50 flex-1">
            {children}
        </Field>
    );
}

function SourceLabel({ children }: PropsWithChildren) {
    return (
        <Label className="px-2 py-1 bg-primary-600/10 text-primary-700">
            {children}
        </Label>
    );
}

function SourceInput({ className, ...props }: PropsWithChildren<InputProps>) {
    return (
        <RawInput
            {...props}
            className="border-none py-1 px-2 focus:outline-none"
        />
    );
}

function CategoryInput({
    value,
    label,
    index,
    defaultChecked = false,
}: {
    value?: number;
    label: string;
    index: number;
    defaultChecked?: boolean;
}) {
    return (
        <CheckboxField>
            <Checkbox
                name={`categories[${index}][${value ? "id" : "name"}]`}
                value={value?.toString() ?? label}
                defaultChecked={defaultChecked}
            />
            {value ? null : (
                <input
                    type="hidden"
                    name={`categories[${index}][slug]`}
                    value={slugify(label)}
                />
            )}
            <Label>{label}</Label>
        </CheckboxField>
    );
}

function MediaField() {
    const [mediaList, setMediaList] = useState<Array<SuccessfulUpload>>([]);
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            <PanelWrapper>
                <Panel>
                    <button type="button" onClick={() => setIsOpen(true)}>
                        Add Media
                    </button>
                    <div className="flex flex-col gap-2 mt-4">
                        {mediaList.map(({ file }) => {
                            return (
                                <div className="flex gap-2 items-center">
                                    <div className="px-2 cursor-move">
                                        <Drag size="w-2" />
                                    </div>
                                    <div className="aspect-[5/3] w-32 object-cover">
                                        {file.type.startsWith("image/") ? (
                                            <ImagePreview file={file} />
                                        ) : (
                                            <VideoPreview file={file} />
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Panel>
            </PanelWrapper>
            <Dialog
                open={isOpen}
                onClose={() => setIsOpen(false)}
                className="relative z-50"
            >
                <DialogBackdrop
                    transition
                    className="fixed inset-0 duration-300 ease-out bg-foreground/10 backdrop-blur opacity-100 data-[closed]:opacity-0"
                />
                <DialogPanel
                    transition
                    className="fixed top-2 right-2 bottom-2 w-80 rounded-md bg-background shadow-lg duration-300 ease-out translate-x-0 data-[closed]:translate-x-full flex flex-col overflow-hidden"
                >
                    <div className="p-4">
                        <DialogTitle className="font-medium">
                            Upload & Select Media
                        </DialogTitle>
                        <Description className="text-sm text-foreground-muted">
                            Use the options specified below to upload media to
                            storage
                        </Description>
                    </div>
                    <div className="gap-3 mt-3 flex-1 flex-col flex overflow-y-auto overflow-x-hidden relative">
                        <MultipleUploadPreview
                            accept=".webm,.webp"
                            onSelect={(uploads) => {
                                setMediaList(uploads);
                                setIsOpen(false);
                            }}
                        />
                    </div>
                </DialogPanel>
            </Dialog>
        </>
    );
}

function MultipleUploadPreview({
    onSelect,
    accept,
}: Pick<HTMLInputElement, "accept"> & {
    onSelect: (uploads: SuccessfulUpload[]) => void;
}) {
    const inputRef = useRef<HTMLInputElement>(null);
    const { uploads, save, error } = useMediaUploader();
    const [selectedUploads, setSelectedUploads] = useState<
        Record<string, SuccessfulUpload>
    >({});

    return (
        <>
            <div className="flex gap-2 sticky top-0 z-10 bg-background/80 backdrop-blur px-2">
                <button
                    className="text-sm py-1 px-2"
                    onClick={() => inputRef.current?.click()}
                >
                    Add Media
                </button>
                <button
                    className="text-sm py-1 px-2"
                    onClick={() => onSelect(Object.values(selectedUploads))}
                >
                    Save Selection
                </button>
            </div>
            <input
                multiple
                type="file"
                ref={inputRef}
                accept={accept}
                onChange={(e) => {
                    save(Array.from(e.target.files ?? []));
                }}
                className="sr-only"
            />
            <div className="flex-1">
                {uploads.map(({ key, ...upload }) => {
                    const selected = selectedUploads[key];
                    return (
                        <div
                            key={key}
                            className={cn(
                                selected && "ring ring-primary",
                                "relative"
                            )}
                        >
                            <div className="w-full h-full relative group/uploadPreview text-foreground">
                                {upload.file.type.startsWith("image/") ? (
                                    <ImagePreview file={upload.file} />
                                ) : (
                                    <VideoPreview file={upload.file} />
                                )}
                                <div
                                    className={cn(
                                        "absolute inset-0 p-1 flex flex-col bg-gradient-to-b from-background/50 via-background/0 to-background/0 group-hover/uploadPreview:opacity-0 pointer-events-none"
                                    )}
                                >
                                    <div className="flex items-baseline justify-between">
                                        {upload.state === "processing" ? (
                                            <div className="flex items-center gap-1.5 text-[10px] font-mono pl-2">
                                                <progress
                                                    style={
                                                        {
                                                            "--progress-bar-bg":
                                                                "var(--color-primary-100)",
                                                            "--progress-bar":
                                                                "var(--color-primary-600)",
                                                        } as CSSProperties
                                                    }
                                                    className="h-1.5 rounded-full overflow-hidden"
                                                    value={upload.progress}
                                                    max={100}
                                                />
                                                <p>{upload.progress}%</p>
                                            </div>
                                        ) : (
                                            <p className="font-mono text-[10px] pl-2">
                                                {upload.file.name}
                                            </p>
                                        )}
                                        <UploadStatus status={upload.state} />
                                    </div>
                                </div>
                            </div>
                            {upload.state === "successful" ? (
                                <button
                                    className="absolute inset-0"
                                    onClick={() =>
                                        setSelectedUploads((prev) => {
                                            const next = { ...prev };
                                            const selected = prev[key];
                                            if (selected) {
                                                delete next[key];
                                            } else {
                                                next[key] = { key, ...upload };
                                            }
                                            return next;
                                        })
                                    }
                                >
                                    <span className="sr-only">
                                        {selected ? "Deselect" : "Select"}{" "}
                                        {upload.file.name}
                                    </span>
                                </button>
                            ) : null}
                        </div>
                    );
                })}
            </div>
        </>
    );
}

function MediaUploadPreview(upload: Upload) {
    return (
        <div className="w-full h-full relative group/uploadPreview text-foreground">
            {upload.file.type.startsWith("image/") ? (
                <ImagePreview file={upload.file} />
            ) : (
                <VideoPreview file={upload.file} />
            )}
            <div
                className={cn(
                    "absolute inset-0 p-1 flex flex-col bg-gradient-to-b from-background/50 via-background/0 to-background/0 group-hover/uploadPreview:opacity-0 pointer-events-none"
                )}
            >
                <div className="flex items-baseline justify-between">
                    {upload.state === "processing" ? (
                        <div className="flex items-center gap-1.5 text-[10px] font-mono pl-2">
                            <progress
                                style={
                                    {
                                        "--progress-bar-bg":
                                            "var(--color-primary-100)",
                                        "--progress-bar":
                                            "var(--color-primary-600)",
                                    } as CSSProperties
                                }
                                className="h-1.5 rounded-full overflow-hidden"
                                value={upload.progress}
                                max={100}
                            />
                            <p>{upload.progress}%</p>
                        </div>
                    ) : (
                        <p className="font-mono text-[10px] pl-2">
                            {upload.file.name}
                        </p>
                    )}
                    <UploadStatus status={upload.state} />
                </div>
            </div>
        </div>
    );
}

export function Drag({
    size = "w-4 h-auto",
    className,
}: PropsWithClassName<{
    size?: string;
}>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 13.57 22.14"
            className={cn("text-foreground-muted", size, className)}
        >
            <path
                className="fill-current"
                d="M0,2.5c0,1.38,1.12,2.5,2.5,2.5,1.38,0,2.5-1.12,2.5-2.5h0C5,1.12,3.88,0,2.5,0S0,1.12,0,2.5H0"
            />
            <path
                className="fill-current"
                d="M0,11.07c0,1.38,1.12,2.5,2.5,2.5,1.38,0,2.5-1.12,2.5-2.5h0c0-1.38-1.12-2.5-2.5-2.5C1.12,8.57,0,9.69,0,11.07H0"
            />
            <path
                className="fill-current"
                d="M0,19.64c0,1.38,1.12,2.5,2.5,2.5s2.5-1.12,2.5-2.5h0c0-1.38-1.12-2.5-2.5-2.5C1.12,17.14,0,18.26,0,19.64H0"
            />
            <path
                className="fill-current"
                d="M8.57,2.5c0,1.38,1.12,2.5,2.5,2.5,1.38,0,2.5-1.12,2.5-2.5h0C13.57,1.12,12.45,0,11.07,0c-1.38,0-2.5,1.12-2.5,2.5h0"
            />
            <path
                className="fill-current"
                d="M8.57,11.07c0,1.38,1.12,2.5,2.5,2.5,1.38,0,2.5-1.12,2.5-2.5h0c0-1.38-1.12-2.5-2.5-2.5-1.38,0-2.5,1.12-2.5,2.5h0"
            />
            <path
                className="fill-current"
                d="M8.57,19.64c0,1.38,1.12,2.5,2.5,2.5,1.38,0,2.5-1.12,2.5-2.5h0c0-1.38-1.12-2.5-2.5-2.5-1.38,0-2.5,1.12-2.5,2.5h0"
            />
        </svg>
    );
}

const EMPTY_CATEGORY: string = "";

function slugify(text: string): string {
    return text
        .trim() // Remove whitespace from both ends
        .toLowerCase() // Convert to lowercase
        .replace(/[\s\W-]+/g, "-") // Replace spaces and non-word characters with a hyphen
        .replace(/^-+|-+$/g, ""); // Remove leading and trailing hyphens
}

function mergeErrors(errors: Record<string, string>, keys: string[]): string {
    return keys.flatMap((key) => (errors[key] ? [errors[key]] : [])).join(". ");
}
