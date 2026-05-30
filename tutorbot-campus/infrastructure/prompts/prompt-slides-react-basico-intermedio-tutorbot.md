# Prompt Maestro Para Crear Slides De React Basico A Intermedio Con Ejemplos De TutorBot Campus

Usa este prompt para pedirle a un modelo de IA que genere una presentacion completa en formato de slides para ensenar React a alumnos con nivel basico a intermedio, tomando como base el proyecto real TutorBot Campus.

La idea no es crear una clase generica de React, sino una clase contextualizada en un proyecto universitario que ya integra frontend en React + TypeScript + Vite con un backend de microservicios y un API Gateway.

## Objetivo del prompt

Genera una presentacion de React pensada para alumnos que ya vieron HTML, CSS y JavaScript basico, y que ahora necesitan entender como se construye una aplicacion moderna en React dentro de un proyecto real.

La presentacion debe partir desde conceptos fundamentales, pero avanzar de forma gradual hasta temas de nivel intermedio. Debe usar ejemplos conectados con TutorBot Campus para que los alumnos entiendan como React se aplica en una aplicacion completa y no solo en ejemplos aislados.

## Contexto obligatorio del proyecto que debes usar en la presentacion

La presentacion debe tomar como referencia el proyecto TutorBot Campus con este contexto:

- El frontend esta construido con React, TypeScript y Vite.
- El frontend vive en una carpeta `frontend/`.
- El frontend consume un backend por medio de un API Gateway.
- La URL base de backend en desarrollo local es `http://localhost:8080` mediante la variable `VITE_API_BASE`.
- El proyecto tiene una estructura por paginas, componentes, hooks, servicios, tipos, utilidades y capa API.
- El frontend forma parte de un sistema mas grande con microservicios como `api-gateway`, `session-service`, `evaluator-service`, `gap-detector-service`, `exercise-service`, `learning-path-service` y `notifier-service`.
- En el flujo actual del proyecto existen acciones como login, seleccion de tema, sesiones, evaluacion de respuestas, progreso del alumno y visualizacion de informacion academica.
- El frontend no debe comunicarse directamente con microservicios internos; debe pasar por el API Gateway.
- En el proyecto hay ejemplos reales de consumo de endpoints, manejo de estado, flujo de pantallas y separacion entre UI y acceso a datos.

## Perfil de los alumnos

Asume que los alumnos:

- Ya conocen HTML y CSS.
- Ya escribieron JavaScript basico.
- Entienden variables, funciones, arrays, objetos, condicionales y eventos.
- Todavia no dominan bien componentes, props, estado, hooks, asincronia en React, arquitectura de carpetas ni integracion con APIs reales.
- Necesitan una explicacion didactica, progresiva y aterrizada a un proyecto real.

## Objetivo pedagogico de la presentacion

La presentacion debe ayudar a que los alumnos logren esto al final de la clase:

1. Entender que problema resuelve React.
2. Comprender como se organiza una aplicacion React moderna.
3. Distinguir componentes, props, estado y hooks.
4. Entender como React renderiza interfaces a partir del estado.
5. Aprender a dividir una UI en piezas reutilizables.
6. Comprender como consumir una API desde React.
7. Entender por que conviene separar paginas, componentes, hooks, servicios y tipos.
8. Aprender buenas practicas para crecer de una app pequena a una app mas real.
9. Relacionar React con el flujo completo de TutorBot Campus.
10. Quedar listos para extender el frontend del proyecto con criterio tecnico.

## Instrucciones para el modelo que generara las slides

Genera una presentacion completa de entre 30 y 45 slides.

La presentacion debe estar escrita completamente en espanol.

Debe tener un tono docente, claro, universitario y practico. No la hagas demasiado teorica. Debe sentirse como una clase construida por alguien que realmente ya reviso el proyecto TutorBot Campus y quiere ensenar React usando ese contexto.

La estructura debe ir de basico a intermedio. Cada bloque debe construir sobre el anterior.

No generes solo titulos. Para cada slide incluye contenido real.

## Formato obligatorio de salida

Para cada slide entrega exactamente estos campos:

- `Numero de slide`
- `Titulo`
- `Objetivo de la slide`
- `Puntos clave`
- `Guion del profesor`
- `Ejemplo o analogia`
- `Ejemplo aterrizado a TutorBot Campus`
- `Idea visual para la diapositiva`

Cuando tenga sentido, agrega tambien:

- `Codigo ejemplo`
- `Error comun o confusion frecuente`
- `Pregunta para el grupo`
- `Mini ejercicio`

## Estructura tematica obligatoria de la presentacion

La presentacion debe cubrir estos bloques.

### Bloque 1. Introduccion: por que React existe

Incluye slides para explicar:

- El problema de manipular el DOM manualmente en aplicaciones que crecen.
- La diferencia entre una pagina estatica y una interfaz reactiva.
- La idea de UI basada en estado.
- Por que React es util en proyectos con varias vistas, datos y eventos.
- Como esto se conecta con TutorBot, donde hay login, seleccion de tema, sesiones, resultados y otras vistas.

