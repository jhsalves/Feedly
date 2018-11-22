import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '../core/auth.service';
import { User } from '../models/User';
import { AlertService } from '../core/alert.service';
import { debug } from 'util';


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
              private alerts: AlertService) { }

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
        this.alerts.presentAlert('Parabéns', 'Seu cadastro foi feito com sucesso').then(() => {
          this.router.navigateByUrl('/login');
        });
      }).catch(() => {
        this.alerts.presentErrorAlert('O cadastro falhou. Verifique se esse e-mail já não está cadastrado.');
      });
    }else if(this.registerForm.get("password").errors){
      this.alerts.presentErrorAlert('Informe uma senha com 6 ou mais caracteres.');
    }else if(this.registerForm.get("email").errors){
      this.alerts.presentErrorAlert('Informe um e-mail válido.');
    }
  }

  goToSignUp() {
    this.router.navigateByUrl('/login');
  }

}
