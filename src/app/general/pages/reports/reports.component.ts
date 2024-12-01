import { EmptyPanelComponent } from './../../../shared/components/empty-panel/empty-panel.component';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { BasePageComponent } from '../../../shared/components/base-page/base-page.component';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { ChartOptions } from '../../../shared/interfaces/charts.interface';
import { BarChartComponent } from '../../../shared/components/bar-chart/bar-chart.component';
import { PolarChartComponent } from '../../../shared/components/polar-chart/polar-chart.component';
import { ReportsService } from '../../services/reports.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PolarChartPercentComponent } from '../../../shared/components/polar-chart-percent/polar-chart-percent.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { finalize, forkJoin } from 'rxjs';
import { ProjectsService } from '../../services/projects.service';
import { ProjectInterface } from '../../interfaces/projects.interface';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    BasePageComponent,
    MatTabsModule,
    BarChartComponent,
    PolarChartComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    EmptyPanelComponent,
    PolarChartPercentComponent,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatButtonModule,
    LoaderComponent,
    MatSelectModule
  ],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent implements OnInit {
  @ViewChild(BarChartComponent) barChart!: BarChartComponent;
  @ViewChild(PolarChartComponent) polarChart!: PolarChartComponent;
  selectedTabIndex = 0;
  reloadAllSizes: boolean = false;
  selectedTab: string = 'Proyectos';
  dateRange: FormGroup;
  isLoadingProjects: boolean = false;
  isLoadingTaks: boolean = false;
  isLoadingMembers: boolean = false;
  projectControl: FormControl = new FormControl();

  constructor(private fb: FormBuilder) {
    this.dateRange = this.fb.group({
      start: [new Date('2024-01-01')],
      end: [new Date('2024-12-31')]
    });
  }

  projectsTime?: Partial<ChartOptions>;
  projectVs?: Partial<ChartOptions>;
  tasksTime?: Partial<ChartOptions>;
  tasksStatus?: Partial<ChartOptions>;
  membersProjects?: Partial<ChartOptions>;
  membersProgress?: {
    series: string[];
    labels: string[];
    title: {
      text: string;
      align: string;
      margin: number;
      style: { fontSize: string };
    };
  };
  projects: ProjectInterface[] = [];

  private readonly _reportsService: ReportsService = inject(ReportsService);
  private readonly _projectService: ProjectsService = inject(ProjectsService);
  private readonly _authService: AuthService = inject(AuthService);

  onTabChange(tab: MatTabChangeEvent) {
    this.selectedTabIndex = tab.index;
    this.selectedTab = tab.tab.textLabel;
    this.dateRange.patchValue({
      start: new Date('2024-01-01'),
      end: new Date('2024-12-31')
    });
  }

  ngOnInit(): void {
    this._getProjectsReports();
    this._getTasksReports();
    this._getProjectsByUser();
  }

  onSearch(type: string): void {
    if (type === 'projects') {
      this._getProjectsReports();
    } else if (type === 'tasks') {
      this._getTasksReports();
    } else if (type === 'members') {
      this._getMembersProgressByProject();
    }
  }

  cleanReports(type: string): void {
    if (type === 'projects') {
      this.projectsTime = undefined;
      this.projectVs = undefined;
    } else if (type === 'tasks') {
      this.tasksStatus = undefined;
      this.tasksTime = undefined;
    } else if (type === 'members') {
      this.membersProjects = undefined;
      this.membersProgress = undefined;
    }
  }

  private _getProjectsReports(): void {
    this.isLoadingProjects = true;
    this.cleanReports('projects');

    const { start, end } = this.dateRange.value;
    const timeReport$ = this._reportsService.getProjectsTimeReport({
      startDate: start.toDateString(),
      endDate: end.toDateString()
    });

    const projectVsReport$ = this._reportsService.getProjectVsReport();

    forkJoin({
      timeReport: timeReport$,
      projectVsReport: projectVsReport$
    }).subscribe({
      next: (res) => {
        if (res.timeReport?.time) {
          this.projectsTime = res.timeReport.time as Partial<ChartOptions>;
        }
        if (res.projectVsReport?.vs) {
          this.projectVs = res.projectVsReport.vs as Partial<ChartOptions>;
        }
      },
      error: (err) => {
        console.error('Error obteniendo reportes', err);
      },
      complete: () => {
        this.isLoadingProjects = false;
      }
    });
  }

  private _getTasksReports(): void {
    this.isLoadingTaks = true;
    this.cleanReports('tasks');
    const { start, end } = this.dateRange.value;
    const timeReport$ = this._reportsService.getTasksTimeReport({
      startDate: start.toDateString(),
      endDate: end.toDateString()
    });
    const projectVsReport$ = this._reportsService.getTasksByStatusReport();
    forkJoin({
      timeReport: timeReport$,
      projectVsReport: projectVsReport$
    }).subscribe({
      next: (res) => {
        if (res.timeReport?.time) {
          this.tasksTime = res.timeReport.time as Partial<ChartOptions>;
        }
        if (res.projectVsReport?.status) {
          this.tasksStatus = res.projectVsReport
            .status as Partial<ChartOptions>;
        }
      },
      error: (err) => {
        console.error('Error obteniendo reportes', err);
      },
      complete: () => {
        this.isLoadingTaks = false;
      }
    });
  }

  private _getMembersReports(): void {
    this.cleanReports('members');
    this._reportsService.getMembersByProjectReport().subscribe({
      next: (res) => {
        if (res && res.byProject) {
          this.membersProjects = res.byProject as Partial<ChartOptions>;
        }
      },
      error: (err) => {
        console.error('Error obteniendo reportes', err);
      }
    });
    this._reportsService
      .getMembersProgressReport(this.projectControl.value)
      .subscribe({
        next: (res) => {
          if (res && res.percentAdvance) {
            this.membersProgress = res.percentAdvance;
          }
        },
        error: (err) => {
          console.error('Error obteniendo reportes', err);
        }
      });
  }

  private _getMembersProgressByProject(): void {
    this.isLoadingMembers = true;
    this.membersProgress = undefined;
    this._reportsService
      .getMembersProgressReport(this.projectControl.value)
      .pipe(finalize(() => (this.isLoadingMembers = false)))
      .subscribe({
        next: (res) => {
          if (res && res.percentAdvance) {
            this.membersProgress = res.percentAdvance;
          }
        },
        error: (err) => {
          console.error('Error obteniendo reportes', err);
        }
      });
  }

  private _getProjectsByUser(): void {
    const userId: string = this._authService.getUserLoggedIn()?.id || '';
    if (userId) {
      this._projectService.getProjectsByUser().subscribe({
        next: (res) => {
          this.projects = res.data.filter((project) =>
            project.members?.some(
              (member) =>
                member.user.id === userId &&
                member.projectRole.roleName === 'Líder'
            )
          );
          this.projectControl.patchValue(this.projects[0].id);
          this._getMembersReports();
        },
        error: (err) => {
          console.error('Error obteniendo proyectos', err);
        }
      });
    }
  }
}
