import Logo from "@/components/logo";
import Dropdown from "@/components/Dropdown";
import NavLink from "@/components/NavLink";
import ResponsiveNavLink from "@/components/ResponsiveNavLink";
import { Link, usePage } from "@inertiajs/react";
import { PropsWithChildren, ReactNode, useState } from "react";

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const { auth, toasts } = usePage().props;
    const { user } = auth;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen bg-background flex">
            <nav className="p-4 sm:p-6 flex flex-col gap-8 justify-between">
                <Link href="/" className="">
                    <Logo className="block w-12 h-auto ml-1.5" />
                </Link>

                <div className="flex-1 flex flex-col items-center gap-3">
                    <NavLink
                        href={route("dashboard")}
                        active={route().current("dashboard")}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            id="Transparent-1--Streamline-Ultimate"
                            height="24"
                            width="24"
                            className="w-5 h-5 stroke-current"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m5.31836 5.36914 -4.454688 0 0 -4.454687 4.454688 0 0 4.454687Z"
                                stroke-width="1.5"
                            ></path>
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m5.31836 14.176 -4.454688 0 0 -4.45466 4.454688 0 0 4.45466Z"
                                stroke-width="1.5"
                            ></path>
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m5.31836 23.0854 -4.454688 0 0 -4.4546 4.454688 0 0 4.4546Z"
                                stroke-width="1.5"
                            ></path>
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m14.2266 5.36914 -4.45473 0L9.77188 0.914453l4.45472 0 0 4.454687Z"
                                stroke-width="1.5"
                            ></path>
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m9.77344 9.82397 -4.45469 0 0 -4.45468 4.45469 0 0 4.45468Z"
                                stroke-width="1.5"
                            ></path>
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m9.77344 18.6309 -4.45469 0 0 -4.4547 4.45469 0 0 4.4547Z"
                                stroke-width="1.5"
                            ></path>
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m23.1367 5.36914 -4.4547 0 0 -4.454687 4.4547 0 0 4.454687Z"
                                stroke-width="1.5"
                            ></path>
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m14.2266 14.176 -4.45473 0 0.00001 -4.45466 4.45472 0 0 4.45466Z"
                                stroke-width="1.5"
                            ></path>
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m14.2266 23.0854 -4.45473 0 0.00001 -4.4546 4.45472 0 0 4.4546Z"
                                stroke-width="1.5"
                            ></path>
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m18.6816 9.82397 -4.4546 0 0 -4.45468 4.4546 0 0 4.45468Z"
                                stroke-width="1.5"
                            ></path>
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m18.6816 18.6309 -4.4546 0 0 -4.4547 4.4546 0 0 4.4547Z"
                                stroke-width="1.5"
                            ></path>
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m23.1367 14.176 -4.4547 0 0 -4.45466 4.4547 0 0 4.45466Z"
                                stroke-width="1.5"
                            ></path>
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m23.1367 23.0854 -4.4547 0 0 -4.4546 4.4547 0 0 4.4546Z"
                                stroke-width="1.5"
                            ></path>
                        </svg>
                        <span className="sr-only">Dashboard</span>
                    </NavLink>
                    <NavLink
                        href={route("post.index")}
                        active={
                            route().current("post.index") ||
                            route().current("post.create")
                        }
                    >
                        <svg
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            id="Layers--Streamline-Ultimate"
                            height="24"
                            width="24"
                            className="w-5 h-5 stroke-current"
                        >
                            <path
                                d="M22.917 6.2 12.708 0.922a1.543 1.543 0 0 0 -1.416 0L1.083 6.2a0.616 0.616 0 0 0 0 1.094l10.209 5.281a1.543 1.543 0 0 0 1.416 0L22.917 7.3a0.616 0.616 0 0 0 0 -1.094Z"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                stroke-width="1.5"
                            ></path>
                            <path
                                d="m5.1 9.375 -4.017 2.078a0.616 0.616 0 0 0 0 1.094l10.209 5.281a1.543 1.543 0 0 0 1.416 0l10.209 -5.281a0.616 0.616 0 0 0 0 -1.094L18.9 9.375"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                stroke-width="1.5"
                            ></path>
                            <path
                                d="M5.1 14.625 1.083 16.7a0.616 0.616 0 0 0 0 1.094l10.209 5.281a1.543 1.543 0 0 0 1.416 0L22.917 17.8a0.616 0.616 0 0 0 0 -1.094L18.9 14.625"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                stroke-width="1.5"
                            ></path>
                        </svg>
                        <span className="sr-only">Posts</span>
                    </NavLink>
                    <NavLink
                        href={route("media.index")}
                        active={route().current("media.index")}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            id="Picture-Landscape--Streamline-Ultimate"
                            height="24"
                            width="24"
                            className="w-5 h-5 stroke-current"
                        >
                            <path
                                d="M2.25 0.75h19.5s1.5 0 1.5 1.5v19.5s0 1.5 -1.5 1.5H2.25s-1.5 0 -1.5 -1.5V2.25s0 -1.5 1.5 -1.5"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                stroke-width="1.5"
                            ></path>
                            <path
                                d="m5.25 17.25 3.462 -4.616a1.5 1.5 0 0 1 2.261 -0.161L12 13.5l3.3 -4.4a1.5 1.5 0 0 1 2.4 0l2.67 3.56"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                stroke-width="1.5"
                            ></path>
                            <path
                                d="M4.5 6.375a1.875 1.875 0 1 0 3.75 0 1.875 1.875 0 1 0 -3.75 0"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                stroke-width="1.5"
                            ></path>
                            <path
                                d="m0.75 17.25 22.5 0"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                stroke-width="1.5"
                            ></path>
                        </svg>
                        <span className="sr-only">Media</span>
                    </NavLink>
                </div>

                <div className="">
                    <div className="relative ms-3">
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button
                                    type="button"
                                    className="bg-pink-600 rounded-full w-12 h-12"
                                >
                                    <span className="sr-only">{user.name}</span>
                                </button>
                            </Dropdown.Trigger>

                            <Dropdown.Content>
                                <Dropdown.Link href={route("profile.edit")}>
                                    Profile
                                </Dropdown.Link>
                                <Dropdown.Link
                                    href={route("logout")}
                                    method="post"
                                    as="button"
                                >
                                    Log Out
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </div>

                <div className="-me-2 flex items-center sm:hidden">
                    <button
                        onClick={() =>
                            setShowingNavigationDropdown(
                                (previousState) => !previousState
                            )
                        }
                        className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                    >
                        <svg
                            className="h-6 w-6"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                className={
                                    !showingNavigationDropdown
                                        ? "inline-flex"
                                        : "hidden"
                                }
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                            <path
                                className={
                                    showingNavigationDropdown
                                        ? "inline-flex"
                                        : "hidden"
                                }
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? "block" : "hidden") +
                        " sm:hidden"
                    }
                >
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink
                            href={route("dashboard")}
                            active={route().current("dashboard")}
                        >
                            Dashboard
                        </ResponsiveNavLink>
                    </div>

                    <div className="border-t border-gray-200 pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-medium text-gray-800">
                                {user.name}
                            </div>
                            <div className="text-sm font-medium text-gray-500">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route("profile.edit")}>
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route("logout")}
                                as="button"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="flex-1">{children}</main>
        </div>
    );
}
