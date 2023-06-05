import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.scss'],
})
export class AuthPageComponent implements OnInit {
  authForm!: FormGroup<{
    email: FormControl<string | null>;
    password: FormControl<string | null>;
  }>;

  constructor(
    private authService: AuthService,
    private fBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  submit() {
    console.log(this.authForm.value.email, this.authForm.value.password);
    if (this.authForm.valid) {
      this.authService
        .login(
          this.authForm.value.email ?? '',
          this.authForm.value.password ?? ''
        )
        .subscribe(() => {});
    }
  }

  initForm() {
    this.authForm = this.fBuilder.group({
      email: [
        'rsoi5.test@mail.ru',
        [Validators.required, Validators.pattern(/[A-z]/)],
      ],
      password: ['', [Validators.required]],
    });
  }
}
