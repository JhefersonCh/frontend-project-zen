import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CustomValidationsService {
  /**
   * Valida si una fecha es menor a la fecha actual
   * @returns ValidatorFn que verifica si la fecha es menor a la actual
   */
  isLessThanToday(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const inputDate = new Date(control.value);
      const today = new Date();
      inputDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      return inputDate < today ? { futureDate: true } : null;
    };
  }

  /**
   * Valida si una fecha es menor a la fecha actual permitiendo que sea igual
   * @returns ValidatorFn que verifica si la fecha es menor o igual a la actual
   */
  isLessThanOrEqualToday(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const inputDate = new Date(control.value);
      const today = new Date();
      inputDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      return inputDate <= today ? { futureDate: true } : null;
    };
  }

  /**
   * Valida si una fecha está dentro de un rango específico
   * @param minDate Fecha mínima permitida
   * @param maxDate Fecha máxima permitida (opcional, por defecto es la fecha actual)
   * @returns ValidatorFn que verifica si la fecha está dentro del rango
   */
  isDateInRange(minDate: Date, maxDate: Date = new Date()): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const inputDate = new Date(control.value);
      inputDate.setHours(0, 0, 0, 0);
      minDate.setHours(0, 0, 0, 0);
      maxDate.setHours(0, 0, 0, 0);

      if (inputDate < minDate) {
        return { beforeMinDate: true };
      }

      if (inputDate > maxDate) {
        return { afterMaxDate: true };
      }

      return null;
    };
  }
}
