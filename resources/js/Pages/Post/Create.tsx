import useForm from "@/hooks/use-form";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
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
    const { submit, errors } = useForm();

    console.log(errors);

    const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback(
        (e) => {
            e.preventDefault();
            if (e.target instanceof HTMLFormElement) {
                submit(e.target);
            } else {
                console.error("Form element not found");
            }
        },
        [submit]
    );

    const handleChangeSource: ChangeEventHandler<HTMLSelectElement> =
        useCallback((e) => {
            if (e.target.value === "") {
                setShowNewSource(true);
            } else {
                setShowNewSource(false);
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
                method="post"
                onSubmit={handleSubmit}
                className="flex flex-col"
                encType="multipart/form-data"
            >
                <label>Title</label>
                <input type="text" name="title" />
                <label>Description</label>
                <input type="text" name="description" />
                <label>Slug</label>
                <input type="text" name="slug" />
                <select onChange={handleChangeSource} name="source[id]">
                    {sources?.map((source) => (
                        <option key={source.id} value={source.id}>
                            {source.name}
                        </option>
                    ))}
                    <option value="">New Source</option>
                </select>
                {showNewSource ? (
                    <>
                        <label>Source Name</label>
                        <input type="text" name="source[name]" />
                        <label>Source URL</label>
                        <input type="text" name="source[url]" />
                    </>
                ) : null}
                <input type="file" name="preview_image" />
                <button type="submit">Save Post</button>
            </form>
        </AuthenticatedLayout>
    );
}
