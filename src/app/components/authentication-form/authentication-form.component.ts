import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-authentication-form',
  templateUrl: './authentication-form.component.html',
  styleUrls: ['./authentication-form.component.css']
})
export class AuthenticationFormComponent implements OnInit {

  formData: any = {};

  emptyEmail: boolean;
  emptyPassword: boolean;
  notValid: boolean;

  constructor(
    private router: Router,
    private auth: AuthService) { }

  ngOnInit() {
  }

  onSubmit() {

    this.emptyEmail = !this.formData['email'];
    this.emptyPassword = !this.formData['password'];

    if (this.emptyEmail || this.emptyPassword) {
      this.notValid = false;
      return;
    }

    this.auth.login(
      this.formData['email'],
      this.formData['password'],
    ).subscribe(loginInfo => {
      if (!loginInfo || loginInfo['error']) {
        localStorage.removeItem('token');
        this.notValid = true;
        return;
      }
      localStorage.setItem('token', loginInfo['idToken']);
      localStorage.setItem('refreshToken', loginInfo['refreshToken']);
      this.router.navigate(['/content']);
    });
  }
}
