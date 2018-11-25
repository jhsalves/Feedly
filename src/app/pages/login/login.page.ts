import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { User } from '../../models/User';
import { ToastService } from '../../core/toast.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {

  signInForm: FormGroup;
  userCredentials: User;

  constructor(private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private toastService: ToastService,
    private loader: LoadingController) { }

  ngOnInit() {
    this.createSignInForm();
  }

  goToSignup() {
    this.router.navigateByUrl('/signup');
  }

  createSignInForm() {
    this.signInForm = this.formBuilder.group(
      {
        email: ['', [
          Validators.email,
          Validators.required
        ]],
        password: ['',
          [
            Validators.required
          ]
        ]
      }
    );
  }

  async signIn() {
    if (this.signInForm.valid) {
      this.userCredentials = Object.assign({}, this.signInForm.value);
      const loadingElement = await this.loader.create({
        message: 'Aguarde...',
        duration: 2000
      });
      await loadingElement.present().then(() => {
        this.authService.SignIn(this.userCredentials).then(() => {
          this.toastService.presentSuccessToast('Login bem sucedido.').then(async () => {
            await loadingElement.dismiss();
            this.router.navigateByUrl('/feed');
          });
        }).catch(async error => {
          console.log(error);
          await loadingElement.dismiss();
          if (error.code && error.code.indexOf('wrong-password') != -1) {
            this.toastService.presentLightErrorToast('E-mail ou senha incorretos.');
          }else{
            this.toastService.presentLightErrorToast('Ocorreu um erro na autenticação.');
          }
        });
      });
    } else {
      this.toastService.presentLightErrorToast('Preencha com suas credenciais.');
    }
  }
}
