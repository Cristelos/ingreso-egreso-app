export class Usuario {
    static fromFirebase({ uid, email, nombre }: { uid: any; email: any; nombre: any; }): Usuario {
      return new Usuario(uid, nombre, email);
    }
    
    constructor(
      public uid: string,
      public nombre: string,
      public email: string,
    ) {}
  }  