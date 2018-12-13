import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Comment } from '../../models/Comment';
import { AuthService } from 'src/app/core/auth.service';
import { CommentService } from 'src/app/core/comment.service';
import { User } from 'src/app/models/User';
import { LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { takeLast, take } from 'rxjs/operators';
import { FeedService } from 'src/app/core/feed.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.page.html',
  styleUrls: ['./comment.page.scss']
})
export class CommentPage implements OnInit {

  postId;
  message: string;
  user: User;
  comments: Observable<Comment[]>;
  infiniteEvent: any;

  constructor(private activatedRoute: ActivatedRoute,
              private authService: AuthService,
              private commentService: CommentService,
              private loader: LoadingController,
              private feedService: FeedService) { }

  async ngOnInit() {
    this.postId = this.activatedRoute.snapshot.paramMap.get('id');
    this.authService.user.subscribe(u => {
      this.user = u;
    });
    const loadingElement = await this.loader.create({
      message: 'Aguarde...',
      duration: 2000
    });
    this.comments = this.commentService.comments$;
    await loadingElement.present().then(() => {
      this.commentService.nextPage(this.postId)
        .pipe(takeLast(1))
        .subscribe(async () => {
          await loadingElement.dismiss();
        });
    });
  }

  sendComment(){
    const comment = {
      text: this.message,
      createdAt: Date.now(),
      ownerUid: this.user.uid,
      postId: this.postId,
      ownerName: this.user.name
    } as Comment;

    this.commentService.addComment(comment).then((c) => {
      this.message = '';
    }).catch(error => console.log(error));
  }

  ionViewWillLeave(){
    this.commentService.cleanComments();
  }

  doInfinite(event){
    setTimeout(() => {
      event.target.complete();
      if (!this.commentService.finished) {
        event.target.disabled = false;
          this.commentService.nextPage(this.postId)
            .pipe(take(1))
            .subscribe();
      } else {
        this.infiniteEvent = event;
        event.target.disabled = true;
      }
    }, 500);
  }

  resetPosts(){
    this.feedService.resetPosts();
  }

}
