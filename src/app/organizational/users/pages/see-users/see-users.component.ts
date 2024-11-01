import {
  Component,
  inject,
  OnInit,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { UsersService } from '../../services/users.service';
import { UsersInterface } from '../../interfaces/users.interface';
import { ApiResponseInterface } from '../../../../shared/interfaces/api-response.interface';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { BasePageComponent } from '../../../../shared/components/base-page/base-page.component';

@Component({
  selector: 'app-see-users',
  standalone: true,
  imports: [
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIcon,
    CommonModule,
    MatPaginatorModule,
    BasePageComponent,
    MatTableModule
  ],
  templateUrl: './see-users.component.html',
  styleUrls: ['./see-users.component.scss']
})
export class SeeUsersComponent implements OnInit, AfterViewInit {
  private readonly _usersService: UsersService = inject(UsersService);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource = new MatTableDataSource<UsersInterface>([]);
  displayedColumns: string[] = ['identification', 'email', 'role', 'actions'];
  totalItems: number = 0;
  pageSize: number = 5; // Tamaño de página inicial
  currentPage: number = 0;

  ngOnInit(): void {
    this.loadUsers();
  }

  ngAfterViewInit(): void {
    this.paginator.page.subscribe(() => {
      this.currentPage = this.paginator.pageIndex;
      this.pageSize = this.paginator.pageSize;
      this.loadUsers();
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  loadUsers(): void {
    const query = {
      page: this.currentPage + 1, // Sumar 1 si tu paginación comienza en 1
      perPage: this.pageSize
    };

    this._usersService.getUserWithPagination(query).subscribe({
      next: (res: ApiResponseInterface<UsersInterface[]>) => {
        if (res.data) {
          this.dataSource.data = res.data.filter((user) => user !== null) || [];
          this.totalItems = res.pagination?.total || 0;
          this.paginator.length = this.totalItems;
        } else {
          console.warn('No se encontraron datos en la respuesta');
        }
      },
      error: (error) => {
        console.error('Error en la solicitud:', error);
        if (error.error && error.error.message) {
          console.error('Mensajes de error:', error.error.message);
        }
      }
    });
  }
}
