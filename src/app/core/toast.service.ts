import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastController: ToastController) { }

  async presentToast(message, duration : number = 2000, color?) {

    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      color: color,
      position: 'top'
    });
    toast.present();
  }

  async presentToastWithOptions(message, showCloseButton = true, closeButtonText = 'Done', position?, color?) {
    if(!position){
      position = "top";
    }
    
    const toast = await this.toastController.create({
      message: message,
      showCloseButton: showCloseButton,
      position: position,
      closeButtonText: closeButtonText,
      color: color
    });
    toast.present();
  }

  async presentErrorToast(message){
    await this.presentToast(message, 2000, 'medium');
  }

  async presentLightErrorToast(message){
    await this.presentToast(message, 2000, 'light');
  }
}
