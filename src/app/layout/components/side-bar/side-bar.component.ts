import { NgClass, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MenuInterface } from '../../../shared/interfaces/menu.interface';
import {
  MENU_CONST,
  ROLE_PERMISSIONS
} from '../../../shared/constants/menu.constants';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [
    NgClass,
    NgIf,
    MatButtonModule,
    MatIconModule,
    FontAwesomeModule,
    RouterLink
  ],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent implements OnInit {
  @Input() userRole!: string;
  isCollapsed: boolean = true;
  currentRoute: string = '';
  menuWithItems: MenuInterface[] = [];
  itemSelected: string | null = null;
  moduleSelected: string | null = null;

  ngOnInit(): void {
    this.filterMenuByRole();
  }

  private filterMenuByRole(): void {
    if (this.userRole) {
      this.menuWithItems = MENU_CONST.map((module) => ({
        ...module,
        items: module.items.filter((item) =>
          ROLE_PERMISSIONS[this.userRole]?.includes(item.name)
        )
      })).filter((module) => module.items.length > 0);
    } else {
      this.menuWithItems = [];
    }
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
}
