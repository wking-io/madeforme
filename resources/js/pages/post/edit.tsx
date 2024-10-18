import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import { PostDetail, SourceData } from "@/types/app";
import { Head, Link, useForm } from "@inertiajs/react";
import {
    ChangeEventHandler,
    FormEventHandler,
    useCallback,
    useState,
} from "react";

export default function PostEdit({
    post: { source, ...post },
    sources,
}: {
    post: PostDetail;
    sources: Array<SourceData>;
}) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Edit Post
                </h2>
            }
        >
            <Head title="Create Post" />
        </AuthenticatedLayout>
    );
}
