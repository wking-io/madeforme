export type CategoryData = {
    id: number;
    name: string;
    slug: string;
    description: string;
};
export type CreatePost = {
    title: string;
    description: string;
    slug: string;
    source_id: number | null;
    source_name: string | null;
    source_url: string | null;
    preview_image: any;
    preview_video: any;
    media: Array<any>;
};
export type MediaData = {
    id: number;
    path: string;
    status: MediaStatus;
};
export type MediaStatus = "pending" | "confirmed";
export type MediaSummary = {
    id: number;
    path: string;
    status: MediaStatus;
    post?: PostData;
};
export type PostData = {
    id: number;
    title: string;
    description: string;
    slug: string;
    status: PostStatus;
};
export type PostDetail = {
    id: number;
    title: string;
    description: string;
    slug: string;
    status: PostStatus;
    source: SourceData;
    media: Array<MediaData>;
    previewImage: MediaData;
    previewVideo: MediaData;
    categories: Array<CategoryData>;
};
export type PostStatus = "draft" | "published";
export type PostSummary = {
    id: number;
    title: string;
    description: string;
    slug: string;
    status: PostStatus;
    source: SourceData;
    categories: Array<CategoryData>;
};
export type SignatureData = {
    id: number;
    path: string;
    url: string;
};
export type SourceData = {
    id: number;
    name: string;
    slug: string;
};
