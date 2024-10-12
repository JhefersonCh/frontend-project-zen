/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arrayInlineFormater',
  standalone: true
})
export class ArrayInlineFormaterPipe implements PipeTransform {
  transform(value: string, isLast: boolean): string {
    if (isLast) {
      return value + '.';
    }
    return value + ', ';
  }
}
