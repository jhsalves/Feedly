import { Injectable, NgZone } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, QuerySnapshot } from 'angularfire2/firestore';
import { Observable, BehaviorSubject, of, Subject } from 'rxjs';
import { map, tap, take } from 'rxjs/operators';
import { Post } from '../models/Post';

@Injectable({
  providedIn: 'root'
})
export class FeedService {

  protected _posts$ = new BehaviorSubject<Post[]>([]);
  pageSize = 10;
  lastKey: any;
  finished = false;
  modifyingPost = false;
  modifying: Subject<boolean> = new Subject<boolean>();
  orderField = 'createdAt';

  constructor(private db: AngularFirestore,
              private zone: NgZone) {
  }

  get posts$(): Observable<Post[]> {
    return this._posts$.asObservable();
  }

  mapListKeys<T>(list: AngularFirestoreCollection<T>): Observable<T[]> {
    return list
      .snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as any;
            const id = a.payload.doc.id;
            const post = { id, ...data };
            return post;
          });
        })
      );
  }

  getPost(id) {
    return this.db.collection('posts').doc<Post>(id).valueChanges();
  }

  get postsList() {
    return this.getPosts();
  }

  private handlePostChanges(snapshot: QuerySnapshot<Post>) {
    if(!this.modifyingPost){
      return;
    }
    const changedPosts = snapshot.docChanges();
    const currentPosts = this._posts$.getValue();

    for (let change of changedPosts) {
      let postId = change.doc.id;
      const changedPost = change.doc.data() as Post;
      if (change.type == 'added') {
        currentPosts.unshift({id: postId, ...changedPost});
      } else if (change.type == 'modified') {
        currentPosts.forEach((post, index) => {
          if (post.id == postId) {
            currentPosts[index] = {id: postId, ...changedPost};
          }
        });
      }else if (change.type == 'removed') {

      }
    }
    this.zone.run(() => {});
    this._posts$.next(currentPosts);
    this.modifyingPost = false;
    this.modifying.next(this.modifyingPost);
  }

  private getPosts(pageSize = 10): Observable<Post[]> {
    const collection = this.db.collection<Post>('posts', ref => {
      const query = ref
        .orderBy(this.orderField, 'desc')
        .limit(pageSize);

      query.onSnapshot(this.handlePostChanges.bind(this));

      return (this.lastKey)
        ? query.startAt(this.lastKey)
        : query;
    });



    return this.mapListKeys<Post>(collection);
  }

  nextPage(): Observable<Post[]> {
    if (this.finished) { return this.posts$; }

    return this.getPosts(this.pageSize + 1)
      .pipe(
        tap(posts => {

          this.lastKey = posts[posts.length - 1][this.orderField];

          const newPosts = posts.slice(0, this.pageSize);

          const currentPosts = this._posts$.getValue();

          this.finished = this.lastKey == newPosts[newPosts.length - 1][this.orderField];

          this._posts$.next(currentPosts.concat(newPosts));
        })
      );
  }

  updateFeed(feed: Object, id: string) {
    return this.db.collection('posts').doc(id).update(feed);
  }

  public async addPost(feed: Post) {
    this.modifyingPost = true;
    const docReference = await this.db.collection('posts').add(feed);
    return new Promise((resolve, reject) => {
      return resolve(docReference)
    });
  }

  async removeFeed(id) {
    return await this.db.collection('posts').doc(id).delete();
  }

  public resetPosts() {
    this._posts$ = new BehaviorSubject<Post[]>([]);
    this.lastKey = null;
    this.finished = false;
    this.nextPage()
      .pipe(take(1))
      .subscribe();
  }
}
