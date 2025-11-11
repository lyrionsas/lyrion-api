# Ejemplos de Respuestas de la API

## 📌 Casos de Éxito

### ✅ POST /bank-accounts - Crear Cuenta (201 Created)
**Request:**
```json
{
  "bankName": "Bancolombia",
  "accountType": "Ahorros",
  "accountNumber": "1234567890",
  "accountHolderName": "Juan Pérez García",
  "typeDocumentHolder": "Cédula de Ciudadanía",
  "accountHolderDocument": "1234567890"
}
```

**Response:**
```json
{
  "id": 1,
  "bankName": "Bancolombia",
  "accountType": "Ahorros",
  "accountNumber": "1234567890",
  "accountHolderName": "Juan Pérez García",
  "typeDocumentHolder": "Cédula de Ciudadanía",
  "accountHolderDocument": "1234567890",
  "isActive": true,
  "createAt": "2025-10-27T10:30:00.000Z",
  "updateAt": "2025-10-27T10:30:00.000Z"
}
```

---

### ✅ GET /bank-accounts - Listar Cuentas (200 OK)
**Response:**
```json
[
  {
    "id": 1,
    "bankName": "Bancolombia",
    "accountType": "Ahorros",
    "accountNumber": "1234567890",
    "accountHolderName": "Juan Pérez García",
    "typeDocumentHolder": "Cédula de Ciudadanía",
    "accountHolderDocument": "1234567890",
    "isActive": true,
    "createAt": "2025-10-27T10:30:00.000Z",
    "updateAt": "2025-10-27T10:30:00.000Z"
  },
  {
    "id": 2,
    "bankName": "Nequi",
    "accountType": "Ahorros",
    "accountNumber": "3001234567",
    "accountHolderName": "María García López",
    "typeDocumentHolder": "Cédula de Ciudadanía",
    "accountHolderDocument": "9876543210",
    "isActive": true,
    "createAt": "2025-10-27T11:00:00.000Z",
    "updateAt": "2025-10-27T11:00:00.000Z"
  },
  {
    "id": 3,
    "bankName": "Davivienda",
    "accountType": "Corriente",
    "accountNumber": "0123456789",
    "accountHolderName": "Carlos Rodríguez",
    "typeDocumentHolder": "Cédula de Ciudadanía",
    "accountHolderDocument": "5555555555",
    "isActive": true,
    "createAt": "2025-10-27T11:30:00.000Z",
    "updateAt": "2025-10-27T11:30:00.000Z"
  }
]
```

---

### ✅ GET /bank-accounts/stats - Estadísticas (200 OK)
**Response:**
```json
{
  "total": 5,
  "byBank": {
    "Bancolombia": 2,
    "Nequi": 1,
    "Davivienda": 1,
    "BBVA Colombia": 1
  },
  "byType": {
    "Ahorros": 4,
    "Corriente": 1
  }
}
```

---

### ✅ GET /bank-accounts/:id - Obtener Una Cuenta (200 OK)
**Response:**
```json
{
  "id": 1,
  "bankName": "Bancolombia",
  "accountType": "Ahorros",
  "accountNumber": "1234567890",
  "accountHolderName": "Juan Pérez García",
  "typeDocumentHolder": "Cédula de Ciudadanía",
  "accountHolderDocument": "1234567890",
  "isActive": true,
  "createAt": "2025-10-27T10:30:00.000Z",
  "updateAt": "2025-10-27T10:30:00.000Z"
}
```

---

### ✅ PATCH /bank-accounts/:id - Actualizar Cuenta (200 OK)
**Request:**
```json
{
  "accountHolderName": "Juan Carlos Pérez García"
}
```

