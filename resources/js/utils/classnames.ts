export function cn(
    ...classNames: (string | false | undefined | null)[]
): string {
    return classNames
        .reduce((acc: string, str) => (str ? `${acc} ${str}` : acc), "")
        .slice(1); // Remove leading space
}
