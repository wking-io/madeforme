import type { Content as TTContent } from "@tiptap/react";
import { EditorContent, useEditor } from "@tiptap/react";
import type { ComponentPropsWithoutRef } from "react";
import { useCallback } from "react";
import Link from "@tiptap/extension-link";
import StarterKit from "@tiptap/starter-kit";
import { PropsWithClassName } from "@/types";
import { Input } from "@headlessui/react";

export const editorExtensions = [
    StarterKit,
    Link.configure({ openOnClick: false }),
];

function EditorButton({
    name,
    action,
    icon,
    active = false,
    className,
    ...props
}: ComponentPropsWithoutRef<"button"> &
    PropsWithClassName<{
        name: string;
        action: () => boolean | void;
        active?: boolean;
        icon: string;
    }>) {
    return (
        <button
            {...props}
            type="button"
            onClick={action}
            title={name}
            className={`flex px-2 py-1 items-center justify-center outline-none focus:bg-foreground/10 focus:ring-1 focus:ring-primary-600/20 ${
                active
                    ? "bg-foreground text-background hover:bg-foreground/90"
                    : "hover:bg-foreground/10"
            } ${className ?? ""}`}
        >
            <span className="sr-only">{name}</span>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="16"
                height="16"
                className="fill-current"
            >
                <path d={icon} />
            </svg>
        </button>
    );
}

