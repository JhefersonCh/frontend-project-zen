import { MatButtonModule } from '@angular/material/button';
import { BasePageComponent } from '../../../shared/components/base-page/base-page.component';
import { ProjectInterface } from '../../interfaces/projects.interface';
import { ProjectsService } from './../../services/projects.service';
import { Component, inject, OnInit } from '@angular/core';
import { BaseCardComponent } from '../../../shared/components/base-card/base-card.component';
import { MatIconModule } from '@angular/material/icon';
import { ArrayInlineFormaterPipe } from '../../../shared/pipes/array-inline-formater.pipe';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    BasePageComponent,
    MatButtonModule,
    BaseCardComponent,
    MatIconModule,
    ArrayInlineFormaterPipe
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements OnInit {
  private readonly _projectsService: ProjectsService = inject(ProjectsService);
  projects?: ProjectInterface[];
  ngOnInit(): void {
    this._getProjects();
  }

  private _getProjects(): void {
    this._projectsService.getProjects().subscribe({
      next: (res) => {
        this.projects = res?.data || [];
      },
      error: (error) => console.error(error)
    });
  }
}
