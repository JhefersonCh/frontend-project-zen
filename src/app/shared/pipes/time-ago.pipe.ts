import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
  standalone: true
})
export class TimeAgoPipe implements PipeTransform {
  transform(date: Date | string, mode: 'ago' | 'left' = 'ago'): string {
    const now = new Date();
    const targetDate = new Date(date);
    const diffMs = targetDate.getTime() - now.getTime();

    const isPast = diffMs < 0;
    const diff = Math.abs(diffMs);

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    if (mode === 'ago' && isPast) {
      return this.formatTimeAgo(years, months, days, hours, minutes, seconds);
    } else if (mode === 'left' && !isPast) {
      return this.formatTimeLeft(years, months, days, hours, minutes, seconds);
    } else {
      return 'La fecha ya pasó';
    }
  }

  private formatTimeAgo(
    years: number,
    months: number,
    days: number,
    hours: number,
    minutes: number,
    seconds: number
  ): string {
    if (years > 0) return `${years} año${years > 1 ? 's' : ''} atrás`;
    if (months > 0) return `${months} mes${months > 1 ? 'es' : ''} atrás`;
    if (days > 0) return `${days} día${days > 1 ? 's' : ''} atrás`;
    if (hours > 0) return `${hours} hora${hours > 1 ? 's' : ''} atrás`;
    if (minutes > 0) return `${minutes} minuto${minutes > 1 ? 's' : ''} atrás`;
    return `${seconds} segundo${seconds > 1 ? 's' : ''} atrás`;
  }

  private formatTimeLeft(
    years: number,
    months: number,
    days: number,
    hours: number,
    minutes: number,
    seconds: number
  ): string {
    if (years > 0)
      return `Falta${years > 1 ? 'n' : ''} ${years} año${years > 1 ? 's' : ''}`;
    if (months > 0)
      return `Falta${months > 1 ? 'n' : ''} ${months} mes${months > 1 ? 'es' : ''}`;
    if (days > 0)
      return `Falta${days > 1 ? 'n' : ''} ${days} día${days > 1 ? 's' : ''}`;
    if (hours > 0)
      return `Falta${hours > 1 ? 'n' : ''} ${hours} hora${hours > 1 ? 's' : ''}`;
    if (minutes > 0)
      return `Falta${minutes > 1 ? 'n' : ''} ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    return `Falta${seconds > 1 ? 'n' : ''} ${seconds} segundo${seconds > 1 ? 's' : ''}`;
  }
}
