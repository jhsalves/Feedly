import { Component, OnInit } from '@angular/core';
import { firestore } from 'firebase';
import { AuthService } from 'src/app/core/auth.service';
import { User } from 'src/app/models/User';
import { ToastService } from 'src/app/core/toast.service';
import { FeedService } from 'src/app/core/feed.service';
import { Feed } from 'src/app/models/Feed';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
})
export class FeedPage implements OnInit {

  text: string;
  user: User;
  feeds: Observable<Feed[]>;

  constructor(private authService: AuthService, private feedService: FeedService, private toastService: ToastService) { }

  ngOnInit() {
    this.authService.user.subscribe(u => {
      this.user = u;
    });

    this.feeds = this.feedService.getFeeds();
    console.log(this.feeds);
  }

  postMessage() {
    firestore.FieldValue;
    const feed: Feed = {
      text: this.text,
      createdAt: Date.now(),
      owner: this.user.uid,
      ownerName: this.user.name
    };
    this.feedService.addFeed(feed).then(result => {
      this.toastService.presentSuccessToast('Sua mensagem foi postada.');
    }).catch(error => {
      this.toastService.presentErrorToast('Erro ao postar sua mensagem.');
      console.log(error);
    });


  }

}
