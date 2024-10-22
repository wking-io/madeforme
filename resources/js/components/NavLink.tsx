import { cn } from "@/utils/classnames";
import { InertiaLinkProps, Link } from "@inertiajs/react";

export default function NavLink({
    active = false,
    className = "",
    children,
    ...props
}: InertiaLinkProps & { active: boolean }) {
    return (
        <Link
            {...props}
            className={cn(
                "isolate relative p-4",
                active
                    ? "bg-foreground text-background"
                    : "bg-background text-foreground",
                className
            )}
        >
            {children}
        </Link>
    );
}
