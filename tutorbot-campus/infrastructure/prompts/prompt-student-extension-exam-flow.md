# Prompt Para Que Los Alumnos Extiendan El Flujo De Examen De TutorBot Campus

Usa este prompt para pedirle a un modelo de IA que genere una propuesta de desarrollo tecnico para que alumnos universitarios continúen el trabajo a partir del flujo minimo ya implementado en TutorBot Campus.

## Contexto actual del proyecto

El proyecto TutorBot Campus ya tiene un flujo minimo funcional de evaluacion en chat:

- Frontend en React + TypeScript + Vite.
- API Gateway en Spring Cloud Gateway.
- `evaluator-service` para calificar respuestas.
- `session-service` para guardar sesiones y mensajes.
- `gap-detector-service` para analitica adicional.
- Login local funcionando.
- Seleccion de tema funcionando.
- Chat funcionando.
- Flujo minimo de mini-examen implementado en frontend con 5 preguntas fijas por tema.
- Al terminar las 5 preguntas, el chat muestra mensaje de fin y bloquea el input.

## Limites del flujo actual

Explica en tu respuesta que el flujo actual es deliberadamente minimo y todavia tiene pendientes importantes, por ejemplo:

- Las preguntas del examen no se generan desde backend; hoy viven en el frontend como banco fijo.
- No existe una pantalla dedicada de resultados finales.
- No existe pantalla de revision de respuestas.
- No existe reanudacion completa del examen despues de refrescar con estado estructurado.
- No existe endpoint backend para generar la siguiente pregunta.
- No existe endpoint backend para cerrar y resumir formalmente el examen.
- No existe una experiencia visual completa de progreso tipo examen.

## Tarea para los alumnos

Genera una propuesta de trabajo para alumnos que deban extender TutorBot Campus a partir del estado actual. La propuesta debe incluir:

1. Objetivo general.
2. Objetivos tecnicos.
3. Alcance minimo obligatorio.
4. Alcance deseable.
5. Arquitectura propuesta.
6. Pantallas a crear.
7. Flujo de usuario esperado.
8. APIs que deben diseñar o extender.
9. Criterios de aceptacion.
10. Ideas de rubrica de evaluacion.

## Pantallas que deben proponerse como trabajo de alumnos

Pide que se diseñen e implementen al menos estas pantallas nuevas:

### 1. Pantalla de inicio de examen

Debe mostrar:

- Tema seleccionado.
- Nivel.
- Numero total de preguntas.
- Instrucciones del examen.
- Boton de comenzar.

### 2. Pantalla o vista de progreso del examen

Debe mostrar:

- Pregunta actual.
- Numero de pregunta actual sobre total.
- Barra de progreso.
- Estado del examen en curso.
- Posible temporizador opcional.

### 3. Pantalla de resultados finales

Debe mostrar:

- Puntaje total o promedio.
- Resumen de desempeno.
- Temas fuertes.
- Areas de mejora.
- Recomendacion de siguiente paso.
- Boton para reiniciar o volver al dashboard.

### 4. Pantalla de revision de respuestas

Debe mostrar:

- Cada pregunta.
- Respuesta del alumno.
- Retroalimentacion recibida.
- Puntaje por pregunta.
- Estado correcto/parcial/incorrecto.

## Flujo funcional que los alumnos deben construir

Pide que se implemente un flujo mas completo como este:

1. El alumno inicia sesion.
2. Selecciona tema y nivel.
3. Ve una pantalla de introduccion al examen.
4. Inicia el examen.
5. El sistema solicita la primera pregunta desde backend.
6. El alumno responde.
7. El backend evalua la respuesta.
8. El sistema decide si:
   - genera la siguiente pregunta, o
   - termina el examen.
9. Al finalizar, se navega a una pantalla de resultados.
10. El alumno puede revisar detalle de respuestas.

## Requisitos de backend que los alumnos deben proponer o implementar

Pide que los alumnos diseñen una extension de la arquitectura con endpoints como estos o equivalentes:

- `POST /api/v1/exams/start`
- `GET /api/v1/exams/{examId}`
- `POST /api/v1/exams/{examId}/answer`
- `POST /api/v1/exams/{examId}/next-question`
- `POST /api/v1/exams/{examId}/finish`
- `GET /api/v1/exams/{examId}/results`
- `GET /api/v1/exams/{examId}/review`

Pide que expliquen:

- Que servicio deberia ser responsable de estas operaciones.
- Si deben crear un servicio nuevo o ampliar `session-service` o `exercise-service`.
- Como se integraria esto con `evaluator-service`.
- Que datos deben persistirse.

## Requisitos de arquitectura para alumnos

Pide que el modelo explique a los alumnos como pensar la solucion desde arquitectura:

- Separacion de responsabilidades.
- Contratos API claros.
- Uso del API Gateway como unico punto de entrada.
- Compatibilidad con Eureka como arquitectura objetivo.
- Posible generacion de preguntas via IA o via banco de preguntas.
- Persistencia del estado del examen.
- Posible soporte de reanudacion del examen.

## Lo que ya esta resuelto y no deben rehacer desde cero

Pide que el modelo deje claro que ya existe:

- Login local.
- Seleccion de tema.
- Sesion basica.
- Enrutamiento por gateway.
- Evaluacion de respuestas.
- Flujo minimo de 5 preguntas en chat.

Los alumnos no deben borrar ese trabajo, sino evolucionarlo.

## Lo que si deben desarrollar

Pide que el modelo proponga trabajo real para los alumnos en estas areas:

- Mejor UX del examen.
- Navegacion entre estados del flujo.
- Persistencia formal del examen.
- Generacion backend-driven de siguientes preguntas.
- Pantallas de resumen y revision.
- Mejor visualizacion del progreso.
- Mejor manejo de fin de examen.

## Criterios de aceptacion sugeridos

La respuesta debe proponer criterios como:

- El examen ya no depende de preguntas codificadas solo en frontend.
- El usuario puede ver progreso claro.
- El examen termina formalmente.
- Existe una pantalla de resultados.
- Existe una pantalla o seccion de revision.
- El flujo soporta al menos un refresh sin perder por completo el estado.
- Las APIs nuevas estan documentadas.
- El gateway enruta correctamente los nuevos endpoints.

## Estilo de la respuesta esperada

Pide que el modelo entregue una respuesta:

- En espanol.
- Clara y didactica.
- Con secciones y subtitulos.
- Con enfoque para alumnos.
- Con equilibrio entre arquitectura, UX y backend.
- Con ideas realistas, no excesivamente complejas para una clase.

## Instruccion final para el modelo

Genera una propuesta completa para alumnos universitarios que extiendan TutorBot Campus desde el flujo minimo actual hacia un flujo de examen mas robusto, con nuevas pantallas, mejor orquestacion y APIs claras, sin reescribir desde cero lo que ya funciona.
