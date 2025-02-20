import { Component, OnDestroy, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as itemsActions from '../ingreso-egreso/ingreso-egreso.actions';

import { filter, Subscription } from 'rxjs';

import { IngresoEgresoService } from '../services/ingreso-egreso.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styles: ``,
})
export class DashboardComponent implements OnInit, OnDestroy {
  userSubs!: Subscription;
  ingresosSubs!: Subscription;

  constructor(
    private store: Store<AppState>,
    private ingresoEgresoService: IngresoEgresoService
  ) {}

  ngOnInit(): void {
    this.userSubs = this.store
      .select('user')
      .pipe(filter((auth) => auth.user != null))
      .subscribe(({ user }) => {
        this.ingresosSubs = this.ingresoEgresoService
          .initIngresosEgresosListener(user?.uid)
          .subscribe((ingresosEgresos) => {
            this.store.dispatch(itemsActions.setItems({items: ingresosEgresos}));
          });
      });
  }

  ngOnDestroy(): void {
    this.ingresosSubs?.unsubscribe();
    this.userSubs?.unsubscribe();
  }
}
