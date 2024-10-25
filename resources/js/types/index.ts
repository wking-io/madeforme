import { Config } from "ziggy-js";
import { PageProps as InertiaPageProps } from "@inertiajs/core";

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>
> = T &
    InertiaPageProps & {
        auth: {
            user: User;
        };
        ziggy: Config & { location: string };
    };

export type Point = { x: number; y: number };

export type PropsWithClassName<T = {}> = T & { className?: string };
