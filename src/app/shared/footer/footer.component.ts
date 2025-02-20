import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.component.html',
  styles: ``
})
export class FooterComponent {

  getYear(){
    let today = new Date();
    let year = today.getFullYear();

    return year;
  };

}