### Bloque 2. Entender la base de una app React moderna

Incluye slides para explicar:

- Que son React, TypeScript y Vite en este proyecto.
- Que papel cumple `main.tsx`.
- Que papel cumple `App.tsx`.
- Como arranca la aplicacion desde el `index.html` hasta el render del arbol React.
- Diferencia entre entorno de desarrollo y build.

Usa ejemplos que aterricen esta idea a TutorBot Campus.

### Bloque 3. Componentes

Incluye slides para explicar:

- Que es un componente.
- Por que pensar la UI como piezas pequenas.
- Diferencia entre componente de pagina y componente reutilizable.
- Como decidir si algo debe ser componente propio.
- Ejemplos de componentes tipicos en TutorBot: tarjetas, encabezados, formularios, paneles de progreso, lista de temas, mensajes de chat, resumenes de resultados.

Pide al modelo que muestre un ejemplo pequeno de componente funcional en React con TypeScript.

### Bloque 4. JSX

Incluye slides para explicar:

- Que es JSX.
- Por que parece HTML pero no es exactamente HTML.
- Expresiones dinamicas dentro de JSX.
- Renderizado condicional.
- Renderizado de listas con `map`.
- Importancia de las `key`.

Relaciona esto con ejemplos como renderizar temas disponibles, mensajes de una sesion o cards de rutas de aprendizaje.

### Bloque 5. Props

Incluye slides para explicar:

- Que son las props.
- Como viajan los datos de padre a hijo.
- Como tipar props en TypeScript.
- Cuando usar props y cuando ya conviene levantar estado.
- Errores comunes: props drilling innecesario, nombres confusos o mandar demasiada responsabilidad a un componente.

Usa ejemplos con un componente de tarjeta de tema o con un item de mensaje.

### Bloque 6. Estado

Incluye slides para explicar:

- Que es el estado.
- Diferencia entre variable normal y estado React.
- Por que `useState` dispara re-render.
- Estado local vs estado compartido.
- Como identificar que informacion debe vivir en estado.
- Ejemplos reales: usuario logueado, tema seleccionado, preguntas actuales, mensajes, cargando, error, resultados.

Pide que se incluya al menos un ejemplo con `useState` conectado con una accion del usuario.

### Bloque 7. Ciclo mental de renderizado

Incluye slides para explicar:

- Evento del usuario.
- Cambio de estado.
- React vuelve a renderizar.
- La UI cambia.

No uses explicaciones demasiado internas del reconciler. En este nivel importa la intuicion correcta.

Relaciona el flujo con acciones de TutorBot como:

- elegir un tema,
- iniciar una sesion,
- enviar una respuesta,
- mostrar retroalimentacion,
- avanzar a la siguiente vista.

### Bloque 8. Hooks

Incluye slides para explicar:

- Que es un hook.
- Reglas basicas de hooks.
- `useState`.
- `useEffect`.
- Para que sirven hooks personalizados.
- Como un hook puede encapsular logica reutilizable.

Usa un ejemplo de hook para cargar datos del backend o para administrar una sesion de aprendizaje.

### Bloque 9. Efectos y asincronia

Incluye slides para explicar:

- Cuando usar `useEffect`.
- Carga de datos al montar una vista.
- Dependencias del efecto.
- Estados `loading`, `success`, `error`.
- Riesgos comunes: loops de render, dependencias incorrectas, mezclar demasiadas responsabilidades.

Usa un ejemplo aterrizado a TutorBot, por ejemplo cargar temas, recuperar una sesion o solicitar datos del estudiante desde el gateway.

### Bloque 10. Llamadas a APIs reales

Incluye slides para explicar:

- Por que el frontend debe hablar con el API Gateway.
- Que significa centralizar la base URL.
- Como organizar funciones de acceso a datos en una capa API o servicios.
- Por que no conviene meter toda la logica de fetch dentro del JSX.
- Manejo de errores y respuestas del servidor.
- Buenas practicas para separar UI de acceso a red.

Debes usar explicitamente el contexto de TutorBot:

- `VITE_API_BASE`.
- Gateway en `http://localhost:8080`.
- Frontend que consume endpoints de login, sesiones, temas, evaluacion y gaps a traves del gateway.

Pide al modelo que incluya un ejemplo simple de funcion asincrona tipada y su uso desde un componente.

### Bloque 11. Organizacion del proyecto frontend

Incluye slides para explicar una estructura como esta:

- `pages/`
- `components/`
- `hooks/`
- `services/`
- `api/`
- `types/`
- `utils/`

No solo la enumeres. Explica que vive en cada carpeta, por que esa separacion ayuda a crecer y como evitar mezclar responsabilidades.

Relaciona esto con la realidad de TutorBot Campus como proyecto academico que ya es mas grande que una app de juguete.

### Bloque 12. Flujo de datos en una app real

Incluye slides para explicar un flujo tipo:

