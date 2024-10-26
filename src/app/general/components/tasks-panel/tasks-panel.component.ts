/* eslint-disable @typescript-eslint/no-explicit-any */
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ArrayInlineFormaterPipe } from '../../../shared/pipes/array-inline-formater.pipe';
import { BaseCardComponent } from '../../../shared/components/base-card/base-card.component';
import { TasksInterface } from '../../interfaces/tasks.interface';

@Component({
  selector: 'app-tasks-panel',
  standalone: true,
  imports: [ArrayInlineFormaterPipe, DragDropModule, BaseCardComponent],
  templateUrl: './tasks-panel.component.html',
  styleUrl: './tasks-panel.component.scss'
})
export class TasksPanelComponent {
  @Input() status!: string;
  @Input() tasksList!: TasksInterface[];
  @Input() dropListConnectedTo!: string[];
  @Input() isMobile: boolean = false;
  @Input() listTag: string = '';
  @Output() dropEvent = new EventEmitter<CdkDragDrop<any>>();

  onDrop(event: CdkDragDrop<any>) {
    this.dropEvent.emit(event);
  }
}
