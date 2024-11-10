import { cn } from "@/utils/classnames";
import * as Headless from "@headlessui/react";
import React, { forwardRef } from "react";

export function InputGroup({
    children,
}: React.ComponentPropsWithoutRef<"span">) {
    return (
        <span
            data-slot="control"
            className={cn(
                "relative isolate block",
                "[&_input]:has-[[data-slot=icon]:first-child]:pl-10 [&_input]:has-[[data-slot=icon]:last-child]:pr-10 sm:[&_input]:has-[[data-slot=icon]:first-child]:pl-8 sm:[&_input]:has-[[data-slot=icon]:last-child]:pr-8",
                "[&>[data-slot=icon]]:pointer-events-none [&>[data-slot=icon]]:absolute [&>[data-slot=icon]]:top-3 [&>[data-slot=icon]]:z-10 [&>[data-slot=icon]]:size-5 sm:[&>[data-slot=icon]]:top-2.5 sm:[&>[data-slot=icon]]:size-4",
                "[&>[data-slot=icon]:first-child]:left-3 sm:[&>[data-slot=icon]:first-child]:left-2.5 [&>[data-slot=icon]:last-child]:right-3 sm:[&>[data-slot=icon]:last-child]:right-2.5",
                "[&>[data-slot=icon]]:text-zinc-500",
            )}
        >
            {children}
        </span>
    );
}

const dateTypes = ["date", "datetime-local", "month", "time", "week"];
type DateType = (typeof dateTypes)[number];

export const Input = forwardRef(function Input(
    {
        className,
        ...props
    }: {
        className?: string;
        type?:
            | "email"
            | "number"
            | "password"
            | "search"
            | "tel"
            | "text"
            | "url"
            | DateType;
    } & Omit<Headless.InputProps, "as" | "className">,
    ref: React.ForwardedRef<HTMLInputElement>,
) {
    return (
        <span
            data-slot="control"
            className={cn(
                className,
                // Basic layout
                "relative block w-full",
                // Background color + shadow applied to inset pseudo element, so shadow blends with border in light mode
                "rounded-sm border border-foreground/30 bg-white flex focus-within:ring-2 focus-within:ring-primary-light/50 focus-within:border-foreground/50 flex-1 has-[[data-hover]]:border-foreground/50",
                // Disabled state
                "has-[[data-disabled]]:opacity-50",
                // Invalid
                "has-[[data-invalid]]:border-red-500 has-[[data-invalid]]:has-[[data-hover]]:border-red-500",
            )}
        >
            <Headless.Input
                ref={ref}
                {...props}
                className={cn(
                    // Date classes
                    ...(props.type && dateTypes.includes(props.type)
                        ? [
                              "[&::-webkit-datetime-edit-fields-wrapper]:p-0",
                              "[&::-webkit-date-and-time-value]:min-h-[1.5em]",
                              "[&::-webkit-datetime-edit]:inline-flex",
                              "[&::-webkit-datetime-edit]:p-0",
                              "[&::-webkit-datetime-edit-year-field]:p-0",
                              "[&::-webkit-datetime-edit-month-field]:p-0",
                              "[&::-webkit-datetime-edit-day-field]:p-0",
                              "[&::-webkit-datetime-edit-hour-field]:p-0",
                              "[&::-webkit-datetime-edit-minute-field]:p-0",
                              "[&::-webkit-datetime-edit-second-field]:p-0",
                              "[&::-webkit-datetime-edit-millisecond-field]:p-0",
                              "[&::-webkit-datetime-edit-meridiem-field]:p-0",
                          ]
                        : []),
                    // Basic layout
                    "relative block w-full appearance-none rounded-sm py-1 px-2",
                    // Hide border
                    "border-none",
                    // Typography
                    "text-base/6 placeholder:text-foreground-muted/50 sm:text-sm/6",
                    // Background color
                    "bg-transparent",
                    // Hide default focus styles
                    "focus:outline-none",
                    // System icons
                )}
            />
        </span>
    );
});
