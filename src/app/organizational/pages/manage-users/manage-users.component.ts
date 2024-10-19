import { Component } from '@angular/core';
import { BasePageComponent } from "../../../shared/components/base-page/base-page.component";
import { BaseCardComponent } from '../../../shared/components/base-card/base-card.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [
    BasePageComponent,
    BaseCardComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.scss'
})
export class ManageUsersComponent {

}
