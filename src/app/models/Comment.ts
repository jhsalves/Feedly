export interface Comment{
    id?: string;
    text: string;
    postId: string;
    ownerUid: string;
    ownerName: string;
    createdAt: number;
}