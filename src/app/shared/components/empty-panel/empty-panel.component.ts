import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-panel',
  standalone: true,
  imports: [],
  templateUrl: './empty-panel.component.html',
  styleUrl: './empty-panel.component.scss'
})
export class EmptyPanelComponent {
  @Input() text: string = '';
  @Input() title: string = '';
}
