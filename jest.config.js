// @ts-check

/** @type {import('jest').Config} */
const config = {
  verbose: true,
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^classes\/(.*)': '<rootDir>/practica/js/classes/$1.js',
    '^decorators\/(.*)': '<rootDir>/practica/js/decorators/$1.js',
    '^utils\/(.*)': '<rootDir>/practica/js/utils/$1.js',
    '^store\/(.*)': '<rootDir>/practica/js/store/$1.js',
  }
}

export default config