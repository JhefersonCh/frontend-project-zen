# 📋 Frontend - ProjectZen - Gestión de Proyectos Grupales

[**Visita el sitio**](https://project-zen.netlify.app/home)

**ProjectZen** es una plataforma de gestión de proyectos grupales diseñada para facilitar la colaboración, el seguimiento de tareas y la administración de proyectos de manera eficiente. Permite a los usuarios crear proyectos, asignar tareas, gestionar roles y obtener reportes detallados del progreso de los proyectos.

## 🧱 Tecnologías utilizadas

- 🚀 **[Angular](https://angular.io/)**: Framework utilizado para desarrollar la interfaz dinámica y modular del frontend.
- 🎨 **[Bootstrap](https://getbootstrap.com/)**: Bootstrap es un framework multiplataforma o conjunto de herramientas de código abierto para diseño de sitios y aplicaciones web.
- 🧑‍💻 **[Drag and Drop](https://angular.io/guide/drag-drop)**: Implementación de un sistema Kanban utilizando la funcionalidad de drag and drop.
- ✉️ **[Nodemailer](https://nodemailer.com/)**: Utilizado para el envío de correos de notificaciones, tareas pendientes, recuperación de contraseña, etc.
- 📅 **[FullCalendar](https://fullcalendar.io/)**: Para visualizar las tareas pendientes en un calendario interactivo.
  
## ✨ Funcionalidades principales

- 📋 **Gestión de Proyectos**: Creación de proyectos grupales donde se pueden asignar miembros y definir roles.
  - Roles disponibles: **Creador**, **Moderador**, **Miembro**.
- 📝 **Gestión de Tareas**: Cada tarea tiene un estado, prioridad, contenido y título. Las tareas pueden ser movidas en un sistema **Kanban** o actualizadas a través de un formulario.
- 📊 **Reportes**: Visualización de reportes de tareas por persona o grupo, mostrando quién ha completado más tareas y quién tiene tareas pendientes.
- 📅 **Calendario de Tareas**: Visualización de tareas en un calendario para tener un mejor seguimiento de las fechas de vencimiento.
- 🔒 **Autenticación**: Los usuarios pueden crear cuentas, iniciar sesión y gestionar su perfil.
- ⚙️ **Panel Administrativo**: Los administradores pueden gestionar usuarios, tareas, proyectos y más.
- 📧 **Notificaciones por Correo**:
  - Avisos de tareas vencidas o pendientes.
  - PQRs (Preguntas, Quejas y Reclamos).
  - Recuperación de contraseña.

## 🛠️ Instalación y ejecución local

1. Clona el repositorio:
   ```bash
   git clone https://github.com/JhefersonCh/frontend-project-zen.git
   cd frontend-project-zen
   
2. Instala las dependencias:
   ```bash
   npm install

3. Inicia el servidor de desarrollo:
   ```bash
   ng s
