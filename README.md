# Proyecto Software Verificable
App de calendario, por Hugo de la Fuente.

# Instalación
Para instalar las dependencias `yarn install`
Para compilar y correr la app `yarn run start`
Para correr tests `yarn run test`
Para correr tests con Code Coverage `yarn run coverage`

# Estandar de código
El estandar de codigo utilizado en esta app viene definido con sus reglas en el archivo `.eslintrc.js`.
Se aplican todas las reglas disponibles para JavaScript que provee EsLint, en ciertos archivos se deshabilitan ciertas reglas como `init-declarations, no-process-env, etc...` para evitar problemas que al ser corregidos, afectan la funcionalidad de la app.

# Pendientes
* Vista semanal, inconsistencias al usar librería momentjs para el manejo de fechas
* Manejar colisiones de eventos entre usuarios
