import React, { createContext, useState, useContext, ReactNode } from "react";
import { router } from "@inertiajs/core";
import { MediaData } from "@/types/app";

type OnFinishSelectCallback = (media: MediaData[]) => void;
type ToggleModalFunction = () => void;

export interface MediaContextType {
    media: MediaData[];
    nextCursor: number | null;
    fetchMedia: (cursor?: number) => Promise<void>;
    uploadMedia: (files: FileList) => Promise<void>;
    toggleModal: (cb: OnFinishSelectCallback) => ToggleModalFunction;
    isModalOpen: boolean;
}

// Create a Context with the proper TypeScript type
const MediaContext = createContext<MediaContextType | undefined>(undefined);

// Custom hook for using the Media context
export const useMediaModal = ({
    onFinishSelect,
}: {
    onFinishSelect: OnFinishSelectCallback;
}): ToggleModalFunction => {
    const context = useContext(MediaContext);
    if (!context) {
        throw new Error("useMedia must be used within a MediaProvider");
    }

    const toggleModal = context.toggleModal(onFinishSelect);

    return toggleModal;
};

// MediaProvider component
export const MediaProvider = ({ children }: { children: ReactNode }) => {
    const [media, setMedia] = useState<MediaData[]>([]);
    const [nextCursor, setNextCursor] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const onFinishSelectRef = React.useRef<OnFinishSelectCallback | null>(null);

    // Fetch media with cursor-based pagination
    const fetchMedia = async (cursor?: number): Promise<void> => {
        const response = await router.get(
            route("media.index"),
            { cursor },
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: (props) => {
                    // VALIDATE USING ZOD
                    const { data, next_cursor } = props;

                    if (data) setMedia((prevMedia) => [...prevMedia, ...data]);
                    setNextCursor(next_cursor ?? null);
                },
            }
        );
    };

    // Toggle the modal state
    const toggleModal = (
        onFinishCallback: OnFinishSelectCallback
    ): ToggleModalFunction => {
        return () =>
            setIsModalOpen((isOpen) => {
                onFinishSelectRef.current = isOpen ? null : onFinishCallback;
                return !isOpen;
            });
    };

    // Upload new media
    const uploadMedia = async (files: FileList): Promise<void> => {
        const formData = new FormData();
        Array.from(files).forEach((file) => {
            formData.append("file", file);
        });

        const response = await fetch("/media/upload", {
            method: "POST",
            body: formData,
            headers: {
                "X-CSRF-TOKEN":
                    document
                        .querySelector('meta[name="csrf-token"]')
                        ?.getAttribute("content") || "",
            },
        });

        const result = await response.json();
        if (result && result.path) {
            setMedia((prevMedia) => [result, ...prevMedia]); // Prepend new media to the list
        }
    };

    return (
        <MediaContext.Provider
            value={{
                media,
                nextCursor,
                fetchMedia,
                uploadMedia,
                toggleModal,
                isModalOpen,
            }}
        >
            {children}
        </MediaContext.Provider>
    );
};
