import { ErrorMessage as Error, Form } from "@/components/form";
import useForm from "@/hooks/use-form";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import { CategoryData, SourceData } from "@/types/app";
import { Head } from "@inertiajs/react";
import {
    ChangeEventHandler,
    FormEventHandler,
    useCallback,
    useState,
} from "react";

export default function PostCreate({
    sources,
    categories,
}: {
    sources?: Array<SourceData>;
    categories: Array<CategoryData>;
}) {
    const [showNewSource, setShowNewSource] = useState(!sources?.length);
    const { submit, errors } = useForm();
    const [newCategories, setNewCategories] = useState<Array<{ name: string }>>(
        []
    );
    const hasCategories = categories?.length || newCategories?.length;
    const [newCategory, setNewCategory] = useState<string | null>(
        hasCategories ? null : EMPTY_CATEGORY
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
            <Form
                method="post"
                onSubmit={submit}
                className="flex flex-col"
                encType="multipart/form-data"
            >
                <label>Title</label>
                <input type="text" name="title" />
                <Error error={errors["title"]} />
                <label>Description</label>
                <input type="text" name="description" />
                <Error error={errors["description"]} />
                <label>Slug</label>
                <input type="text" name="slug" />
                <Error error={errors["slug"]} />
                <select onChange={handleChangeSource} name="source[id]">
                    {sources?.map((source) => (
                        <option key={source.id} value={source.id}>
                            {source.name}
                        </option>
                    ))}
                    <option value="">New Source</option>
                </select>
                <Error error={errors["source.id"]} />
                {showNewSource ? (
                    <>
                        <label>Source Name</label>
                        <input type="text" name="source[name]" />
                        <Error error={errors["source.name"]} />
                        <label>Source URL</label>
                        <input type="text" name="source[url]" />
                        <Error error={errors["source.url"]} />
                    </>
                ) : null}
                <label>Preview Image</label>
                <input type="file" name="preview_image" accept=".webp" />
                <Error error={errors["preview_image"]} />
                <label>Preview Video</label>
                <input type="file" name="preview_video" accept=".webm" />
                <Error error={errors["preview_video"]} />
                <label>Media</label>
                <input
                    type="file"
                    name="media[]"
                    multiple
                    accept=".webp,.webm"
                />
                <Error error={errors["media"]} />
                <Error error={errors["media.*"]} />
                <fieldset>
                    <legend>Categories</legend>
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
                        />
                    ))}
                    {newCategory !== null || !hasCategories ? (
                        <div>
                            <label htmlFor="new-category">New Category</label>
                            <input
                                type="text"
                                id="new-category"
                                value={newCategory ?? ""}
                                onChange={(e) => setNewCategory(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    if (newCategory?.length) {
                                        setNewCategories((categories) => [
                                            ...categories,
                                            { name: newCategory },
                                        ]);
                                        setNewCategory(null);
                                    }
                                }}
                            >
                                Add New
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setNewCategory(EMPTY_CATEGORY)}
                        >
                            Add New
                        </button>
                    )}
                </fieldset>
                <button type="submit">Save Post</button>
            </Form>
        </AuthenticatedLayout>
    );
}

function CategoryInput({
    value,
    label,
    index,
}: {
    value?: number;
    label: string;
    index: number;
}) {
    const id = `cat-${label}`;
    return (
        <div className="">
            <input
                type="checkbox"
                name={`categories[${index}][${value ? "id" : "name"}]`}
                value={value ?? label}
                id={id}
            />
            {value ? null : (
                <input
                    type="hidden"
                    name={`categories[${index}][slug]`}
                    value={slugify(label)}
                />
            )}
            <label htmlFor={id}>{label}</label>
        </div>
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
