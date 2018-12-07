import { Injectable, NgZone } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, QuerySnapshot, Query } from 'angularfire2/firestore';
import { Observable, BehaviorSubject, of, Subject } from 'rxjs';
import { map, tap, take } from 'rxjs/operators';
import { Comment } from '../models/Comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  protected _comments$ = new BehaviorSubject<Comment[]>([]);
  pageSize = 4;
  lastKey: any;
  finished = false;
  modifyingComment = false;
  modifiedComment: Subject<Comment> = new Subject<Comment>();
  orderField = 'createdAt';

  constructor(private db: AngularFirestore,
    private zone: NgZone) {
  }

  get comments$(): Observable<Comment[]> {
    return this._comments$.asObservable();
  }

  mapListKeys<T>(list: AngularFirestoreCollection<T>): Observable<T[]> {
    return list
      .snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as any;
            const id = a.payload.doc.id;
            const comment = { id: id, ...data };
            return comment;
          });
        })
      );
  }

  getComment(id) {
    return this.db.collection('comments').doc<Comment>(id).valueChanges();
  }

  get CommentsList() {
    return this.getComments();
  }

  private handleCommentChanges(snapshot: QuerySnapshot<Comment>) {
    if (!this.modifyingComment) {
      return;
    }
    const changedComments = snapshot.docChanges();
    const currentComments = this._comments$.getValue();

    for (let change of changedComments) {
      let commentId = change.doc.id;
      const changedComment = change.doc.data() as Comment;
      let docExists = changedComments.find(c => {
        return c.doc.id == commentId;
      });
      if (change.type == 'added' && docExists == null) {
        currentComments.unshift({ id: commentId, ...changedComment });
      } else if (change.type == 'modified' && docExists != null) {
        currentComments.forEach((comment, index) => {
          if (comment.id == commentId) {
            currentComments[index] = { id: commentId, ...changedComment };
            this.modifiedComment.next(currentComments[index] as Comment);
          }
        });
      } else if (change.type == 'removed') {

      }
    }
    //this.zone.run(() => { });
    this._comments$.next(currentComments);
    this.modifyingComment = false;
  }

  private getComments(postId?: string, pageSize = 10): Observable<Comment[]> {
    const collection = this.db.collection<Comment>('comments', ref => {

      ref.onSnapshot(this.handleCommentChanges.bind(this));

      let where: Query;

      if (postId) {
        where = ref
          .where("postId", "==", postId);
      }

      let query = where || ref;

      query.orderBy(this.orderField, 'desc')
        .limit(this.pageSize);

      return (this.lastKey)
        ? query.startAt(this.lastKey)
        : query;
    });

    return this.mapListKeys<Comment>(collection);
  }

  nextPage(postId?: string): Observable<Comment[]> {
    if (this.finished) { return this.comments$; }

    return this.getComments(postId, this.pageSize + 1)
      .pipe(
        tap(comments => {
          if (!comments.length) {
            return;
          }

          this.lastKey = comments[comments.length - 1][this.orderField];

          const newComments = comments.slice(0, this.pageSize);

          const currentComments = this._comments$.getValue();

          this.finished = this.lastKey == newComments[newComments.length - 1][this.orderField];
          let commentsList = currentComments
            .concat(newComments)
            .filter((thing, index, self) =>
              index === self.findIndex((t) => (
                t.id === thing.id
              ))
            ).sort((a, b) =>{
              return a.createdAt - b.createdAt;
            });
          this._comments$.next(commentsList);
        })
      );
  }

  updateFeed(feed: Object, id: string) {
    return this.db.collection('comments').doc(id).update(feed);
  }

  addComment(feed: Comment) {
    this.modifyingComment = true;
    return this.db.collection('comments').add(feed);
  }

  async removeFeed(id) {
    return await this.db.collection('comments').doc(id).delete();
  }

  public resetComments() {
    this._comments$ = new BehaviorSubject<Comment[]>([]);
    this.lastKey = null;
    this.finished = false;
    this.nextPage()
      .pipe(take(1))
      .subscribe();
  }

  public cleanComments() {
    this._comments$ = new BehaviorSubject<Comment[]>([]);
    this.lastKey = null;
    this.finished = false;
  }
}
