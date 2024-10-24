import { cn } from "@/utils/classnames";
import * as Headless from "@headlessui/react";
import { FormHTMLAttributes, PropsWithChildren } from "react";

export function ErrorMessage({
    children,
    className,
    ...props
}: { className?: string } & Omit<
    Headless.DescriptionProps,
    "as" | "className"
>) {
    return children ? (
        <Headless.Description
            data-slot="error"
            {...props}
            className={cn(
                className,
                "text-base/6 text-red-600 data-[disabled]:opacity-50 sm:text-sm/6 dark:text-red-500"
            )}
        />
    ) : null;
}

export function Label({
    className,
    ...props
}: { className?: string } & Omit<Headless.LabelProps, "as" | "className">) {
    return (
        <Headless.Label
            data-slot="label"
            {...props}
            className={cn(
                className,
                "select-none font-medium text-sm text-foreground-muted data-[disabled]:opacity-50"
            )}
        />
    );
}

export function Form({
    children,
    onSubmit,
    method,
    ...props
}: Omit<FormHTMLAttributes<HTMLFormElement>, "onSubmit"> &
    PropsWithChildren<{ onSubmit(form: HTMLFormElement): void }>) {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (e.target instanceof HTMLFormElement) {
            onSubmit(e.target);
        } else {
            console.error("Form element not found");
        }
    };

    return (
        <form
            {...props}
            onSubmit={handleSubmit}
            method={method === "get" ? "get" : "post"}
        >
            {method && <input type="hidden" name="_method" value={method} />}
            {children}
        </form>
    );
}
