import { Pipe, PipeTransform } from '@angular/core';
import { IngresoEgreso } from '../models/ingreso-egreso.model';

@Pipe({
  name: 'ordenIngreso',
  standalone: false,
})
export class OrdenIngresoPipe implements PipeTransform {
  transform(items: IngresoEgreso[]): IngresoEgreso[] {
    // Clonamos el arreglo antes de ordenarlo
    return [...items].sort((a, b) => {
      if (a.tipo === 'ingreso' && b.tipo !== 'ingreso') {
        return -1;
      } else if (a.tipo !== 'ingreso' && b.tipo === 'ingreso') {
        return 1;
      } else {
        return 0;
      }
    });
  }
}
