# 📋 Checklist de Producción - SmarterBot CRM

## ✅ Acciones Inmediatas (Bloquean Producción)

### 1. Build Configuration
- [x] **Remover `ignoreBuildErrors: true`** - Protección contra errores en runtime
- [x] **Headers de seguridad implementados** - CSP, HSTS, XSS Protection, Frame Options
- [x] **CORS configurado** - Solo dominios permitidos

### 2. API Security
- [x] **Endpoint `/api/seed` protegido** - Token authentication + rate limiting
- [x] **Proxy Chatwoot con allowlist** - Validación de rutas y métodos permitidos
- [x] **Rate limiting por categorías** - Auth: 30/min, API: 100/min, Seed: 5/min
- [x] **Validación de entrada** - Sanitización de parámetros y headers

### 3. Environment Security
- [x] **Validación centralizada de variables** - Schema Zod strict
- [x] **Tokens internos validados** - `SEED_API_TOKEN` opcional en dev
- [x] **Separación de scopes** - Service role vs anon keys

## 🚀 Actualización a Node 22x

### Motores de Ejecución
```json
{
  "engines": {
    "node": ">=20.11.0",
    "npm": ">=10.0.0", 
    "pnpm": ">=8.15.0"
  },
  "volta": {
    "node": "22.11.0",
    "npm": "10.9.0",
    "pnpm": "9.15.4"
  }
}
```

### Scripts de Calidad
- `typecheck` - Validación estricta de TypeScript
- `typecheck:strict` - Modo ultra-estricto
- `lint:fix` - Corrección automática de ESLint
- `security-check` - Auditoría de dependencias
- `build:production` - Pipeline completo de calidad

## 🔒 Seguridad Mínima Obligatoria

### Headers Implementados
```http
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Strict-Transport-Security: max-age=31536000 (prod)
Content-Security-Policy: default-src 'self'...
```

### Rate Limiting
- **API default**: 100 req/min
- **Auth endpoints**: 30 req/min  
- **Seed endpoint**: 5 req/min
- **Chatwoot proxy**: 60 req/min

### Input Validation
- **Path sanitization** - Prevención de directory traversal
- **Query parameter filtering** - Solo params permitidos
- **Header sanitization** - Remoción de caracteres peligrosos
- **Body size limits** - Máximo 1MB por request

## 🛡️ Protección Contra Ataques

### SSRF Prevention
- **Allowlist de endpoints Chatwoot** - Solo rutas explícitamente permitidas
- **Validación de patrones peligrosos** - `..`, `<script>`, `javascript:`
- **Timeout de requests** - 30 segundos máximo
- **No redirects automáticos** - `redirect: 'manual'`

### Bot Detection
- **User-Agent filtering** - Bloqueo de crawlers sospechosos en APIs
- **IP-based rate limiting** - Identificación por IP + User-Agent hash
- **Request pattern analysis** - Detección de automatización maliciosa

## 📝 Flujo de Deploy a Producción

### Pre-deploy Checklist
```bash
# 1. Validación completa
npm run build:production

# 2. Auditoría de seguridad
npm run security-check

# 3. Tests (si existen)
npm test

# 4. Build optimizado
npm run build
```

### Environment Variables Requeridas
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Chatwoot
CHATWOOT_API_URL=
CHATWOOT_ACCOUNT_ID=
CHATWOOT_ACCESS_TOKEN=

# Seguridad
SEED_API_TOKEN= (opcional en dev)
NODE_ENV=production
RATE_LIMIT_REQUESTS_PER_MINUTE=100
```

## 🚨 Response Headers de Seguridad

Todas las respuestas incluyen:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200000
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

## 🔄 Maintenance

### Cleanup Automático
- **Rate limit store** - Limpieza cada 5 minutos
- **Log rotation** - Errores con timestamps y contexto
- **Memory management** - Evita leaks en rate limiting

### Monitoring
- **Errores 429** - Rate limit exceeded
- **Errores 403** - Rutas bloqueadas por seguridad
- **Errores 500** - Internal server errors con stack trace

## 📊 Métricas de Seguridad

### Tiempo Real
- Requests por IP/minuto
- Patrones sospechosos bloqueados
- Rate limits activados
- Errores de autenticación

### Alerts Configurados
- Más de 10 bloqueos por IP en 5 min
- Rate limit 429 responses > 1% del tráfico
- Errores 500 en endpoints críticos

---

## ✅ Status: PRODUCTION READY

Este stack ahora cumple con estándares de seguridad empresarial:
- **Zero Trust Architecture** - Validación en cada capa
- **Defense in Depth** - Múltiples controles de seguridad
- **Fail Secure** - Negar por defecto, permitir explícitamente
- **Attack Surface Reduction** - Mínima exposición de endpoints

**Nota:** Requiere `SEED_API_TOKEN` en producción para acceso al endpoint de seed.