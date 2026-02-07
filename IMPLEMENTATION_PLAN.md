# Plan de Implementación: Arquitectura Smarter Platform

Este documento detalla el plan de acción para implementar la arquitectura "Smarter Platform" basada en el resumen ejecutivo del 7 de febrero de 2026.

## 1. Visión General

El objetivo es unificar la autenticación entre subdominios, crear un orquestador central ("El Conductor") y conectar todo a través de Google Cloud App Hub.

**Componentes Clave:**
- **Frontend (CRM)**: Next.js (este repositorio).
- **Backend ("Conductor")**: FastAPI (Orquestador de eventos y lógica de negocio compleja).
- **Base de Datos/Auth**: Supabase (Docker/Cloud).
- **Chat**: Chatwoot (smarterbot.cl).
- **Infraestructura**: Google Cloud App Hub.

## 2. Fase 1: Autenticación Unificada (SSO)

### Objetivo
Permitir que los usuarios naveguen entre `crm.smarterbot.cl`, `rut.smarterbot.cl`, etc., sin volver a iniciar sesión.

### Pasos de Implementación
1.  **Configuración de Cookie en Supabase:**
    -   Configurar el cliente de Supabase para usar `Cookie Options` con `domain: '.smarterbot.cl'` (o el dominio raíz correspondiente).
    -   Esto debe hacerse tanto en el cliente (`src/lib/supabase-client.ts`) como en el servidor (`src/lib/supabase-server.ts`).

2.  **Ajuste de Flujo de Registro:**
    -   Deshabilitar "Confirmar Email" en la configuración de Supabase Auth (Dashboard -> Authentication -> Providers -> Email).
    -   Actualizar la página de registro (`src/app/register/page.tsx`) para redirigir directamente al dashboard tras el registro exitoso (sin esperar verificación).

## 3. Fase 2: "El Conductor" (FastAPI Backend)

### Objetivo
Crear el servicio backend que orquesta la creación de perfiles y la lógica entre servicios.

### Pasos de Implementación
1.  **Estructura del Proyecto:**
    -   Crear un directorio `backend/` en la raíz (o un repositorio separado) para el proyecto FastAPI.
    -   Inicializar proyecto con `uvicorn`, `fastapi`, `supabase`.

2.  **Webhook de Supabase (User Signup):**
    -   Crear endpoint en FastAPI: `POST /webhooks/auth/signup`.
    -   Configurar Supabase para disparar este webhook cuando se crea un usuario en `auth.users`.
    -   **Lógica**:
        -   Recibir evento de nuevo usuario.
        -   Crear entrada en tabla `public.profiles` (si no existe).
        -   Inicializar configuración predeterminada del usuario.

## 4. Fase 3: Integración con Chatwoot (HMAC)

### Objetivo
Autenticar automáticamente a los usuarios del CRM en el widget de soporte de Chatwoot sin login adicional.

### Pasos de Implementación
1.  **Generación de HMAC (Backend):**
    -   En el "Conductor" (o API Route de Next.js si se prefiere temporalmente), crear un endpoint: `GET /api/chat/auth`.
    -   Este endpoint debe validar la sesión de Supabase del usuario.
    -   Generar un HMAC SHA256 usando el `CHATWOOT_ACCESS_TOKEN` (o clave de firma) y el `email` del usuario.

2.  **Frontend (Next.js):**
    -   Crear un componente `ChatwootWidget.tsx`.
    -   Al cargar, llamar a `GET /api/chat/auth` para obtener el HMAC.
    -   Inicializar el widget de Chatwoot pasando el `user_hash` (HMAC) y los datos del usuario.

## 5. Fase 4: Google Cloud App Hub & Despliegue

### Objetivo
Registrar y visualizar la arquitectura en Google Cloud.

### Pasos de Implementación
1.  **Pre-requisitos Cloud:**
    -   Verificar activación de `Cloud Asset API`.
    -   Asegurar que el proyecto `smarterbot-jwjq` tiene acceso a los recursos desplegados.

2.  **Registro en App Hub:**
    -   Registrar el servicio "CRM" (este Next.js app) como un *Service* en App Hub.
    -   Registrar "Conductor" como otro *Service*.
    -   Agruparlos bajo la Aplicación Lógica `smarter-platform-core`.

## 6. Próximos Pasos Inmediatos (Action Items)

- [ ] Modificar `src/lib/supabase-server.ts` y `client` para soportar cookies compartidas.
- [ ] Crear estructura básica del Backend FastAPI (o decidir usar Next.js API Routes para la v1).
- [ ] Implementar endpoint de HMAC para Chatwoot.
