import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '../../core/auth.service';
import { User } from '../../models/User';
import { ToastService } from '../../core/toast.service';
import { LoadingController } from '@ionic/angular';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  user: User;
  registerForm: FormGroup;

  constructor(private router: Router,
              private fb: FormBuilder,
              private authService: AuthService,
              private toasts: ToastService,
              private loader: LoadingController) { }

  ngOnInit() {
    this.createRegisterForm();
  }

  createRegisterForm() {
    this.registerForm = this.fb.group(
      {
        name: ['', Validators.required],
        email: ['', [
          Validators.email,
          Validators.required
        ]],
        password: ['',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(20)
          ]
        ]
      }
    );
  }

  async signUp(){
    if(this.registerForm.valid){
      const user: User = Object.assign({}, this.registerForm.value);
      const loadingElement = await this.loader.create({
        message: 'Aguarde...',
        duration: 2000
      });
      await loadingElement.present().then(() => {
        this.authService.emailSignUp(user).then(() => {
          this.toasts.presentLightErrorToast('Seu cadastro foi feito com sucesso').then(async () => {
            this.router.navigateByUrl('/login');
          });
        }).catch(async () => {
          this.toasts.presentToast('Esse e-mail pode já estar cadastrado.');
        }).finally(async () => {
          await loadingElement.dismiss();
        });
      })
    }else if(this.registerForm.get("password").errors){
      this.toasts.presentLightErrorToast('A senha é de 6 ou mais caracteres.');
    }else if(this.registerForm.get("email").errors){
      this.toasts.presentLightErrorToast('Informe um e-mail válido.');
    }
  }

  goToSignUp() {
    this.router.navigateByUrl('/login');
  }

}
