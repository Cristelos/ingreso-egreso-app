import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styles: ``
})
export class SidebarComponent {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  logout() {
    Swal.fire({
      title: "Cerrando sesión",
      didOpen: () => {
        Swal.showLoading();
      }
    });
    this.authService.logout().then(() => {
      Swal.close();
      this.router.navigate(['/login']);
    })
  }

}
