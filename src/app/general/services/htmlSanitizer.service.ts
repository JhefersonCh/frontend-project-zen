import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HtmlSanitizerService {
  private sanitizedContentCache = new WeakMap<object, SafeHtml>();

  constructor(private sanitizer: DomSanitizer) {}

  sanitizeContent(content: string, context: object): SafeHtml {
    const cached = this.sanitizedContentCache.get(context);
    if (cached) {
      return cached;
    }

    const doc = new DOMParser().parseFromString(content, 'text/html');

    const iframes = doc.getElementsByTagName('iframe');
    Array.from(iframes).forEach((iframe) => {
      const src = iframe.getAttribute('src');
      if (src) {
        const safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(src);
        const safeUrl = safeSrc.toString();
        iframe.setAttribute(
          'src',
          safeUrl.substring(safeUrl.indexOf('url(') + 4, safeUrl.length - 1)
        );
      }
    });

    const sanitizedContent = this.sanitizer.bypassSecurityTrustHtml(content);

    this.sanitizedContentCache.set(context, sanitizedContent);

    return sanitizedContent;
  }
}
