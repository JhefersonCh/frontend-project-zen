import { Component } from '@angular/core';
import { BasePageComponent } from '../../../shared/components/base-page/base-page.component';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  standalone: true,
  imports: [BasePageComponent],
  styleUrls: ['./test.component.scss']
})
export class TestComponent {}
