import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  authState,
} from '@angular/fire/auth';
import { setDoc, Firestore, doc, getDoc } from '@angular/fire/firestore';
import { map } from 'rxjs';
import { Usuario } from '../models/usuario.models';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as actions from '../auth/auth.actions';
import * as ingresoEgresoActions from '../ingreso-egreso/ingreso-egreso.actions';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userId!: string;
  private _user: Usuario | null = null;

  get user() {
    return { ...this._user };
  }

  constructor(
    private auth: Auth,
    private store: Store<AppState>,
    private firestore: Firestore
  ) {}

  initAuthListener() {
    return authState(this.auth).subscribe(async (fuser: any) => {
      const docRef = doc(this.firestore, `${fuser?.uid}/user`);

      const docSnap = await getDoc(docRef);

      const docData = docSnap.data()!;
      if (docSnap.exists()) {
        this.userId = docData['uid'];

        const user = Usuario.fromFirebase({
          uid: docData['uid'],
          email: docData['email'],
          nombre: docData['nombre'],
        });

        this._user = user;
        this.store.dispatch(actions.setUser({ user }));
      } else {
        this._user = null;
        this.store.dispatch(actions.unSetUser());
        this.store.dispatch(ingresoEgresoActions.unSetItems());
      }
    });
  }

  createUser(name: string, email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password).then(
      ({ user }) => {
        const newUser = new Usuario(user.uid, name, email);
        return setDoc(doc(this.firestore, user.uid, 'user'), { ...newUser });
      }
    );
  }

  loginUser(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }

  isAuth() {
    return authState(this.auth).pipe(map((fUser) => fUser !== null));
  }
}
