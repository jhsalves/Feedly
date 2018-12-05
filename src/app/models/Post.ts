export interface Post{
    id?: string,
    createdAt: number,
    owner: string,
    ownerName: string,
    text: string,
    likes?: boolean[],
    likesCount?: number,
    modifying?: boolean
}