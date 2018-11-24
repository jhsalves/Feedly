import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Feed } from '../models/Feed';

@Injectable({
  providedIn: 'root'
})
export class FeedService {

  private FeedsCollection: AngularFirestoreCollection<Feed>;
 
  private Feeds: Observable<Feed[]>;
 
  constructor(db: AngularFirestore) {
    this.FeedsCollection = db.collection<Feed>('Feeds', ref => ref.orderBy('createdAt', 'desc'));
 
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
    return this.FeedsCollection.doc<Feed>(id).valueChanges();
  }
 
  updateFeed(feed: Feed, id: string) {
    return this.FeedsCollection.doc(id).update(feed);
  }
 
  public async addFeed(feed: Feed) {
    return await this.FeedsCollection.add(feed);
  }
 
  removeFeed(id) {
    return this.FeedsCollection.doc(id).delete();
  }
}
