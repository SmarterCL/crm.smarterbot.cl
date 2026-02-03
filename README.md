# SmarterOS CRM Hub

Este es el proyecto CRM para SmarterOS, construido con Next.js y Supabase.

## Despliegue Local

1.  **Instalar dependencias**:
    ```bash
    pnpm install
    ```

2.  **Configurar Variables de Entorno**:
    Asegúrate de tener un archivo `.env.local` con las claves de Supabase.

3.  **Iniciar Servidor de Desarrollo**:
    ```bash
    pnpm dev
    ```

4.  **Poblar Base de Datos** (Opcional):
    Visita `http://localhost:3000/seed-database` para crear datos de ejemplo.

5.  **Migraciones**:
    Las nuevas migraciones se encuentran en `supabase/migrations/`. La migración `20260203000000_fix_clients_table.sql` corrige columnas faltantes en la tabla de clientes.

## Características
- Gestión de Clientes (con seguimiento de última interacción y estados).
- Dashboard de Estadísticas.
- Integración de Mensajes de WhatsApp.
- Calendario de Eventos.

## Solución de Problemas
- **Errores de Tablas Faltantes**: Si ves errores en la consola sobre tablas que no existen, usa el sistema de siembra o aplica las migraciones pendientes en tu dashboard de Supabase.
- **Hidratación**: Se han aplicado parches para evitar avisos de desajuste de hidratación en temas oscuros/claros.
