import { Component } from '@angular/core';
import { BasePageComponent } from '../../../../shared/components/base-page/base-page.component';

@Component({
  selector: 'app-see-users',
  standalone: true,
  imports: [BasePageComponent],
  templateUrl: './see-users.component.html',
  styleUrl: './see-users.component.scss'
})
export class SeeUsersComponent {}
