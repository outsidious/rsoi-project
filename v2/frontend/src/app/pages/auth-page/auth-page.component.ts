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
  email: string = '';
  password: string = '';
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
    this.authForm.valueChanges.subscribe((value) => {
      console.log(value.email, value.password);
    });
  }

  submit() {
    if (this.authForm.valid) {
      this.authService.login(this.email, this.password).subscribe(() => {});
    }
  }

  /*login() {
    this.authService.login(this.email, this.password).subscribe(() => {});
  }*/

  initForm() {
    this.authForm = this.fBuilder.group({
      email: ['test', [Validators.required, Validators.pattern(/[A-z]/)]],
      password: ['', [Validators.required]],
    });
  }
}
