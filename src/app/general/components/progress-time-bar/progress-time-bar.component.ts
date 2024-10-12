import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-progress-time-bar',
  standalone: true,
  imports: [MatProgressBarModule, MatTooltipModule],
  templateUrl: './progress-time-bar.component.html',
  styleUrls: ['./progress-time-bar.component.scss']
})
export class ProgressTimeBarComponent implements OnInit, OnDestroy {
  @Input() endDate!: Date | string;
  @Input() startDate: Date | string = new Date();
  daysRemaining: number = 0;
  totalDays: number = 0;
  progress: number = 0; // Progreso en porcentaje
  private intervalSub!: Subscription;

  ngOnInit() {
    this.startProgress();
  }

  startProgress() {
    if (typeof this.endDate === 'string') {
      this.endDate = new Date(this.endDate);
    }
    if (typeof this.startDate === 'string') {
      this.startDate = new Date(this.startDate);
    }

    const totalDurationMs =
      (this.endDate as Date).getTime() - (this.startDate as Date).getTime();
    this.totalDays = Math.ceil(totalDurationMs / (1000 * 60 * 60 * 24));

    const interval$ = interval(1000);

    this.intervalSub = interval$.subscribe(() => {
      const currentTime = new Date().getTime();
      const timeElapsedMs = currentTime - (this.startDate as Date).getTime();
      const timeRemainingMs = (this.endDate as Date).getTime() - currentTime;

      this.daysRemaining = Math.ceil(timeRemainingMs / (1000 * 60 * 60 * 24));

      this.progress = (timeElapsedMs / totalDurationMs) * 100;

      if (this.progress >= 100 || this.daysRemaining <= 0) {
        this.progress = 100;
        this.daysRemaining = 0;
        this.intervalSub.unsubscribe();
      }
    });
  }

  ngOnDestroy() {
    if (this.intervalSub) {
      this.intervalSub.unsubscribe();
    }
  }
}
