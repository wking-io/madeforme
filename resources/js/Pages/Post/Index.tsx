import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function Posts({
    posts,
}: {
    posts: Array<{
        id: string;
        title: string;
        description: string;
    }>;
}) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Posts
                </h2>
            }
        >
            <Head title="Posts" />

            {posts.length ? (
                <ul>
                    {posts.map((post) => (
                        <li key={post.id}>
                            <Link href={route("post.edit", post.id)}>
                                {post.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : null}
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <Link href={route("post.create")}>Create Post</Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
