import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CommentsInterface } from '../../interfaces/comments.interface';
import { CommentsService } from '../../services/comments.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatTooltipModule
  ],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss'
})
export class CommentsComponent implements OnInit {
  @Input() rowId!: number;
  @Input() rowTable!: string;
  @Input() userLoggedId!: string;
  comments: CommentsInterface[] = [];
  commentForm: FormGroup;
  @Output() panelExpanded: EventEmitter<boolean> = new EventEmitter<boolean>();
  private readonly _commentsService: CommentsService = inject(CommentsService);

  constructor(private fb: FormBuilder) {
    this.commentForm = this.fb.group({
      content: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  ngOnInit() {
    this.loadComments();
  }

  loadComments() {
    if (this.rowId && this.rowTable) {
      this._commentsService
        .getComments(this.rowId.toString(), this.rowTable)
        .subscribe({
          next: (res) => {
            this.comments = res.data || [];
          }
        });
    }
  }

  addComment() {
    if (this.commentForm.valid) {
      const newComment = {
        content: this.commentForm.get('content')?.value,
        rowId: this.rowId,
        rowTable: this.rowTable
      };

      this._commentsService.addComment(newComment).subscribe({
        next: () => {
          this.commentForm.reset();
          this.loadComments();
        }
      });
    }
  }

  deleteComment(commentId: number) {
    this._commentsService.deleteComment(commentId).subscribe({
      next: () => {
        this.loadComments();
      }
    });
  }
}
