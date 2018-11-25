import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap, take } from 'rxjs/operators';
import { Post } from '../models/Post';

@Injectable({
  providedIn: 'root'
})
export class FeedService {

  private _posts$ = new BehaviorSubject<Post[]>([]);
  pageSize = 10;
  lastKey: any;
  finished = false;
  orderField = 'createdAt';

  constructor(private db: AngularFirestore) {
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

  private getPosts(pageSize = 10): Observable<Post[]> {
    return this.mapListKeys<Post>(
      this.db.collection('posts', ref => {
        const query = ref
          .orderBy(this.orderField, 'desc')
          .limit(pageSize);

        return (this.lastKey)
          ? query.startAt(this.lastKey)
          : query;
      })
    );
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

  updateFeed(feed: Post, id: string) {
    return this.db.collection('posts').doc(id).update(feed);
  }

  public async addPost(feed: Post) {
    const docReference = await this.db.collection('posts').add(feed);
    this.getPost(docReference.id).subscribe(doc => {
      const currentPosts = this._posts$.getValue();
      this._posts$.next([doc].concat(currentPosts));
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
