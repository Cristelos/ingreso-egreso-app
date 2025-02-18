import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import * as ui from '../../shared/ui.actions';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styles: ``,
})
export class LoginComponent implements OnInit, OnDestroy {
  loginFrom!: FormGroup;
  cargando: boolean = false;
  uiSubscription!: Subscription;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private store: Store<AppState>,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loginFrom = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.uiSubscription = this.store.select('ui').subscribe((ui) => {
      this.cargando = ui.isLoading;
    });
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  loginUsuario() {
    if (this.loginFrom.invalid) {
      return;
    }

    this.store.dispatch(ui.isLoading());

    const { correo, password } = this.loginFrom.value;

    // Swal.fire({
    //   title: "Espere por favor",
    //   didOpen: () => {
    //     Swal.showLoading();
    //   }
    // });

    this.authService
      .loginUser(correo, password)
      .then((credenciales) => {
        let timerInterval;
        //∫ Swal.close();
        this.store.dispatch(ui.stopLoading());

        this.router.navigate(['/']);
      })
      .catch((err) => {
        this.store.dispatch(ui.isLoading());

        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.message,
        });
      });
  }
}
