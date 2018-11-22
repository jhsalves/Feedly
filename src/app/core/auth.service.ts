import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { User as AppUser } from '../models/User';
import { User } from 'firebase';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: Observable<AppUser>;

  constructor(private fireAuth: AngularFireAuth,
    private firestore: AngularFirestore) {

    // this.user = this.fireAuth.authState.pipe(
    //   switchMap(user => {
    //     if (user) {
    //       return this.firestore.doc<AppUser>(`users/${user.uid}`).valueChanges();
    //     } else {
    //       of(null);
    //     }
    //   })
    // );

  }

emailSignUp(user: AppUser) {
    // return this.fireAuth.auth.createUserWithEmailAndPassword(user.email, user.password)
    //   .then(newUser => {
    //     return this.completeSignUp(newUser, user);
    //   }).catch(error => {
    //     return this.handleError(error);
    //   });
  }

  private handleError(error) {
    console.log(error);
    //return await this.alerts.presentErrorAlert(error);
  }

  private completeSignUp(user: any, userData: AppUser) {
    // const userRef: AngularFirestoreDocument<User> = this.firestore.doc(`users/${user.uid}`);

    // const data: User = Object.assign(user, userData);

    // return userRef.set(data);
  }


}
