# JavaScript Avanzado

Introducción a la segunda parte del Máster

## Dev Tools de Google chrome

* [El panel de código fuente](https://developer.chrome.com/docs/devtools/sources)

## Herramientas de Linteo y Automatización

Necesitarás tener instalados los plugins de VS Code que tienes en el [README.md](../README.md#programas-necesarios) del proyecto.

Adicionalmente usaremos estas librerías más adelante, cuando hayamos [instalado NodeJS](6%20-%20NodeJS.md):

* [ESLint](https://eslint.org/) ```npm init @eslint/config@latest```
* [StyleLint](https://stylelint.io/) ```npm init stylelint```
* [Commitlint](https://commitlint.js.org/) ```npm install --save-dev @commitlint/{cli,config-conventional}```

## [Submódulos de Git](https://git-scm.com/book/en/v2/Git-Tools-Submodules)

Primero entras en la carpeta de tu proyecto principal desde el terminal, donde quieres que se clone el submódulo, y a continuación:

```bash
git submodule add [--name <submodule-name>] <repository> [<submodule-path>]
```

Luego hay que asegurarse de que se creó correctamente el archivo ```/.gitmodules```, de otro modo hay que crearlo a mano. Asegúrate de que haya un espacio en blanco entre los símbolos ```=``` y el texto por delante y por detrás de éstos:

```yaml
[submodule "submodule-name"]
path = submodule-path
url = https://github.com/user/repository.git
```

Para eliminar un submódulo usa:

```bash
git submodule deinit -f submodule-path
rm -rf .git/modules/submodule-name
git rm -f submodule-path
```

Cuando clones un proyecto con submódulos, has de usar la opción:

```bash
git clone --recurse-submodules https://github.com/user/repository.git
```

Si los submódulos no se están descargando al hacer checkout del proyecto, tendrás que lanzar un fetch recursivo:

```bash
git submodule update --init --recursive
```

Otras opciones también son (según la versión de Git):

```bash
git submodule update --recursive --remote
git submodule update --recursive
git pull --recurse-submodules
```

Recuerda que cada submódulo tiene sus propios git hooks, así que no le afectan los del repositorio donde se encuentra y tendrás que configurar su propio _lintstaged_ si quieres integrar herramientas de este tipo dentro de los submódulos.

Es muy probable que necesites habilitar las opciones de ejecución recursiva en tus comandos, revisa la documentación de tu _CI_ específico para más información.

Para más información, mejor [leer la referencia](https://git-scm.com/docs/gitmodules).

## [Principios de programación SOLID](https://en.wikipedia.org/wiki/SOLID)

* **Single responsibility principle:** cada clase debería tener una única responsabilidad
* **Open–closed principle:** las entidades deberían ser abiertas a la hora de poder extenderlas, pero cerradas a la hora de modificarlas
* **Liskov substitution principle:** el uso de métodos o referencias de una clase base no de cambiar al ser usadas desde una clase derivada
* **Interface segregation principle:** eliminación de dependencias innecesarias
* **Dependency inversion principle:** los estados dependen de abstracciones, no de concreciones

## [Patrones de diseño en JS](https://refactoring.guru/design-patterns)

* Constructores
* Singleton

Lecturas recomendadas:

* [Patrones de arquitectura y diseño en JavaScript](https://medium.com/@hjkmines/javascript-design-and-architectural-patterns-cfa900c6fe41)
* [JavaScript a escala grande](https://addyosmani.com/largescalejavascript/)
* [Arquitectura orientada al dominio](https://dev.to/itswillt/a-different-approach-to-frontend-architecture-38d4)

## Programación orientada a objetos

* Prototipos
* Call, Apply, Bind
* Herencia
* Mixin

## Modelo Vista Controlador

### Inyección de dependencias

### Módulos

### Importación dinámica de módulos

## Conceptos avanzados de JavaScript

### Closures

### Namespaces

### Currying

### Context

### Control de timeouts en peticiones XHR con abort

### Expresiones regulares

## Tipado de variables

### Tipado nativo de JavaScript

### Tipado con Typescript

### Validación de tipados con JSDOC

## Reactividad (signals)

## REDUX Store

## Web Sockets

## Web Workers

## Testeo unitario y End to End

* Jest, Mocha, Chai
* Cypress, Playwright, Vitest
* Node Testing Library

## Aplicaciones Progresivas (PWA)

* APIs del navegador
* Manifest .appcache
