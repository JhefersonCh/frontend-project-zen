import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { BasePageComponent } from '../../../../shared/components/base-page/base-page.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { DatePipe } from '@angular/common';
import { UsersInterface } from '../../interfaces/users.interface';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-see-users',
  standalone: true,
  imports: [
    BasePageComponent,
    MatFormFieldModule,
    MatIconModule,
    MatPaginatorModule,
    MatTableModule,
    MatInputModule,
    MatSortModule,
    DatePipe
  ],
  templateUrl: './see-users.component.html',
  styleUrls: ['./see-users.component.scss']
})
export class SeeUsersComponent implements OnInit {
  dataSource!: MatTableDataSource<UsersInterface>;
  displayedColumns: string[] = ['createdAt', 'fullname', 'roleId', 'actions'];
  userId: string = '';
  subtitle: string = '';
  users: UsersInterface[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private readonly _usersService: UsersService = inject(UsersService);
  private readonly _activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    console.log('hola');
    this.userId = this._activatedRoute.snapshot.params?.['id'];
    this._activatedRoute.queryParams.subscribe((params) => {
      this.subtitle = `Gestiona los roles de los usuarios: ${params['title']}.`;
    });
    this._getAllUsers(this.userId);
  }

  private _getAllUsers(userId: string): void {
    this._usersService.getUsers(userId).subscribe({
      next: (res) => {
        this.users = res?.data || [];
        this.dataSource = new MatTableDataSource(this.users);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        if (this.dataSource) {
          this.dataSource.filterPredicate = (
            data: UsersInterface,
            filter: string
          ) => {
            return data.fullName.trim().toLowerCase().includes(filter);
          };
          this.dataSource.sortingDataAccessor = (item, property) => {
            switch (property) {
              case 'createdAt':
                return new Date(item.createdAt).getTime();
              case 'fullname':
                return item.fullName;
              case 'roleId':
                return String(item.role); // Convertir a string para evitar el error de tipo
              default:
                return '';
            }
          };
        }
      },
      error: (error) => {
        console.error('Error al obtener los usuarios', error);
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