1. El usuario inicia sesion.
2. El frontend guarda estado del usuario.
3. El usuario selecciona un tema.
4. Se solicita informacion al backend.
5. Se renderiza una nueva vista.
6. El usuario responde.
7. Se envia la respuesta.
8. Se actualizan resultados o progreso.

Conecta esto con TutorBot para que el alumno vea el viaje completo del dato y no piezas aisladas.

### Bloque 13. Buenas practicas de React en este proyecto

Incluye slides para explicar:

- Mantener componentes pequenos y con una responsabilidad clara.
- No mezclar demasiada logica de negocio en la vista.
- Tipar props y respuestas.
- Reutilizar hooks y servicios.
- Evitar duplicar llamadas o estado innecesario.
- Separar datos mock de datos reales.
- Pensar primero en la UX del estado: vacio, cargando, error, exito.

Tambien pide que se mencione una leccion importante del proyecto:

- Si el frontend espera endpoints que el backend aun no implementa, la UI puede romperse o quedar incompleta.

Usa esto para ensenar a los alumnos a alinear frontend y backend con contratos claros.

### Bloque 14. Errores comunes de alumnos

Incluye slides sobre errores frecuentes como:

- confundir props con estado,
- usar `useEffect` para todo,
- no manejar `loading` y `error`,
- mezclar fetch con presentacion de forma desordenada,
- crear componentes enormes,
- duplicar estado,
- no pensar en tipos,
- acoplar la UI directamente a detalles internos del backend.

Cada error debe venir con una explicacion corta y una recomendacion concreta.

### Bloque 15. Cierre con aplicacion al proyecto

Incluye slides finales para:

- resumir lo aprendido,
- conectar React con el resto de la arquitectura de TutorBot,
- explicar como un alumno podria extender el frontend del proyecto,
- proponer pequenos ejercicios o retos posteriores.

## Casos concretos de TutorBot que debes incorporar como ejemplos dentro de las slides

Distribuye estos ejemplos a lo largo de la presentacion:

- Una vista de login que envia credenciales al gateway.
- Una vista que carga temas desde backend.
- Una pantalla o seccion de sesion donde se renderizan mensajes dinamicamente.
- Un componente que muestre progreso del alumno.
- Una pantalla que muestre resultados o gaps de aprendizaje.
- Un ejemplo de estados `loading`, `error` y `empty` en una consulta.
- Un ejemplo donde el frontend use una funcion centralizada para llamar al backend.
- Un ejemplo donde se vea por que conviene separar `page`, `component`, `hook` y `service`.

## Requisitos de profundidad

No simplifiques demasiado.

Quiero que las slides sean aptas para ensenar bien, no solo para verse bonitas. Cada slide debe tener contenido util para que otro docente pueda usarla casi tal cual en clase.

El guion del profesor debe ser suficientemente detallado para explicar la idea sin improvisar demasiado.

Los ejemplos deben ser realistas y coherentes con TutorBot Campus, aunque no es necesario copiar codigo exacto del proyecto.

## Requisitos didacticos

Haz que la progresion sea pedagogicamente correcta:

- primero problema,
- luego modelo mental,
- luego sintaxis,
- luego componentes,
- luego estado,
- luego hooks,
- luego asincronia,
- luego arquitectura,
- luego buenas practicas,
- luego aplicacion real.

Cada bloque debe incluir al menos:

- una explicacion conceptual,
- un ejemplo sencillo,
- una conexion al proyecto TutorBot,
- una advertencia de error comun si aplica.

## Requisitos visuales de la presentacion

Pide que cada slide tambien sugiera una idea visual concreta, por ejemplo:

- diagrama simple,
- flujo de datos,
- esquema de componentes,
- comparacion lado a lado,
- timeline de render,
- tarjeta UI simulada,
- fragmento pequeno de codigo con resaltado.

Evita proponer slides saturadas de texto. El contenido debe estar preparado para diapositivas claras, pero el guion del profesor puede ser mas amplio.

## Requisitos sobre codigo ejemplo

Cuando incluyas codigo ejemplo:

- usa React con TypeScript,
- mantenlo corto y legible,
- evita ejemplos demasiado avanzados,
- asegurate de que el codigo apoye la explicacion pedagogica,
- conecta el ejemplo con casos de TutorBot cuando sea posible.

## Entregable esperado del modelo

Genera la presentacion completa slide por slide, desde la apertura hasta el cierre, lista para que un docente universitario la convierta a PowerPoint, Google Slides o Canva.

La salida debe sentirse como una clase seria, completa y aplicada a un proyecto real de software.

## Instruccion final para el modelo

Genera una presentacion exhaustiva de React basico a intermedio para alumnos universitarios, usando TutorBot Campus como caso de estudio central. Debe ensenar React de manera progresiva, didactica y aplicada, mostrando como se construye un frontend moderno que consume un API Gateway, organiza su codigo por capas, maneja estado, hooks, asincronia y vistas reales dentro de una arquitectura mayor.
