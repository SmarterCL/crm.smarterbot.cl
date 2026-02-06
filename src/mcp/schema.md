# MCP Server Schema - SmarterBOT v0.1

## Core Definition

SmarterBOT MCP Server expone el contrato cognitivo del sistema CRM, permitiendo que modelos de lenguaje interactúen con servicios reales de forma segura y controlada.

## Tools (Acciones Disponibles)

### CRM Tools
```json
{
  "crm.create_lead": {
    "description": "Crea un nuevo lead en el sistema CRM",
    "parameters": {
      "type": "object",
      "properties": {
        "name": {"type": "string", "description": "Nombre completo del lead"},
        "email": {"type": "string", "format": "email", "description": "Email del lead"},
        "phone": {"type": "string", "description": "Teléfono del lead"},
        "source": {"type": "string", "enum": ["web", "whatsapp", "manual", "api"], "description": "Fuente del lead"},
        "notes": {"type": "string", "description": "Notas adicionales"},
        "assigned_to": {"type": "string", "description": "ID del agente asignado"}
      },
      "required": ["name", "email"]
    }
  },
  
  "crm.get_customer": {
    "description": "Obtiene información de un cliente existente",
    "parameters": {
      "type": "object", 
      "properties": {
        "customer_id": {"type": "string", "description": "ID único del cliente"},
        "include_conversations": {"type": "boolean", "default": false}
      },
      "required": ["customer_id"]
    }
  },
  
  "crm.update_customer": {
    "description": "Actualiza información de un cliente",
    "parameters": {
      "type": "object",
      "properties": {
        "customer_id": {"type": "string"},
        "updates": {
          "type": "object",
          "properties": {
            "name": {"type": "string"},
            "email": {"type": "string", "format": "email"},
            "phone": {"type": "string"},
            "status": {"type": "string", "enum": ["active", "inactive", "pending"]}
          }
        }
      },
      "required": ["customer_id", "updates"]
    }
  }
}
```

### Communication Tools
```json
{
  "chat.send_message": {
    "description": "Envía un mensaje a través del canal especificado",
    "parameters": {
      "type": "object",
      "properties": {
        "conversation_id": {"type": "string", "description": "ID de la conversación"},
        "message": {"type": "string", "description": "Contenido del mensaje"},
        "channel": {"type": "string", "enum": ["whatsapp", "webchat", "email"], "description": "Canal de envío"},
        "template_id": {"type": "string", "description": "ID de plantilla (opcional)"}
      },
      "required": ["conversation_id", "message", "channel"]
    }
  },
  
  "chat.get_conversations": {
    "description": "Obtiene lista de conversaciones con filtros",
    "parameters": {
      "type": "object",
      "properties": {
        "status": {"type": "string", "enum": ["open", "resolved", "pending"]},
        "channel": {"type": "string", "enum": ["whatsapp", "webchat"]},
        "assigned_to": {"type": "string"},
        "limit": {"type": "integer", "default": 50}
      }
    }
  }
}
```

### Payment Tools  
```json
{
  "payments.create_intent": {
    "description": "Crea una intención de pago para un cliente",
    "parameters": {
      "type": "object",
      "properties": {
        "customer_id": {"type": "string"},
        "amount": {"type": "number", "minimum": 0},
        "currency": {"type": "string", "default": "CLP"},
        "description": {"type": "string", "description": "Descripción del pago"},
        "metadata": {"type": "object", "description": "Metadatos adicionales"}
      },
      "required": ["customer_id", "amount", "description"]
    }
  },
  
  "payments.get_status": {
    "description": "Consulta el estado de un pago",
    "parameters": {
      "type": "object",
      "properties": {
        "payment_id": {"type": "string"},
        "customer_id": {"type": "string"}
      },
      "required": ["payment_id"]
    }
  }
}
```

## Resources (Estado y Datos)

