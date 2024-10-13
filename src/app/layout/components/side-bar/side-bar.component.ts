/* eslint-disable @typescript-eslint/no-explicit-any */
import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  ItemInterface,
  MenuInterface
} from '../../../shared/interfaces/menu.interface';
import {
  MENU_CONST,
  ROLE_PERMISSIONS
} from '../../../shared/constants/menu.constants';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import { filter } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [
    NgClass,
    NgIf,
    MatButtonModule,
    MatIconModule,
    FontAwesomeModule,
    RouterLink,
    MatMenuModule,
    NgFor,
    MatTooltipModule
  ],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss',
  animations: [
    trigger('submenuState', [
      state(
        'closed',
        style({
          maxHeight: '0px',
          opacity: 0
        })
      ),
      state(
        'open',
        style({
          maxHeight: '500px',
          opacity: 1
        })
      ),
      transition('closed <=> open', [animate('0.3s ease-in-out')])
    ])
  ]
})
export class SideBarComponent implements OnInit {
  @Input() userRole!: string;
  isCollapsed: boolean = true;
  currentRoute: string = '';
  menuWithItems: MenuInterface[] = [];
  itemSelected: string | null = null;
  moduleSelected: string | null = null;
  private readonly _router: Router = inject(Router);

  @ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;

  ngOnInit(): void {
    this.currentRoute = this._router.url;

    this._router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.currentRoute = this._router.url;
      });
    this.filterMenuByRole();
  }

  private filterMenuByRole(): void {
    if (this.userRole) {
      if (this.userRole === 'admin') {
        this.menuWithItems = MENU_CONST;
      } else {
        this.menuWithItems = MENU_CONST.map((module) => ({
          ...module,
          items: module.items.filter((item) =>
            ROLE_PERMISSIONS[this.userRole]?.includes(item.name)
          )
        })).filter((module) => module.items.length > 0);
      }
    } else {
      this.menuWithItems = [];
    }
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    if (this.isCollapsed) {
      this.closeAllSubMenus();
    }
  }

  openSubMenu: Record<string, boolean> = {};

  closeAllSubMenus() {
    this.openSubMenu = {};
  }

  toggleSubMenu(item: ItemInterface) {
    if (!this.isCollapsed) {
      this.openSubMenu[item.name] = !this.openSubMenu[item.name];
    }
  }

  closeMenu() {
    if (this.menuTrigger) {
      this.menuTrigger.closeMenu();
    }
  }
}
