import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { User } from '../models/User';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: Observable<User>;

  constructor(private fireAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private alerts: AlertService) {

    this.user = this.fireAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.firestore.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          of(null);
        }
      })
    );

  }

  async emailSignUp(user: User) {
    return this.fireAuth.auth.createUserWithEmailAndPassword(user.email, user.password)
      .then(async newUser => {
        return await this.completeSignUp(newUser, user).then(() => {
          return true;
        });
      }).catch(error => {
        this.handleError(error);
        throw Error();
      });
  }

  private async handleError(error) {
    console.log(error);
  }

  private async completeSignUp(data: any, appUser: User) {

    if (!data.user) {
      throw new Error();
    }
    const newUser: firebase.User = data.user;

    await newUser.updateProfile({
      displayName: appUser.name,
      photoURL: ""
    }).then(() => {
      let uid = data.user.uid;
      const userRef: AngularFirestoreDocument<User> = this.firestore.doc(`users/${uid}`);

      appUser.uid = uid;

      delete appUser.password;

      return userRef.set(appUser);
    });
  }

  async SignIn(credentials: any){
    return await this.fireAuth.auth.signInWithEmailAndPassword(credentials.email, credentials.password);
  }
}
