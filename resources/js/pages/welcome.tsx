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
            {/* <canvas id="logo" width="200" height="200" /> */}
            <Logo className="w-72 h-auto" />
            <Logo className="w-8 h-auto" />
        </div>
    );
}

function createArrayOfLength(length: number): number[] {
    return Array.from(Array(length === 0 ? 1 : length), (_, i) => i);
}

function getFromArrayByRandom<T>(values: T[]): T {
    return values[Math.floor(Math.random() * values.length)]!;
}

const columnStarts: Array<string> = [
    "col-start-1",
    "col-start-2",
    "col-start-3",
    "col-start-4",
    "col-start-5",
    "col-start-6",
    "col-start-7",
    "col-start-8",
    "col-start-9",
];
const rowStarts = [
    "row-start-1",
    "row-start-2",
    "row-start-3",
    "row-start-4",
    "row-start-5",
];

const skipCoords: Record<string, boolean> = {
    "0,2": true,
    "0,5": true,
    "0,8": true,
    "1,0": true,
    "1,3": true,
    "1,6": true,
    "2,0": true,
    "2,3": true,
    "2,6": true,
    "3,0": true,
    "3,3": true,
    "3,6": true,
    "4,0": true,
    "4,3": true,
    "4,6": true,
};

const solidCoords: Record<string, boolean> = {
    "1,1": true,
    "1,2": true,
    "2,1": true,
    "0,4": true,
    "3,4": true,
    "4,4": true,
    "0,6": true,
    "1,7": true,
    "2,7": true,
    "3,7": true,
};

const colors = ["text-foreground", "text-green", "text-blue"];

const denseCoords: Record<string, boolean> = {};

function Logo({ className }: PropsWithClassName) {
    const columns = createArrayOfLength(9);
    const rows = createArrayOfLength(5);

    return (
        <div className={cn(className, "grid grid-row-5 grid-cols-9")}>
            {rows.map((row) =>
                columns.map((col) => {
                    const forceSolid = solidCoords[`${row},${col}`];
                    const path = forceSolid
                        ? tilePaths[0]
                        : getFromArrayByRandom(tilePaths);
                    const skip = skipCoords[`${row},${col}`];
                    const color = getFromArrayByRandom(colors);

                    return skip ? null : (
                        <Tile
                            path={path}
                            className={cn(
                                columnStarts[col],
                                rowStarts[row],
                                color,
                                "col-span-1 row-span-1"
                            )}
                        />
                    );
                })
            )}
        </div>
    );
}

function Tile({ path, className }: PropsWithClassName<{ path: string }>) {
    return (
        <svg
            width="8"
            height="8"
            viewBox="0 0 8 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn(className, "w-full h-auto")}
        >
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d={path}
                fill="currentColor"
            />
        </svg>
    );
}
const tilePaths = [
    "M2 0H0V2V4V6V8H2H4H6H8V6V4V2V0H6H4H2Z", // solid
    "M2 0H0V2V4V6V8H2H4H6V6H8V4H6V2H8V0H6H4H2Z", // p1
    "M2 0H0V2V4V6V8H2H4H6V6H8V4H6V2H8V0H6H4V2H2V0ZM4 4H2V6H4V4Z", // p2
    "M2 0H4V2H2V0ZM2 4H0V2H2V4ZM4 4H2V6H0V8H2V6H4V8H6V6H8V4H6V2H8V0H6V2H4V4ZM4 4H6V6H4V4Z", // p3
    "M4 0H6V2H4V0ZM2 2H0V4H2V2ZM2 6H0V8H2V6ZM6 4H4V6H6V4Z", // p4
    "M3 3 H5 V5 H3 Z", // clear
];
