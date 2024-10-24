import { Checkbox, CheckboxField } from "@/components/checkbox";
import { ErrorMessage as Error, Form } from "@/components/form";
import { Listbox, ListboxLabel, ListboxOption } from "@/components/listbox";
import useForm from "@/hooks/use-form";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import { CategoryData, SourceData } from "@/types/app";
import {
    Field,
    Fieldset,
    Input,
    InputProps,
    Label,
    Legend,
} from "@headlessui/react";
import { Head } from "@inertiajs/react";
import {
    ChangeEventHandler,
    FormEventHandler,
    PropsWithChildren,
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
                        <span className="absolute z-[-1] bg-gradient-to-b group-active/button:from-pink-700/30 from-pink-600/30 via-pink to-pink-400 rounded-sm inset-0.5"></span>
                        <span className="absolute z-[-2] bg-pink rounded-sm inset-0.5"></span>
                        <span className="absolute z-[-3] rounded-[4px] bg-gradient-to-b group-active/button:from-pink-500 group-active/button:via-pink-600 group-active/button:to-pink-700/50 from-pink-300 via-pink to-pink-600 inset-0" />
                        <span className="absolute z-[-4] top-4 left-4 -right-3 -bottom-2 bg-foreground/20 group-active/button:-right-1 group-active/button:-bottom-1 group-active/button:blur-sm blur" />
                        <span className="absolute -inset-[5px] rounded-[9px] z-[-5] bg-gradient-to-br from-pink/20 to-pink/30" />
                        <span className="absolute z-[-6] -left-[5px] -top-[5px] -bottom-[6px] -right-[6px] bg-white rounded-[8px]"></span>
                        Save Post
                    </button>
                </div>
                <div className="flex gap-12">
                    <div className="flex flex-col gap-3 flex-1">
                        <input type="hidden" name="slug" value={slug} />
                        <Field className="grid gap-1">
                            <Label>Title</Label>
                            <div className="rounded-sm border border-pink-900/30 bg-white flex flex-col focus-within:ring-2 focus-within:ring-pink-600/20 focus-within:border-pink-900/50">
                                <Input
                                    type="text"
                                    name="title"
                                    className="border-none py-1 px-2 focus:outline-none"
                                    onChange={(e) =>
                                        setSlug(slugify(e.target.value))
                                    }
                                />
                                <p className="bg-pink-600/10 text-pink-700 font-mono text-xs py-1 px-2">
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
                            <Label>Description</Label>
                            <input type="text" name="description" />
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
                                        <SourceLabel>Source Name</SourceLabel>
                                        <SourceInput
                                            type="text"
                                            name="source[name]"
                                        />
                                        <Error>{errors["source.name"]}</Error>
                                    </SourceField>
                                    <SourceField>
                                        <SourceLabel>Source URL</SourceLabel>
                                        <SourceInput
                                            type="text"
                                            name="source[url]"
                                        />
                                        <Error> {errors["source.url"]}</Error>
                                    </SourceField>
                                </div>
                            </Fieldset>
                        ) : null}
                        <Fieldset>
                            <Legend>Categories</Legend>
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
                            {newCategory !== null || !hasCategories ? (
                                <Field>
                                    <Label htmlFor="new-category">
                                        New Category
                                    </Label>
                                    <input
                                        type="text"
                                        id="new-category"
                                        value={newCategory ?? ""}
                                        onChange={(e) =>
                                            setNewCategory(e.target.value)
                                        }
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (newCategory?.length) {
                                                setNewCategories(
                                                    (categories) => [
                                                        ...categories,
                                                        { name: newCategory },
                                                    ]
                                                );
                                                setNewCategory(null);
                                            }
                                        }}
                                    >
                                        Add New
                                    </button>
                                </Field>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() =>
                                        setNewCategory(EMPTY_CATEGORY)
                                    }
                                >
                                    Add New
                                </button>
                            )}
                        </Fieldset>
                    </div>
                    <div className="flex-1 max-w-72">
                        <Field>
                            <Label>Preview Image</Label>
                            <input
                                type="file"
                                name="preview_image"
                                accept=".webp"
                            />
                            <Error>{errors["preview_image"]}</Error>
                        </Field>
                        <Field>
                            <Label>Preview Video</Label>
                            <input
                                type="file"
                                name="preview_video"
                                accept=".webm"
                            />
                            <Error>{errors["preview_video"]}</Error>
                        </Field>
                        <Field>
                            <Label>Media</Label>
                            <input
                                type="file"
                                name="media[]"
                                multiple
                                accept=".webp,.webm"
                            />
                            <Error>{errors["media"]}</Error>
                            <Error>{errors["media.*"]}</Error>
                        </Field>
                    </div>
                </div>
            </Form>
        </AuthenticatedLayout>
    );
}

function SourceField({ children }: PropsWithChildren) {
    return (
        <Field className="rounded-sm border border-pink-900/30 bg-white flex focus-within:ring-2 focus-within:ring-pink-600/20 focus-within:border-pink-900/50 flex-1">
            {children}
        </Field>
    );
}

function SourceLabel({ children }: PropsWithChildren) {
    return (
        <Label className="px-2 py-1 bg-pink-600/10 text-pink-700">
            {children}
        </Label>
    );
}

function SourceInput({ className, ...props }: PropsWithChildren<InputProps>) {
    return (
        <Input
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
