import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SearchResult } from '../../interfaces/search.interface';
import { BaseCardComponent } from '../base-card/base-card.component';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { PaginationInterface } from '../../interfaces/pagination.interface';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EmptyPanelComponent } from '../empty-panel/empty-panel.component';
import { TruncatePipe } from '../../pipes/truncate.pipe';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [
    BaseCardComponent,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    MatTooltipModule,
    EmptyPanelComponent,
    TruncatePipe,
    DatePipe
  ],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.scss'
})
export class SearchResultsComponent {
  @Input() results: SearchResult[] = [];
  @Input() IsMinicard: boolean = false;
  @Input() redirectionCards: boolean = false;
  @Input() toolTipMessage: string = '';
  @Input() paginationParams: PaginationInterface = {
    page: 0,
    perPage: 10,
    total: 0,
    pageCount: 1,
    hasPreviousPage: false,
    hasNextPage: false
  };

  @Input() withPagination: boolean = false;

  @Output() chagePagination: EventEmitter<PageEvent> = new EventEmitter();

  onPageChange(event: PageEvent) {
    this.chagePagination.emit(event);
  }
}
