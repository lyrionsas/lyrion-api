# Bank Accounts Module

Módulo para la gestión de cuentas bancarias colombianas en Lyrion.

## Características

- ✅ Registro de cuentas bancarias de todos los bancos colombianos
- ✅ Validación de números de cuenta según el banco
- ✅ Tipos de cuenta: Ahorros y Corriente
- ✅ Tipos de documento colombianos soportados
- ✅ Validaciones específicas para Colombia
- ✅ Soft delete (eliminación lógica)
- ✅ Estadísticas de cuentas por banco y tipo
- ✅ Protección de endpoints con autenticación
- ✅ Prevención de duplicados

## Bancos Soportados

- Bancolombia
- Banco de Bogotá
- Davivienda
- BBVA Colombia
- Banco de Occidente
- Banco Popular
- Itaú
- Banco Caja Social
- Banco AV Villas
- Banco Pichincha
- Banco GNB Sudameris
- Banco Falabella
- Banco Finandina
- Banco Agrario
- Bancoomeva
- Banco Mundo Mujer
- Banco W
- Banco Serfinanza
- Scotiabank Colpatria
- Nequi
- Daviplata
- Lulo Bank
- Nu Colombia

## Tipos de Documento Soportados

- Cédula de Ciudadanía
- Cédula de Extranjería
- NIT (Número de Identificación Tributaria)
- Pasaporte
- Tarjeta de Identidad
- Registro Civil

## Endpoints

### POST /bank-accounts
Crear una nueva cuenta bancaria.

**Body:**
```json
{
  "bankName": "Bancolombia",
  "accountType": "Ahorros",
  "accountNumber": "1234567890",
  "accountHolderName": "Juan Pérez",
  "typeDocumentHolder": "Cédula de Ciudadanía",
  "accountHolderDocument": "1234567890"
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "bankName": "Bancolombia",
  "accountType": "Ahorros",
  "accountNumber": "1234567890",
  "accountHolderName": "Juan Pérez",
  "typeDocumentHolder": "Cédula de Ciudadanía",
  "accountHolderDocument": "1234567890",
  "isActive": true,
  "createAt": "2025-10-27T...",
  "updateAt": "2025-10-27T..."
}
```

### GET /bank-accounts
Obtener todas las cuentas bancarias del usuario autenticado.

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "bankName": "Bancolombia",
    "accountType": "Ahorros",
    "accountNumber": "1234567890",
    "accountHolderName": "Juan Pérez",
    "typeDocumentHolder": "Cédula de Ciudadanía",
    "accountHolderDocument": "1234567890",
    "isActive": true,
    "createAt": "2025-10-27T...",
    "updateAt": "2025-10-27T..."
  }
]
```

### GET /bank-accounts/stats
Obtener estadísticas de cuentas bancarias.

**Response:** `200 OK`
```json
{
  "total": 3,
  "byBank": {
    "Bancolombia": 2,
    "Nequi": 1
  },
  "byType": {
    "Ahorros": 2,
    "Corriente": 1
  }
}
```

### GET /bank-accounts/:id
Obtener una cuenta bancaria específica.

**Response:** `200 OK`

### PATCH /bank-accounts/:id
Actualizar una cuenta bancaria.

**Body:**
```json
{
  "accountHolderName": "Juan Carlos Pérez"
}
```

**Response:** `200 OK`

### DELETE /bank-accounts/:id
Eliminar (soft delete) una cuenta bancaria.

**Response:** `200 OK`
```json
{
  "message": "Cuenta bancaria eliminada exitosamente"
}
```

## Validaciones

### Número de Cuenta
- Solo números
- Longitud mínima: 6 dígitos
- Longitud máxima: 20 dígitos
- Validación específica por banco (ej: Bancolombia 10-11 dígitos)

### Nombre del Titular
- Mínimo 3 caracteres
- Requerido

### Documento del Titular
- Solo números
- Entre 6 y 15 caracteres
- Requerido

### Tipo de Documento
- Debe ser uno de los tipos válidos:
  - Cédula de Ciudadanía
  - Cédula de Extranjería
  - NIT
  - Pasaporte
  - Tarjeta de Identidad
  - Registro Civil

### Tipo de Cuenta
- Ahorros
- Corriente

### Banco
- Debe ser uno de los bancos colombianos soportados

## Reglas de Negocio

1. **No duplicados:** Un usuario no puede tener dos cuentas con el mismo número
2. **Soft delete:** Las cuentas eliminadas se marcan como `isActive: false`
3. **Validación por banco:** Cada banco tiene reglas específicas de longitud de cuenta
4. **Seguridad:** Solo el propietario puede ver/modificar sus cuentas

## Migración de Base de Datos

Para crear la tabla en la base de datos, ejecuta:

```bash
npm run migration:generate -- src/database/migrations/CreateBankAccountsTable
npm run migration:run
```

O crea la tabla manualmente:

```sql
CREATE TABLE bank_accounts (
  id_bank_account SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES "user"(id_user),
  bank_name VARCHAR(100) NOT NULL,
  account_type VARCHAR(20) NOT NULL,
  account_number VARCHAR(20) NOT NULL,
  account_holder_name VARCHAR(255) NOT NULL,
  type_document_holder VARCHAR(50) NOT NULL,
  account_holder_document VARCHAR(15) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_bank_accounts_user_id ON bank_accounts(user_id);
CREATE INDEX idx_bank_accounts_account_number ON bank_accounts(account_number);
```

## Uso

1. El usuario debe estar autenticado
2. Crear una cuenta bancaria con el endpoint POST
3. Las cuentas se validan automáticamente según el banco
4. Solo el propietario puede ver y gestionar sus cuentas

## Ejemplos de Prueba

### Crear cuenta Bancolombia
```bash
curl -X POST http://localhost:3000/bank-accounts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bankName": "Bancolombia",
    "accountType": "Ahorros",
    "accountNumber": "1234567890",
    "accountHolderName": "Juan Pérez",
    "typeDocumentHolder": "Cédula de Ciudadanía",
    "accountHolderDocument": "1234567890"
  }'
```

### Crear cuenta Nequi
```bash
curl -X POST http://localhost:3000/bank-accounts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bankName": "Nequi",
    "accountType": "Ahorros",
    "accountNumber": "3001234567",
    "accountHolderName": "María García",
    "typeDocumentHolder": "Cédula de Ciudadanía",
    "accountHolderDocument": "9876543210"
  }'
```

## Notas Importantes

- Las longitudes de cuenta pueden variar según políticas del banco
- Se recomienda validar con la documentación oficial de cada banco
- Los números de celular de Nequi y Daviplata se tratan como números de cuenta
- El módulo implementa soft delete para mantener historial
