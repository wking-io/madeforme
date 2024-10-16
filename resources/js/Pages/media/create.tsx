import { Error, Form } from "@/components/form";
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
    const { submit, errors } = useForm();

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
                method="post"
                onSubmit={submit}
                className="flex flex-col"
                encType="multipart/form-data"
            >
                <label>Media</label>
                <input
                    type="file"
                    name="media[]"
                    multiple
                    accept=".webp,.webm"
                />
                <Error error={errors["media"]} />
                <Error error={errors["media.*"]} />
                <button type="submit">Save Post</button>
            </Form>
        </AuthenticatedLayout>
    );
}