### Customer Resources
```json
{
  "customer://profile/{customer_id}": {
    "description": "Perfil completo del cliente",
    "content_type": "application/json"
  },
  
  "customer://conversations/{customer_id}": {
    "description": "Historial de conversaciones del cliente",
    "content_type": "application/json"
  },
  
  "customer://payments/{customer_id}": {
    "description": "Historial de pagos del cliente",
    "content_type": "application/json"
  }
}
```

### System Resources
```json
{
  "system://health": {
    "description": "Estado general del sistema",
    "content_type": "application/json"
  },
  
  "system://metrics": {
    "description": "Métricas de uso del CRM",
    "content_type": "application/json"
  },
  
  "tenant://config/{tenant_id}": {
    "description": "Configuración específica del tenant",
    "content_type": "application/json"
  }
}
```

## Prompts (Roles y Contextos)

### Bot Roles
```json
{
  "sales_assistant": {
    "description": "Asistente de ventas especializado en lead generation",
    "system_prompt": "Eres un asistente de ventas experto. Tu objetivo es crear y calificar leads de manera eficiente. Siempre valida la información del contacto antes de crear un lead nuevo.",
    "allowed_tools": ["crm.create_lead", "crm.get_customer", "chat.send_message"],
    "restricted_resources": ["payments::*", "system://metrics"],
    "rate_limit": {"requests_per_minute": 30}
  },
  
  "support_agent": {
    "description": "Agente de soporte técnico y de atención al cliente", 
    "system_prompt": "Eres un agente de soporte profesional. Tu prioridad es resolver problemas de clientes existentes. Tienes acceso de solo lectura a información de pagos.",
    "allowed_tools": ["crm.get_customer", "chat.send_message", "chat.get_conversations", "payments.get_status"],
    "restricted_resources": ["payments://create_*", "system://*"],
    "rate_limit": {"requests_per_minute": 20}
  },
  
  "admin_bot": {
    "description": "Bot administrador con acceso completo y logging",
    "system_prompt": "Eres un administrador del sistema con acceso completo. Todas tus acciones son auditadas. Actúa con precaución y siempre documenta el propósito de cada acción administrativa.",
    "allowed_tools": ["*"],
    "restricted_resources": [],
    "rate_limit": {"requests_per_minute": 10},
    "audit_required": true
  }
}
```

### Context Prompts
```json
{
  "lead_qualification": {
    "description": "Contexto para calificación de leads",
    "prompt_template": "Analizando lead: {name} ({email}). Calificar basado en: ingresos estimados, industria, nivel de interés, presupuesto. Asignar puntuación del 1-10."
  },
  
  "payment_followup": {
    "description": "Contexto para seguimiento de pagos",
    "prompt_template": "Cliente {customer_name} con pago pendiente de {amount}. Último contacto: {last_contact}. Generar mensaje amigable de seguimiento."
  }
}
```

## Validation Rules

### Security Constraints
```json
{
  "validation_rules": {
    "email_validation": "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
    "phone_validation": "^\\+?[1-9]\\d{1,14}$",
    "max_message_length": 1000,
    "max_amount_per_payment": 1000000,
    "rate_limit_per_ip": {"requests": 100, "window": "1m"}
  }
}
```

### Tenant Isolation
```json
{
  "tenant_rules": {
    "data_isolation": "Los datos de cada tenant están completamente aislados",
    "cross_tenant_access": "Prohibido excepto con rol admin",
    "resource_prefix": "tenant://{tenant_id}/"
  }
}
```

## Error Handling

```json
{
  "error_responses": {
    "invalid_tool": {"code": 4001, "message": "Tool no existe en el contrato MCP"},
    "permission_denied": {"code": 4003, "message": "Permisos insuficientes para esta acción"},
    "validation_failed": {"code": 4002, "message": "Parámetros inválidos"},
    "rate_limited": {"code": 4291, "message": "Límite de velocidad excedido"},
    "tenant_mismatch": {"code": 4004, "message": "Datos de tenant inválidos"}
  }
}
```