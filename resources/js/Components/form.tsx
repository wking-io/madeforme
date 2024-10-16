import {
    ComponentPropsWithoutRef,
    FormHTMLAttributes,
    HTMLAttributes,
    PropsWithChildren,
} from "react";

export function Error({ error }: { error: string }) {
    return <p className="text-red-500">{error}</p>;
}

export function Form({
    children,
    onSubmit,
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
        <form {...props} onSubmit={handleSubmit}>
            {children}
        </form>
    );
}
