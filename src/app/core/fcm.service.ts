import { Injectable } from '@angular/core';
import { Firebase } from '@ionic-native/firebase/ngx';
import { AngularFirestore } from 'angularfire2/firestore';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class FcmService {

  constructor(private firebaseNative: Firebase,
    private afs: AngularFirestore,
    private platform: Platform) { }

  async getToken(uid) {

    let token;

    if (this.platform.is('android')) {
      token = await this.firebaseNative.getToken()
    }

    if (this.platform.is('ios')) {
      token = await this.firebaseNative.getToken();
      await this.firebaseNative.grantPermission();
    }

    await this.saveTokenToFirestore(token, uid);

    return token;
  }

  async saveTokenToFirestore(token, uid){
    if(!token) return;

    const usersRef = this.afs.collection('users');

    const data = {
      token,
      updateAt: Date.now()
    }

    return await usersRef.doc(uid)
    .set(data, 
      {
        merge: true
      });
  }

  listenToNotifications(){
    return this.firebaseNative.onNotificationOpen();
  }
}
