import { Component, OnInit } from '@angular/core';
import { firestore } from 'firebase';
import { AuthService } from 'src/app/core/auth.service';
import { User } from 'src/app/models/User';
import { ToastService } from 'src/app/core/toast.service';
import { FeedService } from 'src/app/core/feed.service';
import { Feed } from 'src/app/models/Feed';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
})
export class FeedPage implements OnInit {

  text: string;
  user: User;

  constructor(private authService: AuthService, private feedService: FeedService, private toastService: ToastService) { }

  ngOnInit() {
    this.authService.user.subscribe(u => {
      this.user = u;
    });

  }

  postMessage(){
    const feed : Feed = {
      text: this.text,
      createdAt: firestore.FieldValue.serverTimestamp(),
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
