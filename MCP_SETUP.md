# Configuración del Servidor MCP

Para habilitar la conexión con Claude Desktop u otros clientes MCP, sigue estos pasos:

## 1. Requisitos Previos

Asegúrate de tener instaladas las dependencias del proyecto y la versión correcta de Node.js (>=24.0.0).

```bash
pnpm install
```

## 2. Configurar Claude Desktop

Edita el archivo de configuración de Claude Desktop.

**MacOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

Añade la siguiente configuración:

```json
{
  "mcpServers": {
    "smarterbot-crm": {
      "command": "pnpm",
      "args": [
        "mcp"
      ],
      "cwd": "/Users/mac/dev/2026/crm.smarterbot.cl",
      "env": {
        "NODE_ENV": "development"
      }
    }
  }
}
```

> **Nota**: Reemplaza `/Users/mac/dev/2026/crm.smarterbot.cl` con la ruta absoluta real a tu proyecto si es diferente.

## 3. Verificar Conexión

1. Reinicia Claude Desktop completamente.
2. Deberías ver un icono de conexión (enchufe) activo.
3. Puedes probar las herramientas disponibles preguntando: "¿Qué herramientas tienes disponibles para el CRM?"

## Solución de Problemas常见

- **Error de conexión**: Verifica que el servidor MCP se inicie correctamente ejecutando `pnpm mcp` en tu terminal.
- **Variables de entorno falantes**: Asegúrate de tener el archivo `.env.local` configurado con las credenciales de Supabase y otras variables necesarias.
- **Errores de Node**: Si ves errores de versión de Node, asegúrate de estar usando la versión correcta (v24+).
