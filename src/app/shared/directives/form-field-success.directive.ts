import {
  AfterViewInit,
  Directive,
  ElementRef,
  Host,
  Optional,
  Renderer2
} from '@angular/core';
import {
  MatFormField,
  MatFormFieldControl
} from '@angular/material/form-field';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: 'mat-form-field',
  standalone: true
})
export class FormFieldSuccessDirective implements AfterViewInit {
  private _controlWasInvalid!: boolean;
  private readonly _successClass: string = 'brand-success-mat-form-field';

  constructor(
    @Optional() @Host() private _matFormField: MatFormField,
    private _elementRef: ElementRef,
    private _renderer: Renderer2
  ) {}

  ngAfterViewInit(): void {
    const formFieldControl: MatFormFieldControl<unknown> | undefined =
      this._matFormField._formFieldControl;
    formFieldControl.ngControl?.statusChanges?.subscribe(
      (controlState: 'INVALID' | 'VALID'): void => {
        if (controlState === 'INVALID') {
          this._controlWasInvalid = true;
          this._renderer.removeClass(
            this._elementRef.nativeElement,
            this._successClass
          );
        }

        if (controlState === 'VALID' && this._controlWasInvalid) {
          this._controlWasInvalid = false;
          this._renderer.addClass(
            this._elementRef.nativeElement,
            this._successClass
          );
        }
      }
    );
  }
}