export function Editor({
    name,
    content,
}: {
    name: string;
    content?: TTContent;
}) {
    const editor = useEditor({
        extensions: editorExtensions,
        content,
        editorProps: {
            attributes: {
                class: "prose prose-sm max-w-none p-4 w-full outline-none",
            },
        },
    });

    const setLink: () => void = useCallback(() => {
        if (!editor) return;

        const previousUrl = editor.getAttributes("link").href;
        const url = window.prompt("URL", previousUrl);

        // cancelled
        if (url === null) {
            return;
        }

        // empty
        if (url === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();

            return;
        }

        // update link
        editor
            .chain()
            .focus()
            .extendMarkRange("link")
            .setLink({ href: url })
            .run();
    }, [editor]);

    if (!editor) return null;

    return (
        <div id="editor-root" className="relative flex h-full flex-1 flex-col">
            <div className="relative flex flex-1 flex-col rounded-sm border border-foreground/30 bg-white flex flex-col focus-within:ring-2 focus-within:ring-primary-600/20 focus-within:border-foreground/50 lg:overflow-y-auto lg:overflow-x-hidden group/editor">
                <div className="flex shrink-0 divide-x divide-foreground/30 group-focus-within/editor:divide-foreground/50 overflow-y-visible border-b border-foreground/30 group-focus-within/editor:border-foreground/50 bg-white">
                    <div className="flex">
                        <EditorButton
                            name="Heading 1"
                            disabled={
                                !editor
                                    .can()
                                    .chain()
                                    .focus()
                                    .toggleHeading({ level: 1 })
                                    .run()
                            }
                            action={() =>
                                editor
                                    .chain()
                                    .focus()
                                    .toggleHeading({ level: 1 })
                                    .run()
                            }
                            active={editor.isActive("heading", { level: 1 })}
                            icon="M13 20h-2v-7H4v7H2V4h2v7h7V4h2v16zm8-12v12h-2v-9.796l-2 .536V8.67L19.5 8H21z"
                        />
                        <EditorButton
                            name="Heading 2"
                            disabled={
                                !editor
                                    .can()
                                    .chain()
                                    .focus()
                                    .toggleHeading({ level: 2 })
                                    .run()
                            }
                            action={() =>
                                editor
                                    .chain()
                                    .focus()
                                    .toggleHeading({ level: 2 })
                                    .run()
                            }
                            active={editor.isActive("heading", { level: 2 })}
                            icon="M4 4v7h7V4h2v16h-2v-7H4v7H2V4h2zm14.5 4c2.071 0 3.75 1.679 3.75 3.75 0 .857-.288 1.648-.772 2.28l-.148.18L18.034 18H22v2h-7v-1.556l4.82-5.546c.268-.307.43-.709.43-1.148 0-.966-.784-1.75-1.75-1.75-.918 0-1.671.707-1.744 1.606l-.006.144h-2C14.75 9.679 16.429 8 18.5 8z"
                        />
                        <EditorButton
                            name="Heading 3"
                            disabled={
                                !editor
                                    .can()
                                    .chain()
                                    .focus()
                                    .toggleHeading({ level: 3 })
                                    .run()
                            }
                            action={() =>
                                editor
                                    .chain()
                                    .focus()
                                    .toggleHeading({ level: 3 })
                                    .run()
                            }
                            active={editor.isActive("heading", { level: 3 })}
                            icon="M22 8l-.002 2-2.505 2.883c1.59.435 2.757 1.89 2.757 3.617 0 2.071-1.679 3.75-3.75 3.75-1.826 0-3.347-1.305-3.682-3.033l1.964-.382c.156.806.866 1.415 1.718 1.415.966 0 1.75-.784 1.75-1.75s-.784-1.75-1.75-1.75c-.286 0-.556.069-.794.19l-1.307-1.547L19.35 10H15V8h7zM4 4v7h7V4h2v16h-2v-7H4v7H2V4h2z"
                        />
                        <EditorButton
                            name="Heading 4"
                            disabled={
                                !editor
                                    .can()
                                    .chain()
                                    .focus()
                                    .toggleHeading({ level: 4 })
                                    .run()
                            }
                            action={() =>
                                editor
                                    .chain()
                                    .focus()
                                    .toggleHeading({ level: 4 })
                                    .run()
                            }
                            active={editor.isActive("heading", { level: 4 })}
                            icon="M13 20h-2v-7H4v7H2V4h2v7h7V4h2v16zm9-12v8h1.5v2H22v2h-2v-2h-5.5v-1.34l5-8.66H22zm-2 3.133L17.19 16H20v-4.867z"
                        />
                        <EditorButton
                            name="Normal text"
                            disabled={
                                !editor
                                    .can()
                                    .chain()
                                    .focus()
                                    .setParagraph()
                                    .run()
                            }
                            action={() =>
                                editor.chain().focus().setParagraph().run()
                            }
                            active={editor.isActive("paragraph")}
                            icon="M12 6v15h-2v-5a6 6 0 1 1 0-12h10v2h-3v15h-2V6h-3zm-2 0a4 4 0 1 0 0 8V6z"
                        />
                    </div>
                    <div className="flex">
                        <EditorButton
                            name="Bold"
                            disabled={
                                !editor.can().chain().focus().toggleBold().run()
                            }
                            action={() =>
                                editor.chain().focus().toggleBold().run()
                            }
                            active={editor.isActive("bold")}
                            icon="M8 11h4.5a2.5 2.5 0 1 0 0-5H8v5zm10 4.5a4.5 4.5 0 0 1-4.5 4.5H6V4h6.5a4.5 4.5 0 0 1 3.256 7.606A4.498 4.498 0 0 1 18 15.5zM8 13v5h5.5a2.5 2.5 0 1 0 0-5H8z"
                        />
                        <EditorButton
                            name="Italic"
                            disabled={
                                !editor
                                    .can()
                                    .chain()
                                    .focus()
                                    .toggleItalic()
                                    .run()
                            }
                            action={() =>
                                editor.chain().focus().toggleItalic().run()
                            }
                            active={editor.isActive("italic")}
                            icon="M15 20H7v-2h2.927l2.116-12H9V4h8v2h-2.927l-2.116 12H15z"
                        />
                        <EditorButton
                            name="Strikethrough"
                            disabled={
                                !editor
                                    .can()
                                    .chain()
                                    .focus()
                                    .toggleStrike()
                                    .run()
                            }
                            action={() =>
                                editor.chain().focus().toggleStrike().run()
                            }
                            active={editor.isActive("strike")}
                            icon="M17.154 14c.23.516.346 1.09.346 1.72 0 1.342-.524 2.392-1.571 3.147C14.88 19.622 13.433 20 11.586 20c-1.64 0-3.263-.381-4.87-1.144V16.6c1.52.877 3.075 1.316 4.666 1.316 2.551 0 3.83-.732 3.839-2.197a2.21 2.21 0 0 0-.648-1.603l-.12-.117H3v-2h18v2h-3.846zm-4.078-3H7.629a4.086 4.086 0 0 1-.481-.522C6.716 9.92 6.5 9.246 6.5 8.452c0-1.236.466-2.287 1.397-3.153C8.83 4.433 10.271 4 12.222 4c1.471 0 2.879.328 4.222.984v2.152c-1.2-.687-2.515-1.03-3.946-1.03-2.48 0-3.719.782-3.719 2.346 0 .42.218.786.654 1.099.436.313.974.562 1.613.75.62.18 1.297.414 2.03.699z"
                        />
                        <EditorButton
                            name="Link"
                            action={
                                editor.isActive("link")
                                    ? () =>
                                          editor
                                              .chain()
                                              .focus()
                                              .unsetLink()
                                              .run()
                                    : setLink
                            }
                            active={editor.isActive("link")}
                            icon="M18.364 15.536L16.95 14.12l1.414-1.414a5 5 0 1 0-7.071-7.071L9.879 7.05 8.464 5.636 9.88 4.222a7 7 0 0 1 9.9 9.9l-1.415 1.414zm-2.828 2.828l-1.415 1.414a7 7 0 0 1-9.9-9.9l1.415-1.414L7.05 9.88l-1.414 1.414a5 5 0 1 0 7.071 7.071l1.414-1.414 1.415 1.414zm-.708-10.607l1.415 1.415-7.071 7.07-1.415-1.414 7.071-7.07z"
                        />
                    </div>
                    <div className="flex">
                        <EditorButton
                            name="Bullet List"
                            disabled={
                                !editor
                                    .can()
                                    .chain()
                                    .focus()
                                    .toggleBulletList()
                                    .run()
                            }
                            action={() =>
                                editor.chain().focus().toggleBulletList().run()
                            }
                            active={editor.isActive("bulletList")}
                            icon="M8 4h13v2H8V4zM4.5 6.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0 7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0 6.9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM8 11h13v2H8v-2zm0 7h13v2H8v-2z"
                        />
                        <EditorButton
                            name="Ordered List"
                            disabled={
                                !editor
                                    .can()
                                    .chain()
                                    .focus()
                                    .toggleOrderedList()
                                    .run()
                            }
                            action={() =>
                                editor.chain().focus().toggleOrderedList().run()
                            }
                            active={editor.isActive("orderedList")}
                            icon="M8 4h13v2H8V4zM5 3v3h1v1H3V6h1V4H3V3h2zM3 14v-2.5h2V11H3v-1h3v2.5H4v.5h2v1H3zm2 5.5H3v-1h2V18H3v-1h3v4H3v-1h2v-.5zM8 11h13v2H8v-2zm0 7h13v2H8v-2z"
                        />
                    </div>
                </div>
                <EditorContent editor={editor} className="h-full" />
                <Input
                    name={name}
                    type="hidden"
                    value={JSON.stringify(editor.getJSON())}
                />
            </div>
        </div>
    );
}
