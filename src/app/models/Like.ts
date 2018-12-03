import { Post } from "./Post";
import { ILike } from "./ILike";

export class Like implements ILike{
    userId : string;
	postId : string;
    action : string
    
    constructor(post: Post, uid: string) {
        if(!post.id){
            throw Error('Invalid post');
        }
        this.postId = post.id;
        this.userId = uid;
        this.action = post.likes && post.likes[uid] ? 'unlike' : 'like';
    }
}