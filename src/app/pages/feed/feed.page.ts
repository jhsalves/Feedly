import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth.service';
import { User } from 'src/app/models/User';
import { ToastService } from 'src/app/core/toast.service';
import { FeedService } from 'src/app/core/feed.service';
import { Post } from 'src/app/models/Post';
import { Observable } from 'rxjs';
import { take, last, takeLast } from 'rxjs/operators';
import { LoadingController, ActionSheetController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { UploadService } from 'src/app/core/upload.service';
import { Upload } from 'src/app/models/Upload';
import { DocumentReference } from 'angularfire2/firestore';
import { Like } from 'src/app/models/Like';
import { LikeService } from 'src/app/core/like.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
})
export class FeedPage implements OnInit {

  text: string;
  image: string = undefined;
  upload: Upload;
  user: User;
  posts: Observable<Post[]>;
  infiniteEvent: any;
  likeAction = false;

  constructor(
    private authService: AuthService,
    private feedService: FeedService,
    private toastService: ToastService,
    private loader: LoadingController,
    private router: Router,
    private actionSheet: ActionSheetController,
    private camera: Camera,
    private uploadService: UploadService,
    private likeService: LikeService) {
    this.authService.user.subscribe(u => {
      this.user = u;
    });
  }

  async ngOnInit() {
    const loadingElement = await this.loader.create({
      message: 'Aguarde...',
      duration: 2000
    });
    this.posts = this.feedService.posts$;
    await loadingElement.present().then(() => {
      this.feedService.nextPage()
        .pipe(takeLast(1))
        .subscribe(async () => {
          await loadingElement.dismiss();
        });
    });
  }

  async postMessage() {
    const post: Post = {
      text: this.text,
      createdAt: Date.now(),
      owner: this.user.uid,
      ownerName: this.user.name
    };
    const loadingElement = await this.loader.create({
      message: 'Aguarde...',
      duration: 2000
    });
    loadingElement.present();
    await this.feedService.addPost(post).then(async (doc: DocumentReference) => {
      if (this.image) {
        await this.postImage(doc, loadingElement);
      }
      this.image = undefined;
      this.upload = undefined;
      this.text = "";
      this.toastService.presentSuccessToast('Sua mensagem foi postada.');
    }).catch(error => {
      this.toastService.presentErrorToast('Erro ao postar sua mensagem.');
      console.log(error);
    }).finally(async () => await loadingElement.dismiss());

  }

  private async postImage(doc: DocumentReference, loader: any) {
    this.upload = new Upload(this.image, 'image/png');
    this.upload.name = doc.id;
    await this.uploadService.pushUpload(this.upload).then(async () => {
      this.upload.progress.subscribe(progress => {
        loader.setContent({
          message: `${progress}% enviado%`
        });
      });
      this.upload.url.subscribe(url => {
        ;
        this.feedService.updateFeed({ image: url }, doc.id).then((x) => {
          loader.dismiss();
          return Promise.resolve(x);
        }).catch(() => {
          loader.dismiss();
          Promise.reject();
        });
      })
    })
  }

  doInfinite(event) {
    setTimeout(() => {
      event.target.complete();
      if (!this.feedService.finished) {
        event.target.disabled = false;
        this.feedService.nextPage()
          .pipe(take(1))
          .subscribe();
      } else {
        this.infiniteEvent = event;
        event.target.disabled = true;
      }
    }, 500);
  }

  refresh(event) {
    this.feedService.resetPosts();
    this.posts = this.feedService.posts$;
    event.target.complete();
    if (this.infiniteEvent) {
      this.infiniteEvent.target.disabled = false;
    }
  }

  logOut() {
    this.authService.LogOut().then(() => {
      this.router.navigateByUrl('/login');
    }).catch(() => {
      this.toastService.presentLightErrorToast('Você não está logado.');
    });
  }

  lauchCamera(sourceType) {
    let options: CameraOptions = {
      quality: 100,
      sourceType: sourceType,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      targetHeight: 512,
      targetWidth: 512,
      allowEdit: false
    }

    this.camera.getPicture(options).then(base64Image => {
      this.image = "data:image/png;base64," + base64Image;
    }).catch(error => {
      console.log(error);
    });
  }

  async addPhoto() {
    const actionSheet = await this.actionSheet.create({
      header: 'De onde você quer a foto?',
      buttons: [{
        text: 'Camera',
        icon: 'camera',
        handler: () => {
          this.lauchCamera(this.camera.PictureSourceType.CAMERA);
        }
      }, {
        text: 'Álbum',
        icon: 'albums',
        handler: () => {
          this.lauchCamera(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      }, {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          this.actionSheet.dismiss();
        }
      }]
    });

    await actionSheet.present();

  }

  ionViewDidEnter() {
    this.posts = this.feedService.posts$;
  }

  like(post: Post) {
    const like = new Like(post, this.user.uid);
    post.modifying = true;
    this.likeService.updateLike(like).subscribe((response) => {
      this.feedService.modifyingPost = true;
      this.feedService.modifiedPost.subscribe((emittedPost) => {
        let likeData = new Like(emittedPost, this.user.uid);
        if (like.action == 'like' && likeData.action == 'unlike') {
          this.toastService.presentLightErrorToast('Você gostou do post.');
        }
      });
    }, error => {
      console.log(error);
    }, () => {
      post.modifying = false;
    });
  }
}
