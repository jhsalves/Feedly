import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { Firebase } from '@ionic-native/firebase';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginPage } from './pages/login/login.page';
import { SignupPage } from './pages/signup/signup.page';
import { environment } from 'src/environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFirestoreModule, AngularFirestore } from 'angularfire2/firestore';
import { Camera } from '@ionic-native/camera/ngx';
import { AngularFireStorage } from '@angular/fire/storage';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireMessagingModule } from '@angular/fire/messaging'

@NgModule({
  declarations: [AppComponent, LoginPage, SignupPage],
  entryComponents: [LoginPage, SignupPage],
  imports: [BrowserModule,
     IonicModule.forRoot(),
     AppRoutingModule,
     AngularFireModule.initializeApp(environment.firebaseConfig),
     AngularFireDatabaseModule,
     AngularFireAuthModule,
     AngularFirestoreModule,
     AngularFireMessagingModule,
     FormsModule,
     ReactiveFormsModule,
     HttpClientModule
    ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    AngularFireStorage,
    Firebase
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
