import { PropsWithClassName } from "@/types";
import { cn } from "@/utils/classnames";

export default function Logo({ className }: PropsWithClassName) {
    return (
        <div className={cn(className, "grid grid-row-5 grid-cols-9")}>
            {logoTiles.map((row, x) =>
                row.map((density, y) => {
                    return (
                        <Tile
                            key={`${x}-${y}`}
                            density={density}
                            className={cn(
                                columnStarts[y],
                                rowStarts[x],
                                getColor({ density }),
                                "col-span-1 row-span-1"
                            )}
                        />
                    );
                })
            )}
        </div>
    );
}

function Tile({
    density,
    className,
}: PropsWithClassName<{ density: Density }>) {
    const skip = density === "";
    return skip ? null : (
        <svg
            width="8"
            height="8"
            viewBox="0 0 8 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn(className, "w-full h-auto")}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d={getForeground({ density })}
                fill="currentColor"
            />
        </svg>
    );
}

function getColor({ density }: { density: Density }): string {
    switch (density) {
        case "█":
            return colors[0];
        case "▓":
            return getFromArrayByRandom([
                colors[0],
                colors[0],
                colors[1],
                colors[2],
            ]);
        case "▒":
            return getFromArrayByRandom([colors[2], colors[3], colors[4]]);
        case "░":
            return getFromArrayByRandom([colors[3], colors[4], colors[5]]);
        default:
            return colors[0];
    }
}
function getForeground({ density }: { density: Density }): string {
    switch (density) {
        case "█":
            return tilePaths[0];
        case "▓":
            return getFromArrayByRandom([
                tilePaths[0],
                tilePaths[1],
                tilePaths[2],
            ]);
        case "▒":
            return getFromArrayByRandom([
                tilePaths[2],
                tilePaths[3],
                tilePaths[4],
            ]);
        case "░":
            return getFromArrayByRandom([
                tilePaths[3],
                tilePaths[4],
                tilePaths[5],
            ]);
        default:
            return tilePaths[0];
    }
}

const tilePaths = [
    "M2 0H0V2V4V6V8H2H4H6H8V6V4V2V0H6H4H2Z", // solid
    "M2 0H0V2V4V6V8H2H4H6V6H8V4H6V2H8V0H6H4H2Z", // p1
    "M2 0H0V2V4V6V8H2H4H6V6H8V4H6V2H8V0H6H4V2H2V0ZM4 4H2V6H4V4Z", // p2
    "M2 0H4V2H2V0ZM2 4H0V2H2V4ZM4 4H2V6H0V8H2V6H4V8H6V6H8V4H6V2H8V0H6V2H4V4ZM4 4H6V6H4V4Z", // p3
    "M4 0H6V2H4V0ZM2 2H0V4H2V2ZM2 6H0V8H2V6ZM6 4H4V6H6V4Z", // p4
    "M3 3 H5 V5 H3 Z", // clear
];

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

type Density = "█" | "▓" | "▒" | "░" | "";

const logoTiles: Array<Array<Density>> = [
    ["▒", "▓", "", "█", "█", "", "▒", "▓", ""],
    ["", "█", "▓", "", "█", "▓", "", "▓", "█"],
    ["", "█", "▓", "", "▓", "▒", "", "▓", "█"],
    ["", "▓", "▒", "", "▓", "▒", "", "▒", "▓"],
    ["", "▒", "░", "", "░", "░", "", "░", "▒"],
];

const colors = [
    "text-foreground",
    "text-accent",
    "text-primary-dark",
    "text-primary",
    "text-primary-light",
];
