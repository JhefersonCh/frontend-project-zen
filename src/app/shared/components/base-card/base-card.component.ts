import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';

@Component({
  selector: 'app-base-card',
  standalone: true,
  imports: [MatCardModule, MatRippleModule, NgClass],
  templateUrl: './base-card.component.html',
  styleUrl: './base-card.component.scss'
})
export class BaseCardComponent {
  @Input() ripple: boolean = false;
  @Input() withHeader: boolean = true;
  @Input() withActions: boolean = true;
  @Input() isProfileCard: boolean = false;
  @Input() isMiniCard: boolean = false;
  @Input() isClickeable: boolean = false;
}
