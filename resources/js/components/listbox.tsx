"use client";

import { cn } from "@/utils/classnames";
import * as Headless from "@headlessui/react";
import { Fragment } from "react";

export function Listbox<T>({
    className,
    placeholder,
    autoFocus,
    "aria-label": ariaLabel,
    children: options,
    ...props
}: {
    className?: string;
    placeholder?: React.ReactNode;
    autoFocus?: boolean;
    "aria-label"?: string;
    children?: React.ReactNode;
} & Omit<Headless.ListboxProps<typeof Fragment, T>, "as" | "multiple">) {
    return (
        <Headless.Listbox {...props} multiple={false}>
            <Headless.ListboxButton
                autoFocus={autoFocus}
                data-slot="control"
                aria-label={ariaLabel}
                className={cn(
                    className,
                    // Basic layout
                    "group relative block w-full",
                    // Background color + shadow applied to inset pseudo element, so shadow blends with border in light mode
                    "before:absolute before:inset-px before:rounded-[calc(var(--border-radius-sm)-1px)] before:bg-white before:shadow",
                    // Background color is moved to control and shadow is removed in dark mode so hide `before` pseudo
                    // Hide default focus styles
                    "focus:outline-none",
                    // Focus ring
                    "after:pointer-events-none after:absolute after:inset-0 after:rounded-sm after:ring-inset after:ring-transparent after:data-[focus]:ring-2 after:data-[focus]:ring-primary-600/20",
                    // Disabled state
                    "data-[disabled]:opacity-50 before:data-[disabled]:bg-foreground/5 before:data-[disabled]:shadow-none"
                )}
            >
                <Headless.ListboxSelectedOption
                    as="span"
                    options={options}
                    placeholder={
                        placeholder && (
                            <span className="block truncate">
                                {placeholder}
                            </span>
                        )
                    }
                    className={cn(
                        // Basic layout
                        "relative block w-full appearance-none rounded-sm py-[calc(var(--spacing-1)-1px)]",
                        // Set minimum height for when no value is selected
                        "min-h-11 sm:min-h-[34px]",
                        // Horizontal padding
                        "pl-[calc(var(--spacing-2)-1px)] pr-[calc(var(spacing-7)-1px)]",
                        // Typography
                        "text-left text-base/6 placeholder:text-foreground-muted/50 forced-colors:text-[CanvasText]",
                        // Border
                        "border border-foreground/30 group-data-[active]:border-foreground/50 group-data-[hover]:border-foreground/50",
                        // Background color
                        "bg-transparent",
                        // Invalid state
                        "group-data-[invalid]:border-red-500 group-data-[invalid]:group-data-[hover]:border-red-500",
                        // Disabled state
                        "group-data-[disabled]:border-foreground/10 group-data-[disabled]:opacity-100"
                    )}
                />
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <svg
                        className="size-5 stroke-foreground group-data-[disabled]:stroke-zinc-600 sm:size-4 forced-colors:stroke-[CanvasText]"
                        viewBox="0 0 16 16"
                        aria-hidden="true"
                        fill="none"
                    >
                        <path
                            d="M5.75 10.75L8 13L10.25 10.75"
                            strokeWidth={1.5}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M10.25 5.25L8 3L5.75 5.25"
                            strokeWidth={1.5}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </span>
            </Headless.ListboxButton>
            <Headless.ListboxOptions
                transition
                anchor="selection start"
                className={cn(
                    // Anchor positioning
                    "[--anchor-offset:-1.625rem] [--anchor-padding:var(--spacing-4)] sm:[--anchor-offset:-1.375rem]",
                    // Base styles
                    "isolate w-max min-w-[calc(var(--button-width)+1.75rem)] select-none scroll-py-1 rounded p-0.5",
                    // Invisible border that is only visible in `forced-colors` mode for accessibility purposes
                    "outline outline-1 outline-transparent focus:outline-none",
                    // Handle scrolling when menu won't fit in viewport
                    "overflow-y-scroll overscroll-contain",
                    // Popover background
                    "bg-white/75 backdrop-blur-xl",
                    // Shadows
                    "shadow-lg ring-1 ring-foreground/30",
                    // Transitions
                    "transition-opacity duration-100 ease-in data-[transition]:pointer-events-none data-[closed]:data-[leave]:opacity-0"
                )}
            >
                {options}
            </Headless.ListboxOptions>
        </Headless.Listbox>
    );
}

export function ListboxOption<T>({
    children,
    className,
    ...props
}: { className?: string; children?: React.ReactNode } & Omit<
    Headless.ListboxOptionProps<"div", T>,
    "as" | "className"
>) {
    let sharedClasses = cn(
        // Base
        "flex min-w-0 items-center",
        // Icons
        "[&>[data-slot=icon]]:size-5 [&>[data-slot=icon]]:shrink-0 sm:[&>[data-slot=icon]]:size-4",
        "[&>[data-slot=icon]]:group-data-[focus]/option:text-background",
        "forced-colors:[&>[data-slot=icon]]:text-[CanvasText] forced-colors:[&>[data-slot=icon]]:group-data-[focus]/option:text-[Canvas]",
        // Avatars
        "[&>[data-slot=avatar]]:-mx-0.5 [&>[data-slot=avatar]]:size-6 sm:[&>[data-slot=avatar]]:size-5"
    );

    return (
        <Headless.ListboxOption as={Fragment} {...props}>
            {({ selectedOption }) => {
                if (selectedOption) {
                    return (
                        <div className={cn(className, sharedClasses)}>
                            {children}
                        </div>
                    );
                }

                return (
                    <div
                        className={cn(
                            // Basic layout
                            "group/option grid cursor-default grid-cols-[var(--spacing-5)_1fr] items-baseline gap-x-2 rounded-sm sm:grid-cols-[var(--spacing-4)_1fr] py-1 pl-1 pr-3",
                            // Typography
                            "text-base leading-[26px] forced-colors:text-[CanvasText]",
                            // Focus
                            "outline-none data-[focus]:bg-foreground data-[focus]:text-background",
                            // Forced colors mode
                            "forced-color-adjust-none forced-colors:data-[focus]:bg-[Highlight] forced-colors:data-[focus]:text-[HighlightText]",
                            // Disabled
                            "data-[disabled]:opacity-50"
                        )}
                    >
                        <svg
                            className="relative hidden size-5 self-center stroke-current group-data-[selected]/option:inline sm:size-4"
                            viewBox="0 0 16 16"
                            fill="none"
                            aria-hidden="true"
                        >
                            <path
                                d="M4 8.5l3 3L12 4"
                                strokeWidth={1.5}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <span
                            className={cn(
                                className,
                                sharedClasses,
                                "-mt-px mb-px col-start-2"
                            )}
                        >
                            {children}
                        </span>
                    </div>
                );
            }}
        </Headless.ListboxOption>
    );
}

export function ListboxLabel({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"span">) {
    return (
        <span
            {...props}
            className={cn(
                className,
                "ml-2.5 truncate first:ml-0 sm:ml-2 sm:first:ml-0"
            )}
        />
    );
}

export function ListboxDescription({
    className,
    children,
    ...props
}: React.ComponentPropsWithoutRef<"span">) {
    return (
        <span
            {...props}
            className={cn(
                className,
                "flex flex-1 overflow-hidden text-foreground-muted before:w-2 before:min-w-0 before:shrink group-data-[focus]/option:text-white"
            )}
        >
            <span className="flex-1 truncate">{children}</span>
        </span>
    );
}
