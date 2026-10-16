# Constitución y Libertad — Panamá

Prototipo web estático para explorar relaciones entre garantías constitucionales, niveles de servicios públicos, ingresos, gasto y eficiencia presupuestaria. Pensado como punto de partida para un proyecto ciudadano de validación de un anteproyecto constitucional.

## Qué incluye

- Controles deslizantes para libertad económica, garantías civiles, pluralismo cultural, salud, seguridad pública, educación, esfuerzo tributario y eficiencia del gasto.
- Balance simulado de ingresos y gastos.
- Desglose visual de asignaciones presupuestarias.
- Lista de validación constitucional.
- Exportación del escenario a JSON y copia de un resumen.
- Enlaces a fuentes oficiales para revisar el texto constitucional vigente.

## Importante: qué NO es

- No es un modelo fiscal oficial de Panamá.
- Las “unidades presupuestarias” son ilustrativas; no representan balboas, porcentajes del PIB ni el presupuesto estatal.
- Los índices de libertad son indicadores de escenario, no mediciones científicas ni rankings de países.
- No es asesoría jurídica y no determina si una disposición es constitucional.
- Los derechos fundamentales no deben tratarse como variables que se puedan apagar a cambio de impuestos bajos o servicios más altos. El simulador separa garantías básicas de niveles de prestación y de supuestos presupuestarios.

## Ejecutar localmente

No requiere instalar dependencias.

1. Descarga o clona el repositorio.
2. Abre `index.html` en un navegador moderno.

También se puede publicar con GitHub Pages:
1. Sube estos archivos a la raíz de un repositorio.
2. En GitHub abre **Settings → Pages**.
3. Selecciona la rama principal y la carpeta raíz (`/root`) y guarda.
4. GitHub Pages publicará el sitio estático cuando termine el despliegue.

Los nombres exactos de las opciones de GitHub pueden cambiar.

## Archivos

- `index.html`: estructura de la aplicación.
- `styles.css`: diseño adaptable a móvil y escritorio.
- `app.js`: modelo, cálculos, controles y exportación.
- `data/presupuesto-demo.json`: parámetros de ejemplo y documentación de los supuestos.
- `LICENSE`: licencia MIT.

## Modelo actual

La aplicación utiliza un modelo deliberadamente simple:

- Ingresos simulados: `75 + (esfuerzo tributario × 0.5)` unidades.
- El gasto de salud, seguridad y educación varía con el nivel seleccionado.
- La eficiencia reduce parte de la carga administrativa y una fracción de infraestructura/protección social.
- El índice ilustrativo de libertades combina libertad económica (40%), garantías civiles (35%) y libertad cultural/educativa (25%).

Estas fórmulas son ejemplos de interfaz, no estimaciones empíricas. Antes de cualquier uso público serio, deben reemplazarse por un modelo documentado con datos oficiales de ingresos, ejecución presupuestaria, deuda, población y costes unitarios.

## Base constitucional para revisión

La Constitución vigente publicada por el Tribunal Electoral es la referencia inicial:
https://constitucion.te.gob.pa/constitucion-vigente/

Artículos y títulos que requieren revisión jurídica, entre otros:
- Arts. 19–20: igualdad y régimen de personas extranjeras.
- Arts. 37–40: expresión, reunión, asociación y profesiones.
- Arts. 47–52: propiedad, expropiación y legalidad tributaria.
- Arts. 64–75: trabajo.
- Arts. 109–121: salud, seguridad social y ambiente.
- Arts. 257–281: bienes del Estado, hacienda pública, presupuesto y control.
- Arts. 282–292: economía nacional.

La lista no es exhaustiva. Se debe verificar el texto consolidado y las reformas vigentes con profesionales del derecho panameño.

## Siguientes mejoras recomendadas

1. Importar datos oficiales del presupuesto, ingresos tributarios y deuda.
2. Separar gasto corriente, inversión, transferencias y servicio de deuda.
3. Añadir escenarios de varios años y proyecciones de población.
4. Documentar fórmulas y fuentes en `docs/modelo-fiscal.md`.
5. Crear una matriz artículo vigente → propuesta → ley de desarrollo → indicador de cumplimiento.
6. Incorporar pruebas automáticas y revisión jurídica independiente.

## Licencia

MIT. Consulta `LICENSE`.
