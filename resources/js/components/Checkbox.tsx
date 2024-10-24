import { cn } from "@/utils/classnames";
import * as Headless from "@headlessui/react";
import type React from "react";

export function CheckboxGroup({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    return (
        <div
            data-slot="control"
            {...props}
            className={cn(
                className,
                // Basic groups
                "space-y-3",
                // With descriptions
                "has-[[data-slot=description]]:space-y-6 [&_[data-slot=label]]:has-[[data-slot=description]]:font-medium"
            )}
        />
    );
}

export function CheckboxField({
    className,
    ...props
}: { className?: string } & Omit<Headless.FieldProps, "as" | "className">) {
    return (
        <Headless.Field
            data-slot="field"
            {...props}
            className={cn(
                className,
                // Base layout
                "grid items-center gap-x-2 gap-y-1 sm:grid-cols-[var(--spacing-5)_1fr]",
                // Control layout
                "[&>[data-slot=control]]:col-start-1 [&>[data-slot=control]]:row-start-1 [&>[data-slot=control]]:justify-self-center",
                // Label layout
                "[&>[data-slot=label]]:col-start-2 [&>[data-slot=label]]:row-start-1 [&>[data-slot=label]]:justify-self-start",
                // Description layout
                "[&>[data-slot=description]]:col-start-2 [&>[data-slot=description]]:row-start-2",
                // With description
                "[&_[data-slot=label]]:has-[[data-slot=description]]:font-medium"
            )}
        />
    );
}

const base = [
    // Basic layout
    "relative isolate flex items-center justify-center rounded-sm sm:size-5",
    // Background color + shadow applied to inset pseudo element, so shadow blends with border in light mode
    "before:absolute before:inset-0 before:-z-10 before:rounded-sm before:bg-white before:shadow",
    // Background color when checked
    "group-data-[checked]:before:bg-pink",
    // Background color is moved to control and shadow is removed in dark mode so hide `before` pseudo
    // Background color applied to control in dark mode
    // Border
    "border border-foreground/30 group-data-[checked]:border-transparent group-data-[checked]:group-data-[hover]:border-transparent group-data-[hover]:border-foreground/30 group-data-[checked]:bg-[--checkbox-checked-border]",
    // Inner highlight shadow
    "after:absolute after:inset-0 after:rounded-sm after:shadow-[inset_0_1px_theme(colors.white/15%)]",
    // Focus ring
    "group-data-[focus]:outline group-data-[focus]:outline-2 group-data-[focus]:outline-offset-2 group-data-[focus]:outline-pink-600/20",
    // Disabled state
    "group-data-[disabled]:opacity-50",
    "group-data-[disabled]:border-zinc-950/25 group-data-[disabled]:bg-foreground/5 group-data-[disabled]:[--checkbox-check:color-mix(in_srgb,var(--color-foreground)_50%,transparent)] group-data-[disabled]:before:bg-transparent",
    // Forced colors mode
    "forced-colors:[--checkbox-check:HighlightText] forced-colors:[--checkbox-checked-bg:Highlight] forced-colors:group-data-[disabled]:[--checkbox-check:Highlight]",
    "[--checkbox-check:var(--color-white)] [--checkbox-checked-border:color-mix(in_srgb,var(--color-pink-600_90%,transparent)]",
];

export function Checkbox({
    className,
    ...props
}: {
    className?: string;
} & Omit<Headless.CheckboxProps, "as" | "className">) {
    return (
        <Headless.Checkbox
            data-slot="control"
            {...props}
            className={cn(className, "group inline-flex focus:outline-none")}
        >
            <span className={cn(...base)}>
                <svg
                    className="size-4 stroke-[var(--checkbox-check)] opacity-0 group-data-[checked]:opacity-100"
                    viewBox="0 0 14 14"
                    fill="none"
                >
                    {/* Checkmark icon */}
                    <path
                        className="opacity-100 group-data-[indeterminate]:opacity-0"
                        d="M3 8L6 11L11 3.5"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    {/* Indeterminate icon */}
                    <path
                        className="opacity-0 group-data-[indeterminate]:opacity-100"
                        d="M3 7H11"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </span>
        </Headless.Checkbox>
    );
}
