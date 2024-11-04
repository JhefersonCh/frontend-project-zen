import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TranslationsService {
  traductions: Record<string, string> = {
    identificationTypes: 'Tipos de identificación',
    categories: 'Categorías',
    tags: 'Etiquetas',
    stauses: 'Estados',
    projectRoles: 'Roles de proyecto',
    title: 'Título',
    description: 'Descripción',
    priorities: 'Prioridades',
    type: 'Tipo',
    code: 'Código',
    roleName: 'Nombre del rol'
  };
  getTranslation(key: string): string {
    return this.traductions[key] || key;
  }
}
