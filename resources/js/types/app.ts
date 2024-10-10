export type CategoryData = {
    id: number;
    name: string;
    slug: string;
    description: string;
};
export type MediaData = {
    id: number;
    path: string;
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
export type SourceData = {
    id: number;
    name: string;
    slug: string;
};
