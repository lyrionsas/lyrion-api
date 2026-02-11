# Networks Module - API de Validación de Transacciones

Este módulo implementa el patrón Strategy para validar transacciones en diferentes blockchains.

## 🎯 Características

- ✅ Validación de transacciones TRON (TRC20) - **Implementado**
- 🚧 Validación de transacciones Ethereum (ERC20) - **Próximamente**
- 🔧 Patrón Strategy para fácil extensión a otras redes
- 📝 Documentación Swagger completa
- 🛡️ Validación de DTOs con class-validator

## 📋 Endpoints

### 1. Validar Transacción TRON

**POST** `/networks/validate-tx-tron`

Valida una transacción en la red TRON utilizando la API de TronScan y la compara con los datos almacenados en la base de datos.

#### Proceso de Validación

1. ✅ Busca la transacción en la base de datos por `idTransaction`
2. ✅ Consulta la información de la transacción en la blockchain TRON
3. ✅ Valida que el status de la transacción sea exitoso (status: 0)
4. ✅ Compara la wallet de origen con la registrada en BD
5. ✅ Compara la wallet de destino con la registrada en BD
6. ✅ Compara el monto transferido con el registrado en BD
7. ✅ Si todas las validaciones pasan, actualiza el estado a `COMPLETED` y guarda el hash

#### Request Body

```json
{
  "idTransaction": 1,
  "hash": "7c2d4206c03e1358df9867a2c87149a2e7a4cdd3e5b0c4d6f3e2a1b0c9d8e7f6"
}
```

#### Respuesta Exitosa (200)

```json
{
  "success": true,
  "blockchain": "TRC20",
  "transactionHash": "7c2d4206c03e1358df9867a2c87149a2e7a4cdd3e5b0c4d6f3e2a1b0c9d8e7f6",
  "validation": {
    "walletSource": {
      "expected": "TPvN1UnH9TcDXHxtTz1Gr7RD7UUsiwj4dG",
      "received": "TPvN1UnH9TcDXHxtTz1Gr7RD7UUsiwj4dG",
      "match": true
    },
    "walletDestination": {
      "expected": "TGawXkn67J9Wy4ZD2ModhCETDbc4TqVjLs",
      "received": "TGawXkn67J9Wy4ZD2ModhCETDbc4TqVjLs",
      "match": true
    },
    "amount": {
      "expected": 50,
      "received": 50,
      "currency": "USDT",
      "match": true
    },
    "status": {
      "blockchain": "SUCCESS",
      "database": "COMPLETED"
    }
  },
  "data": {
    // Datos completos de la transacción desde TronScan API
  }
}
```

#### Errores

- **400 Bad Request**:
  - ID de transacción no encontrada en la base de datos
  - Hash inválido o transacción no encontrada en blockchain
  - Transacción no fue exitosa en la blockchain
  - Wallet de origen no coincide
  - Wallet de destino no coincide
  - Monto no coincide
- **500 Internal Server Error**: Error en la API de TRON

### 2. Validar Transacción Ethereum

**POST** `/networks/validate-tx-ethereum`

⚠️ **En desarrollo** - Lanza NotImplementedException

#### Request Body

```json
{
  "hash": "0x..."
}
```

## 🏗️ Arquitectura

### Patrón Strategy

El módulo utiliza el patrón Strategy para permitir diferentes implementaciones de validación:

```
NetworksController
    ↓
NetworksService
    ↓
TransactionStrategyFactory
    ↓
[TronStrategy | EthereumStrategy | ...]
```

### Estructura de Archivos

```
networks/
├── dto/
│   ├── validate-transaction.dto.ts    # DTO para validación
│   └── index.ts
├── interface/
│   ├── transaction-data.interface.ts  # Interface de datos de transacción
│   └── transaction-strategy.interface.ts  # Interface del patrón Strategy
├── strategies/
│   ├── tron.strategy.ts               # ✅ Implementación TRON
│   └── ethereum.strategy.ts           # 🚧 Implementación Ethereum
├── common/
│   └── config.ts                      # Configuración de URLs y mapeo
├── networks.controller.ts             # Controlador de endpoints
├── networks.service.ts                # Lógica de negocio
├── networks.module.ts                 # Módulo NestJS
└── transaction-strategy.factory.ts    # Factory del patrón Strategy
```

## 🔧 Configuración

### Variables de Entorno

Asegúrate de tener configurada la siguiente variable en tu `.env`:

```env
API_KEY_TRON=tu_api_key_de_tronscan
```

Puedes obtener una API key en: https://www.trongrid.io/

### Para agregar Ethereum (próximamente)

1. Agregar la API key en `envs.ts`:
```typescript
API_KEY_ETHEREUM: joi.string().required(),
```

2. Configurar la URL de la API en `common/config.ts`:
```typescript
export const ETHEREUM_API_URL = "https://api.etherscan.io/api";
```

3. Implementar el método `validateTransaction` en `ethereum.strategy.ts`

## 🚀 Uso

### Ejemplo con cURL

```bash
# Validar transacción TRON
curl -X POST http://localhost:3000/networks/validate-tx-tron \
  -H "Content-Type: application/json" \
  -d '{"idTransaction": 1, "hash":"7c2d4206c03e1358df9867a2c87149a2e7a4cdd3e5b0c4d6f3e2a1b0c9d8e7f6"}'
```

### Ejemplo con TypeScript/JavaScript

```typescript
const response = await fetch('http://localhost:3000/networks/validate-tx-tron', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    idTransaction: 1,
    hash: '7c2d4206c03e1358df9867a2c87149a2e7a4cdd3e5b0c4d6f3e2a1b0c9d8e7f6'
  })
});

const data = await response.json();
console.log(data);
```

## 🔐 Seguridad

- Las API keys se almacenan de forma segura en variables de entorno
- Validación de entrada con class-validator
- Logging de todas las operaciones para auditoría
- Manejo robusto de errores

## 📝 Próximas Mejoras

- [ ] Implementar validación de transacciones Ethereum
- [ ] Agregar soporte para BSC (Binance Smart Chain)
- [ ] Implementar caché de transacciones validadas
- [ ] Agregar rate limiting
- [ ] Webhooks para notificaciones de transacciones
- [ ] Tests unitarios y de integración

## 🐛 Troubleshooting

### Error: "Transacción con ID X no encontrada en la base de datos"
- Verifica que el `idTransaction` exista en la tabla `tx_client`
- Asegúrate de usar el ID correcto de la transacción

### Error: "Transacción no encontrada en la red TRON"
- Verifica que el hash sea correcto
- Asegúrate de que la transacción exista en la red TRON
- Espera unos minutos si la transacción es muy reciente

### Error: "La wallet de origen/destino no coincide"
- Verifica que las wallets en la base de datos sean correctas
- Asegúrate de que el hash corresponda a la transacción correcta
- Revisa que no haya errores de tipeo en las direcciones de wallet

### Error: "El monto no coincide"
- Verifica que el monto en la base de datos esté correcto
- Considera que los decimales pueden variar según el token (USDT usa 6 decimales)
- Asegúrate de que el hash corresponda a la transacción correcta

### Error: "La transacción no fue exitosa en la blockchain de TRON"
- La transacción falló en la blockchain
- Verifica el estado de la transacción en TronScan
- No se puede validar una transacción fallida

### Error: "Error al validar la transacción en TRON"
- Verifica que la API_KEY_TRON esté configurada correctamente
- Revisa los logs del servidor para más detalles
- Verifica la conectividad con la API de TronScan
