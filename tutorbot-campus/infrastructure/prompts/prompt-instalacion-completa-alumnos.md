# Prompt Maestro Para Instalar TutorBot Campus En Ambiente De Alumno

Usa este prompt con un modelo de IA para generar una guia de instalacion completa, rigurosa y reutilizable del proyecto TutorBot Campus. La respuesta debe servir para que alumnos universitarios puedan levantar el sistema localmente desde cero, con Docker, base de datos, servicios internos, servicios extra y un paso claro de validacion final.

## Rol del modelo

Actua como arquitecto tecnico, DevOps instructor y docente de laboratorio. Debes entregar una guia extremadamente detallada, paso a paso, pensada para alumnos que pueden equivocarse con Java, Maven, Docker, Oracle, variables de entorno, seeds de base de datos y orden de arranque de microservicios.

## Objetivo de la respuesta

Genera una guia integral para instalar y ejecutar TutorBot Campus localmente, de forma reproducible, para practicas o laboratorio. La guia debe permitir:

1. Instalar prerrequisitos.
2. Levantar dependencias con Docker.
3. Inicializar Oracle con schema y seed.
4. Verificar que los datos sembrados sean correctos.
5. Ejecutar microservicios internos en el orden adecuado.
6. Ejecutar el frontend.
7. Probar el happy path completo.
8. Resolver fallas comunes.

## Contexto real del repositorio

Debes asumir este contexto tecnico actual del proyecto:

- Monorepo llamado `tutorbot-campus`.
- Frontend en React + TypeScript + Vite.
- Backend con microservicios Spring Boot.
- API Gateway como punto de entrada del frontend.
- Dependencias auxiliares en Docker.
- Oracle como base de datos para `evaluator-service` y `gap-detector-service`.
- Redis para `session-service`.
- RabbitMQ presente como middleware de mensajeria.
- MongoDB y Solr usados por servicios complementarios.
- Ollama usado localmente para evaluacion/IA.

## Servicios y puertos que debes documentar

Incluye una tabla clara con estos servicios y su proposito:

- `api-gateway` en `8080`
- `session-service` en `8086`
- `evaluator-service` en `8082`
- `gap-detector-service` en `8084`
- `learning-path-service` en `8085`
- `exercise-service` en `8083`
- `notifier-service` en `8086` como parte de arquitectura objetivo si aplica aclaracion
- `eureka-server` en `8761`
- frontend Vite en `5175` si el proyecto lo levanta en ese puerto local
- Oracle en `1522`
- Redis en `6379`
- RabbitMQ en `5672` y panel en `15672`
- MongoDB en `27018`
- Solr en `8983`
- Ollama en `11434`

Si existe alguna discrepancia entre documentacion vieja y configuracion actual, debes decirlo explicitamente y privilegiar la configuracion actualmente validada para desarrollo local.

## Dependencias Docker que debes cubrir

Explica como levantar y validar:

- Oracle XE con contenedor `oracledb`
- Redis
- RabbitMQ
- MongoDB
- Solr
- Ollama

Aclara que el archivo base para dependencias de desarrollo es `infrastructure/docker-compose.dev.yml`.

## Base de datos Oracle

La guia debe incluir una seccion dedicada a Oracle con mucho detalle:

- Imagen usada.
- Usuario.
- Password.
- Puerto.
- Service name correcto para desarrollo local.
- Diferencia entre configuracion Docker antigua con `TESTDB` y configuracion local validada con `XEPDB1` cuando aplique.
- Como esperar a que Oracle este listo.
- Como entrar con `sqlplus` dentro del contenedor.
- Como ejecutar:
  - `infrastructure/oracle/V1__init_schema.sql`
  - `infrastructure/oracle/V2__seed_data.sql`

## Validacion de datos esperados

Debes pedir que la guia explique como validar que la base de datos quedo bien sembrada. Incluye al menos estas expectativas:

- `COURSES` = 6
- `SKILLS` = 6
- `TOPICS` = 20
- `SUBTOPICS` = 50
- `LEARNING_PATHS` = 15
- `EVALUATIONS` >= 300
- `GAPS` >= 200

Tambien pide que se valide:

- existen los topics `HTML y CSS`, `JavaScript`, `Spring Boot`
- existe al menos un topic inactivo para pruebas
- existen learning paths sembrados para matriculas de ejemplo

## Flujo de instalacion que debes pedir al modelo

La guia debe explicar exactamente este flujo o uno equivalente:

1. Instalar Java 21.
2. Instalar Maven 3.9+.
3. Instalar Docker Desktop.
4. Instalar Ollama.
5. Clonar el repositorio.
6. Levantar dependencias con Docker.
7. Esperar salud de Oracle.
8. Ejecutar schema y seed.
9. Correr script de verificacion de datos.
10. Levantar microservicios internos en orden recomendado.
11. Levantar frontend.
12. Hacer pruebas funcionales minimas.

## Servicios internos que debes pedir que se documenten

Pide que la guia separe entre:

### Servicios minimos para happy path validado

- `api-gateway`
- `session-service`
- `evaluator-service`
- `gap-detector-service`
- frontend

### Servicios adicionales o de arquitectura objetivo

- `eureka-server`
- `exercise-service`
- `learning-path-service`
- `notifier-service`

Explica que la guia debe indicar cuales son obligatorios hoy para poder probar el flujo principal y cuales son complementarios.

## Requisitos de frontend

Pide que la guia documente:

- carpeta desde la que se ejecuta el frontend
- instalacion de dependencias con npm
- comando para desarrollo
- URL esperada en navegador
- notas de autenticacion local si aplica

## Requisitos de backend

Pide que la guia documente por servicio:

- carpeta del servicio
- comando para ejecutarlo
- profile recomendado para local cuando aplique
- dependencias externas requeridas
- endpoint o health check basico para confirmar que arranco bien

## Verificacion funcional final

Pide que la guia cierre con una seccion de pruebas finales del sistema, por ejemplo:

1. login local correcto
2. listado de topics responde desde gateway
3. se crea una sesion
4. el chat responde
5. evaluator califica una respuesta
6. gap detector entrega una recomendacion
7. la pantalla final de resultados carga
8. el learning path muestra recursos

## Troubleshooting que debe incluir el modelo

Pide una seccion de troubleshooting muy detallada para errores como:

- `Failed to fetch`
- Oracle no esta listo
- `ORA-12514`
- `mvn` usando Java incorrecto
- puerto ocupado
- Ollama sin modelo descargado
- CORS en gateway
- seed ejecutado parcialmente
- servicios levantados en orden incorrecto
- contenedor Oracle saludable pero sin schema cargado

## Entregable esperado

La respuesta del modelo debe estar organizada asi:

1. Resumen ejecutivo.
2. Arquitectura local de desarrollo.
3. Prerrequisitos.
4. Levantamiento de infraestructura Docker.
5. Inicializacion de Oracle.
6. Verificacion de seed y datos.
7. Ejecucion de microservicios.
8. Ejecucion del frontend.
9. Happy path de validacion.
10. Troubleshooting.
11. Checklist final para alumnos.

## Instruccion final para el modelo

Genera una guia completa, extremadamente detallada, en espanol, orientada a alumnos, para instalar y ejecutar TutorBot Campus con Docker, Oracle, seeds, microservicios internos, servicios extra y frontend, incluyendo pasos de validacion de datos y verificacion final del sistema para laboratorio.