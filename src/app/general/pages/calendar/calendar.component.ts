import { Component, inject, OnInit } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { BasePageComponent } from '../../../shared/components/base-page/base-page.component';
import { TasksService } from '../../services/tasks.service';
import { Router } from '@angular/router';
import { TasksInterface } from '../../interfaces/tasks.interface';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [FullCalendarModule, BasePageComponent],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements OnInit {
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    eventClick: (arg) => this.handleDateClick(arg),
    locale: ['es'],
    initialView: 'dayGridMonth',
    weekends: false,
    events: []
  };
  tasks: TasksInterface[] = [];

  private readonly _tasksService: TasksService = inject(TasksService);
  private readonly _router: Router = inject(Router);

  ngOnInit(): void {
    this._getTasksToCalendar();
  }

  private _getTasksToCalendar(): void {
    this._tasksService.getTasksToCalendar().subscribe((res) => {
      this.calendarOptions.events = res.data.map((task) => {
        this.tasks = res.data || [];
        return {
          title: task.title,
          backgroundColor: this._getBackgroudColor(task.deadline),
          start: task.deadline,
          id: task.id.toString()
        };
      });
    });
  }

  private _getBackgroudColor(date: Date): string {
    const currentDate = new Date();
    const taskDate = new Date(date);
    const diff = taskDate.getTime() - currentDate.getTime();
    const days = Math.ceil(diff / (1000 * 3600 * 24));
    if (days < 0) {
      return 'red';
    } else if (days === 0) {
      return 'yellow';
    } else {
      return 'green';
    }
  }

  private _goToTask(taskId: number, projectId: number): void {
    this._router.navigate(['/general/projects', projectId], {
      queryParams: { taskId, previusUrl: '../../calendar' }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleDateClick(arg: any): void {
    const projectId = this.tasks.find(
      (task) => task.id === Number(arg.event.id)
    )?.projectid;
    this._goToTask(Number(arg.event.id), Number(projectId));
  }
}
