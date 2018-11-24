import { Component, OnInit } from '@angular/core';
import { firestore } from 'firebase';
import { AuthService } from 'src/app/core/auth.service';
import { User } from 'src/app/models/User';
import { ToastService } from 'src/app/core/toast.service';
import { FeedService } from 'src/app/core/feed.service';
import { Post } from 'src/app/models/Post';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
})
export class FeedPage implements OnInit {

  text: string;
  user: User;
  posts: Observable<Post[]>;

  constructor(private authService: AuthService, private feedService: FeedService, private toastService: ToastService) {
    this.authService.user.subscribe(u => {
      this.user = u;
    });
  }

  ngOnInit() {
    this.posts = this.feedService.posts$;
  }

  ionViewDidLoad() {
    this.posts = this.feedService.posts$;
  }

  postMessage() {
    firestore.FieldValue;
    const post: Post = {
      text: this.text,
      createdAt: Date.now(),
      owner: this.user.uid,
      ownerName: this.user.name
    };
    this.feedService.addPost(post).then(result => {
      this.toastService.presentSuccessToast('Sua mensagem foi postada.');
    }).catch(error => {
      this.toastService.presentErrorToast('Erro ao postar sua mensagem.');
      console.log(error);
    });
  }

  doInfinite(event): Promise<void> {
    setTimeout(() => {
      event.target.complete();
      if (!this.feedService.finished) {
        return new Promise((resolve, reject) => {
          this.feedService.nextPage() // 3
            .pipe(take(1))
            .subscribe(() => {
              resolve();
            });
        });
      }

      if (this.feedService.finished) {
        event.target.disabled = true;
      }
    }, 500);
    return Promise.resolve();
  }

}
