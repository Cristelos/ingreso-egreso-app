import { Injectable } from '@angular/core';
import {
  collection,
  addDoc,
  Firestore,
  collectionData,
  doc,
  deleteDoc,
} from '@angular/fire/firestore';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { AuthService } from './auth.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IngresoEgresoService {
  constructor(private firestore: Firestore, private authService: AuthService) {}

  crearIngresoEgreso(ingresoEgreso: IngresoEgreso) {
    // Verifica usuario
    if (!this.authService.user) {
      throw new Error('No hay usuario autenticado');
    }
    const userUid = this.authService.user.uid;

    const { uid, ...data } = ingresoEgreso;

    return addDoc(
      collection(this.firestore, `${userUid}/ingreso-egreso/items`),
      data
    );
  }

  initIngresosEgresosListener(uid?: string) {
    const itemsCollectionRef = collection(
      this.firestore,
      `${uid}/ingreso-egreso/items`
    );

    return collectionData(itemsCollectionRef, { idField: 'id' }).pipe(
      map((items: any[]) =>
        items.map((item) => {
          const { id, ...data } = item;
          return { ...data, uid: id };
        })
      )
    );
  }

  borrarIngresoEgreso(uidItem: any) {
    const userUid = this.authService.user.uid;

    const docRef = doc(
      this.firestore,
      `${userUid}/ingreso-egreso/items/${uidItem}`
    );

    return deleteDoc(docRef);
  }
}
