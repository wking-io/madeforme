import { PageProps, PropsWithClassName } from "@/types";
import { cn } from "@/utils/classnames";
import { Head, Link } from "@inertiajs/react";

export default function Welcome({
    auth,
    laravelVersion,
    phpVersion,
}: PageProps<{ laravelVersion: string; phpVersion: string }>) {
    return (
        <div className="flex flex-col gap-16 items-center justify-center min-h-screen">
            <Link href="/login" className="text-2xl font-bold text-blue-500">
                Login
            </Link>
            <Link href="/register" className="text-2xl font-bold text-blue-500">
                Register
            </Link>
            <Link
                href="/dashboard"
                className="text-2xl font-bold text-blue-500"
            >
                Dashboard
            </Link>
        </div>
    );
}
