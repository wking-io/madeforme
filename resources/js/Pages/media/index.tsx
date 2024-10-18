import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { MediaSummary } from "@/types/app";

export default function Posts({ media }: { media: Array<MediaSummary> }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Media
                </h2>
            }
        >
            <Head title="Media" />

            {media.length ? (
                <ul>
                    {media.map((item) => (
                        <li key={item.id}>
                            {item.path} -{" "}
                            {item.status === "confirmed"
                                ? "Confirmed"
                                : "Pending"}
                        </li>
                    ))}
                </ul>
            ) : null}
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <Link href={route("media.create")}>Upload Media</Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
