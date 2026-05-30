# TutorBot Campus - Lab Deliverables

## 1. Execution Summary

The local TutorBot Campus environment was prepared following the document `TutorBot_Campus_Lab_Setup_Assignment.docx`.

Validated workflow:

1. Login with demo student `A00835001`.
2. Topics list visible with `HTML and CSS`, `JavaScript`, and `Spring Boot`.
3. Session started in the `HTML and CSS` topic, level `beginner`.
4. Answer submitted and evaluated by TutorBot.
5. Incorrect answer submitted and specific feedback received.
6. Mini exam completed.
7. Results screen opened.
8. Learning path and recommendations visible.

## 2. Required Screenshots

### Screenshot A - Docker containers healthy/running


![Screenshot A - Docker containers](/evidencias/evidencia-a-docker.png)

### Screenshot B - Oracle seed verification

![Screenshot B - Oracle seed data](/evidencias/evidencia-b-oracle.png)

### Screenshot C - Incorrect answer feedback

![Screenshot C - Incorrect feedback](/evidencias/feedback-incorrecto.png)

## 3. Additional Evidence

### Topics visible in frontend

![Visible topics](/evidencias/frontend-topics.png)

### Results and learning path

![Results and learning path](/evidencias/resultados-ruta-aprendizaje.png)

## 4. Data Verification

Counts verified in Oracle:

| Table | Result | Requirement |
| --- | ---: | ---: |
| COURSES | 6 | 6 |
| SKILLS | 6 | 6 |
| TOPICS | 20 | 20 |
| SUBTOPICS | 50 | 50 |
| LEARNING_PATHS | 15 | 15 |
| EVALUATIONS | 312 | >= 300 |
| GAPS | 200 | >= 200 |

Additional validations:

| Validation | Status |
| --- | --- |
| `HTML and CSS` exists and is active | Completed |
| `JavaScript` exists and is active | Completed |
| `Spring Boot` exists and is active | Completed |
| At least one inactive topic exists | Completed |
| Learning paths exist for demo students | Completed |

## 5. Verified Services

| Service | Port | Status |
| --- | ---: | --- |
| session-service | 8086 | UP |
| evaluator-service | 8082 | UP |
| gap-detector-service | 8084 | UP |
| api-gateway | 8080 | UP / routes tested |
| frontend Vite | 5175 | Accessible |

Local URL used for testing: `http://127.0.0.1:5175/`

## 6. Required Video

esto aun falta, pero ya pronto



## Authors

| Name | Student ID |
|--------|--------|
| José Emilio Inzunza García | A01644973 |
| Yael García Morelos | A01352461 |
| Patricio Blanco Rafols | A01642057 |
| Arturo Gómez Gómez | A07106692 |
| Andrés Gallego López | A01645740 |