import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortBy'
})
export class SortByPipe implements PipeTransform {

  transform(value: any[], field: string): any[] {
    if (!value || !field) {
      return value;  // Si no hay valor o campo, retornar el valor original
    }

    return value.sort((a: any, b: any) => {
      return a[field].toLowerCase().localeCompare(b[field].toLowerCase());
    });
  }

}
