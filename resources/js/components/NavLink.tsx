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
                "isolate relative px-4 py-5 transition-colors",
                active ? "text-background" : "text-foreground",
                className
            )}
        >
            {children}
        </Link>
    );
}