**Response:**
```json
{
  "id": 1,
  "bankName": "Bancolombia",
  "accountType": "Ahorros",
  "accountNumber": "1234567890",
  "accountHolderName": "Juan Carlos Pérez García",
  "typeDocumentHolder": "Cédula de Ciudadanía",
  "accountHolderDocument": "1234567890",
  "isActive": true,
  "createAt": "2025-10-27T10:30:00.000Z",
  "updateAt": "2025-10-27T15:45:00.000Z"
}
```
  "isActive": true,
  "createAt": "2025-10-27T10:30:00.000Z",
  "updateAt": "2025-10-27T15:45:00.000Z"
}
```

---

### ✅ DELETE /bank-accounts/:id - Eliminar Cuenta (200 OK)
**Response:**
```json
{
  "message": "Cuenta bancaria eliminada exitosamente"
}
```

---

## ❌ Casos de Error

### ❌ Número de Cuenta Duplicado (400 Bad Request)
**Request:**
```json
{
  "bankName": "Bancolombia",
  "accountType": "Ahorros",
  "accountNumber": "1234567890",  // Ya existe
  "accountHolderName": "Test User",
  "typeDocumentHolder": "Cédula de Ciudadanía",
  "accountHolderDocument": "1111111111"
}
```

**Response:**
```json
{
  "statusCode": 400,
  "message": "Ya tienes una cuenta bancaria registrada con este número",
  "error": "Bad Request"
}
```

---

### ❌ Número de Cuenta Muy Corto (400 Bad Request)
**Request:**
```json
{
  "bankName": "Bancolombia",
  "accountType": "Ahorros",
  "accountNumber": "12345",  // Solo 5 dígitos
  "accountHolderName": "Test User",
  "typeDocumentHolder": "Cédula de Ciudadanía",
  "accountHolderDocument": "1234567890"
}
```

**Response:**
```json
{
  "statusCode": 400,
  "message": [
    "El número de cuenta debe tener al menos 6 dígitos"
  ],
  "error": "Bad Request"
}
```

---

### ❌ Número de Cuenta con Letras (400 Bad Request)
**Request:**
```json
{
  "bankName": "Bancolombia",
  "accountType": "Ahorros",
  "accountNumber": "123ABC7890",  // Contiene letras
  "accountHolderName": "Test User",
  "typeDocumentHolder": "Cédula de Ciudadanía",
  "accountHolderDocument": "1234567890"
}
```

**Response:**
```json
{
  "statusCode": 400,
  "message": [
    "El número de cuenta solo debe contener dígitos numéricos"
  ],
  "error": "Bad Request"
}
```

---

### ❌ Longitud Incorrecta para Banco Específico (400 Bad Request)
**Request:**
```json
{
  "bankName": "Bancolombia",
  "accountType": "Ahorros",
  "accountNumber": "123456789",  // 9 dígitos (Bancolombia requiere 10-11)
  "accountHolderName": "Test User",
  "typeDocumentHolder": "Cédula de Ciudadanía",
  "accountHolderDocument": "1234567890"
}
```

**Response:**
```json
{
  "statusCode": 400,
  "message": "El número de cuenta para Bancolombia debe tener 10 o 11 dígitos",
  "error": "Bad Request"
}
```

---

### ❌ Tipo de Cuenta Inválido (400 Bad Request)
**Request:**
```json
{
  "bankName": "Bancolombia",
  "accountType": "Nómina",  // No es Ahorros ni Corriente
  "accountNumber": "1234567890",
  "accountHolderName": "Test User",
  "typeDocumentHolder": "Cédula de Ciudadanía",
  "accountHolderDocument": "1234567890"
}
```

**Response:**
```json
{
  "statusCode": 400,
  "message": [
    "El tipo de cuenta debe ser Ahorros o Corriente"
  ],
  "error": "Bad Request"
}
```

---

### ❌ Banco No Soportado (400 Bad Request)
**Request:**
```json
{
  "bankName": "Banco Internacional",  // No está en la lista
  "accountType": "Ahorros",
  "accountNumber": "1234567890",
  "accountHolderName": "Test User",
  "typeDocumentHolder": "Cédula de Ciudadanía",
  "accountHolderDocument": "1234567890"
}
```

**Response:**
```json
{
  "statusCode": 400,
  "message": [
    "El banco debe ser uno de los bancos colombianos válidos"
  ],
  "error": "Bad Request"
}
```

---

### ❌ Tipo de Documento Inválido (400 Bad Request)
**Request:**
```json
{
  "bankName": "Bancolombia",
  "accountType": "Ahorros",
  "accountNumber": "1234567890",
  "accountHolderName": "Test User",
  "typeDocumentHolder": "DNI",  // No es un tipo válido en Colombia
  "accountHolderDocument": "1234567890"
}
```

**Response:**
```json
{
  "statusCode": 400,
  "message": [
    "El tipo de documento debe ser uno de los tipos válidos"
  ],
  "error": "Bad Request"
}
```

---

### ❌ Cuenta No Encontrada (404 Not Found)
**Request:**
```
GET /bank-accounts/999
```

**Response:**
```json
{
  "statusCode": 404,
  "message": "Cuenta bancaria con ID 999 no encontrada",
  "error": "Not Found"
}
```

---

### ❌ Sin Token de Autenticación (401 Unauthorized)
**Request:**
```
GET /bank-accounts
// Sin header Authorization
```

**Response:**
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

---

### ❌ Nombre del Titular Muy Corto (400 Bad Request)
**Request:**
```json
{
  "bankName": "Bancolombia",
  "accountType": "Ahorros",
  "accountNumber": "1234567890",
  "accountHolderName": "AB",  // Solo 2 caracteres
  "typeDocumentHolder": "Cédula de Ciudadanía",
  "accountHolderDocument": "1234567890"
}
```

**Response:**
```json
{
  "statusCode": 400,
  "message": [
    "El nombre del titular debe tener al menos 3 caracteres"
  ],
  "error": "Bad Request"
}
```

---

### ❌ Documento con Letras (400 Bad Request)
**Request:**
```json
{
  "bankName": "Bancolombia",
  "accountType": "Ahorros",
  "accountNumber": "1234567890",
  "accountHolderName": "Juan Pérez",
  "typeDocumentHolder": "Cédula de Ciudadanía",
  "accountHolderDocument": "123ABC456"  // Contiene letras
}
```

**Response:**
```json
{
  "statusCode": 400,
  "message": [
    "El documento solo debe contener dígitos numéricos"
  ],
  "error": "Bad Request"
}
```

---

### ❌ Múltiples Errores de Validación (400 Bad Request)
**Request:**
```json
{
  "bankName": "Banco Falso",
  "accountType": "Otra",
  "accountNumber": "ABC",
  "accountHolderName": "A",
  "typeDocumentHolder": "DNI",
  "accountHolderDocument": "123"
}
```

**Response:**
```json
{
  "statusCode": 400,
  "message": [
    "El banco debe ser uno de los bancos colombianos válidos",
    "El tipo de cuenta debe ser Ahorros o Corriente",
    "El número de cuenta debe tener al menos 6 dígitos",
    "El número de cuenta solo debe contener dígitos numéricos",
    "El nombre del titular debe tener al menos 3 caracteres",
    "El tipo de documento debe ser uno de los tipos válidos",
    "El documento debe tener al menos 6 caracteres"
  ],
  "error": "Bad Request"
}
```

---

## 🎯 Códigos de Estado HTTP

| Código | Descripción | Cuándo se usa |
|--------|-------------|---------------|
| 200 | OK | GET, PATCH, DELETE exitosos |
| 201 | Created | POST exitoso |
| 400 | Bad Request | Validación fallida, datos duplicados |
| 401 | Unauthorized | Sin autenticación |
| 404 | Not Found | Recurso no existe |
| 500 | Internal Server Error | Error del servidor |

---

## 📝 Notas Importantes

1. **Todos los endpoints requieren autenticación** mediante Bearer token
2. **Los usuarios solo pueden ver y gestionar sus propias cuentas**
3. **La eliminación es soft delete** (isActive = false)
4. **Las validaciones se ejecutan antes de guardar** en la base de datos
5. **Los números de cuenta y documentos deben ser numéricos**
6. **Cada banco tiene reglas específicas** de longitud de cuenta
