import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(public alertCtrl: AlertController) { }

  async presentAlert(title: string, message: string) {
    const alert = await this.alertCtrl.create(
      {
        header: title,
        subHeader: message,
        buttons: [
          {
            text: 'OK'
          }
        ]
      });

    return await alert.present();
  }

  async presentErrorAlert(message: string) {
    return await this.presentAlert('Atenção.', message);
  }

  async presentAlertWithCallback(title: string, message: string): Promise<boolean> {
    let alert = await this.alertCtrl.create({
        header: title,
        message: message,
        buttons: [{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            return alert.dismiss();
          }
        }, {
          text: 'Yes',
          handler: () => {
            alert.dismiss();
            return false;
          }
        }]
      });

      return alert.present();
  }
}
