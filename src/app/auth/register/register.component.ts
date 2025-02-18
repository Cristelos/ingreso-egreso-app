import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import * as ui from '../../shared/ui.actions';

import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styles: ``,
})
export class RegisterComponent implements OnInit, OnDestroy {
  registroFrom!: FormGroup;
  cargando: boolean = false;
  uiSubscription!: Subscription;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private store: Store<AppState>,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.registroFrom = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          this.passwordStrengthValidator(),
        ],
      ],
    });

    this.uiSubscription = this.store
      .select('ui')
      .subscribe((ui) => (this.cargando = ui.isLoading));
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  passwordStrengthValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.value;
      if (!password) return null;

      const hasUpperCase = /[A-Z]+/.test(password);
      const hasLowerCase = /[a-z]+/.test(password);
      const hasNumeric = /[0-9]+/.test(password);

      const passwordValid = hasUpperCase && hasLowerCase && hasNumeric;
      return !passwordValid ? { passwordStrength: true } : null;
    };
  }

  crearUsuario() {
    if (this.registroFrom.invalid) {
      return;
    }

    const { nombre, correo, password } = this.registroFrom.value;

    this.store.dispatch(ui.isLoading());

    // Swal.fire({
    //   title: "Espere por favor",
    //   didOpen: () => {
    //     Swal.showLoading();
    //   }
    // });

    this.authService
      .createUser(nombre, correo, password)
      .then((credenciales) => {
        //Swal.close();
        this.store.dispatch(ui.stopLoading());
        this.router.navigate(['/']);
      })
      .catch((err) => {
        this.store.dispatch(ui.stopLoading());
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.message,
        });
      });
  }
}
