import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '../core/auth.service';
import { User } from '../models/User';
import { AlertService } from '../core/alert.service';
import { debug } from 'util';
import { ToastService } from '../core/toast.service';


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
              private toasts: ToastService) { }

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

  signUp(){
    if(this.registerForm.valid){
      const user: User = Object.assign({}, this.registerForm.value);
      this.authService.emailSignUp(user).then(() => {
        this.toasts.presentErrorToast('Seu cadastro foi feito com sucesso').then(() => {
          this.router.navigateByUrl('/login');
        });
      }).catch(() => {
        this.toasts.presentToast('Verifique se esse e-mail está cadastrado.');
      });
    }else if(this.registerForm.get("password").errors){
      this.toasts.presentErrorToast('A senha é de 6 ou mais caracteres.');
    }else if(this.registerForm.get("email").errors){
      this.toasts.presentErrorToast('Informe um e-mail válido.');
    }
  }

  goToSignUp() {
    this.router.navigateByUrl('/login');
  }

}
