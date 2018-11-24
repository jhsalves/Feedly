import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from '../models/Post';

@Injectable({
  providedIn: 'root'
})
export class FeedService {

  

  private FeedsCollection: AngularFirestoreCollection<Post>;
 
  private Feeds: Observable<Post[]>;
  private _movies$ = new BehaviorSubject<Post[]>([]); // 1
  batch = 2; // 2
  lastKey = ''; // 3
  finished = false; // 4
 
  constructor(db: AngularFirestore) {
    this.FeedsCollection = db.collection<Post>('posts', ref => ref.orderBy('createdAt', 'desc'));
 
    this.Feeds = this.FeedsCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          let post = { id, ...data };
          return post;
        });
      })
    );
  }
 
  public getFeeds() {
    return this.Feeds;
  }
 
  getFeed(id) {
    return this.FeedsCollection.doc<Post>(id).valueChanges();
  }
 
  updateFeed(feed: Post, id: string) {
    return this.FeedsCollection.doc(id).update(feed);
  }
 
  public async addFeed(feed: Post) {
    return await this.FeedsCollection.add(feed);
  }
 
  removeFeed(id) {
    return this.FeedsCollection.doc(id).delete();
  }
}
