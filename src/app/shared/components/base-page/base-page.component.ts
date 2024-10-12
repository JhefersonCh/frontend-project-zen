import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-base-page',
  standalone: true,
  imports: [],
  templateUrl: './base-page.component.html',
  styleUrl: './base-page.component.scss'
})
export class BasePageComponent {
  @Input() title: string = '';
  @Input() subtitle?: string;
}
