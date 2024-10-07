import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import {
    ChangeEventHandler,
    FormEventHandler,
    useCallback,
    useState,
} from "react";

export default function PostCreate({
    sources,
}: {
    sources?: Array<{ id: string; name: string }>;
}) {
    const [showNewSource, setShowNewSource] = useState(!sources?.length);
    const { data, setData, post, errors } = useForm({
        title: "",
        description: "",
        slug: "",
        source_id: sources?.[0]?.id ?? "",
        source_name: "",
        source_url: "",
        preview_image: undefined as File | undefined,
    });

    console.log(errors);

    const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback(
        (e) => {
            e.preventDefault();
            post("/admin/posts/create");
        },
        [post]
    );

    const handleChangeSource: ChangeEventHandler<HTMLSelectElement> =
        useCallback((e) => {
            if (e.target.value === "new") {
                setShowNewSource(true);
                setData("source_id", "");
            } else {
                setShowNewSource(false);
                setData("source_id", e.target.value);
            }
        }, []);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Create Post
                </h2>
            }
        >
            <Head title="Create Post" />
            <form
                onSubmit={handleSubmit}
                className="flex flex-col"
                encType="multipart/form-data"
            >
                <label>Title</label>
                <input
                    type="text"
                    value={data.title}
                    onChange={(e) => {
                        setData("title", e.target.value);
                    }}
                />
                <label>Description</label>
                <input
                    type="text"
                    value={data.description}
                    onChange={(e) => {
                        setData("description", e.target.value);
                    }}
                />
                <label>Slug</label>
                <input
                    type="text"
                    value={data.slug}
                    onChange={(e) => {
                        setData("slug", e.target.value);
                    }}
                />
                <select onChange={handleChangeSource}>
                    {sources?.map((source) => (
                        <option key={source.id} value={source.id}>
                            {source.name}
                        </option>
                    ))}
                    <option value="new">New Source</option>
                </select>
                {showNewSource ? (
                    <>
                        <label>Source Name</label>
                        <input
                            type="text"
                            value={data.source_name}
                            onChange={(e) => {
                                setData("source_name", e.target.value);
                            }}
                        />
                        <label>Source URL</label>
                        <input
                            type="text"
                            value={data.source_url}
                            onChange={(e) => {
                                setData("source_url", e.target.value);
                            }}
                        />
                    </>
                ) : null}
                <input
                    type="file"
                    name="preview_image"
                    onChange={(e) => {
                        setData("preview_image", e.target.files?.[0]);
                    }}
                />
                <button type="submit">Save Post</button>
            </form>
        </AuthenticatedLayout>
    );
}
