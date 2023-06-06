import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

export class LoginErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.scss'],
})
export class AuthPageComponent implements OnInit {
  emailFormControl = new FormControl('rsoi5.test@mail.ru', [
    Validators.required,
    Validators.email,
  ]);
  passwordFormControl = new FormControl('', [Validators.required]);
  matcher = new LoginErrorStateMatcher();

  constructor(private authService: AuthService, private routes: Router) {}

  ngOnInit(): void {}

  login() {
    const email: string = this.emailFormControl.value as string;
    const password: string = this.passwordFormControl.value as string;
    this.authService.login(email, password).subscribe(
      (data) => {
        this.routes.navigate(['hotels']);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
