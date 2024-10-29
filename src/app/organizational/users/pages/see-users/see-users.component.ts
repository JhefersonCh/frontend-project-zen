import {
  Component
  // inject, OnInit, ViewChild
} from '@angular/core';
import { BasePageComponent } from '../../../../shared/components/base-page/base-page.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
// import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
// import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { DatePipe } from '@angular/common';
// import { ActivatedRoute } from '@angular/router';
// import { UsersService } from '../../services/users.service';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
// import { UserInterface } from '../../../../shared/interfaces/user.interface';
// import { UsersInterface } from '../../interfaces/users.interface';

@Component({
  selector: 'app-see-users',
  standalone: true,
  imports: [
    BasePageComponent,
    MatFormFieldModule,
    MatIconModule,
    MatPaginatorModule,
    // MatTableModule,
    MatInputModule,
    MatSortModule,
    DatePipe,
    MatButtonModule
  ],
  templateUrl: './see-users.component.html',
  styleUrls: ['./see-users.component.scss']
})
export class SeeUsersComponent {
  //   dataSource!: MatTableDataSource<UserInterface>;
  //   displayedColumns: string[] = [
  //     'identification',
  //     'fullName',
  //     'roleId',
  //     'actions'
  //   ];
  //   id: string | null = '';
  //   subtitle: string = '';
  //   users: UserInterface[] = [];
  //   @ViewChild(MatPaginator) paginator!: MatPaginator;
  //   private readonly _usersService = inject(UsersService);
  //   private readonly _activatedRoute = inject(ActivatedRoute);
  //   ngOnInit(): void {
  //     this.id = this._activatedRoute.snapshot.params?.['id'];
  //     this._activatedRoute.queryParams.subscribe((params) => {
  //       this.subtitle = `Gestiona los miembros activos del proyecto: ${params['title'] || ''}.`;
  //     });
  //     this._getAllUsers(String(this.id));
  //   }
  //   private _getAllUsers(id: String) {
  //     this._usersService.getUsers(id).subscribe({
  //       next: (res) => {
  //         this.users = res?.data || [];
  //         this.dataSource = new MatTableDataSource(this.users);
  //         this.dataSource.paginator = this.paginator;
  //         if (this.dataSource) {
  //           this.dataSource.filterPredicate = (
  //             data: UsersInterface,
  //             filter: string
  //           ) => {
  //             return data.fullName.trim().toLowerCase().includes(filter);
  //           };
  //           this.dataSource.sortingDataAccessor = (item, property) => {
  //             switch (property) {
  //               case 'identification':
  //                 return item.identification;
  //               case 'name':
  //                 return item.fullName;
  //               case 'role':
  //                 return item.role;
  //               default:
  //                 return '';
  //             }
  //           };
  //         }
  //       }
  //     });
  //   }
  //   applyFilter(event: Event) {
  //     const filterValue = (event.target as HTMLInputElement).value;
  //     this.dataSource.filter = filterValue.trim().toLowerCase();
  //     if (this.dataSource.paginator) {
  //       this.dataSource.paginator.firstPage();
  //     }
  //   }
}
