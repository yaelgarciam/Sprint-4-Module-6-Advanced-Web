# Student Bootstrap

Esta carpeta concentra artefactos simples para que alumnos verifiquen rapido si su instalacion local de TutorBot Campus tiene la base de datos Oracle correctamente inicializada.

## Archivos

- `verify_oracle_seed.sh`: script de verificacion de schema y seed.
- `oracle_seed_checks.sql`: consultas y checks de integridad para el seed de laboratorio.

## Requisitos

- Docker levantado.
- Contenedor Oracle disponible como `oracledb`.
- Usuario `Adolfo` creado.
- Schema y seed ejecutados con:
  - `infrastructure/oracle/V1__init_schema.sql`
  - `infrastructure/oracle/V2__seed_data.sql`

## Uso

Desde la raiz del repo:

```bash
chmod +x infrastructure/student-bootstrap/verify_oracle_seed.sh
./infrastructure/student-bootstrap/verify_oracle_seed.sh
```

## Variables opcionales

```bash
ORACLE_CONTAINER=oracledb
ORACLE_USER=Adolfo
ORACLE_PASSWORD=password
ORACLE_SERVICE=XEPDB1
```

## Resultado esperado

- Si todo esta correcto, el script termina con codigo `0`.
- Si falta schema, faltan tablas o faltan datos minimos, el script termina con codigo `1` y marca exactamente que check fallo.