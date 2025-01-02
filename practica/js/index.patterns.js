import { ARTICLE_TYPES, ArticleFactory, articuloLeche } from "./classes/Article.js"
import { ShoppingList } from "./classes/ShoppingList.js"
import { LocalStore } from "./classes/LocalStore.js"
import { logBasket } from './decorators/log.js'

// Patrón: Factory
const fabricaArticulos = new ArticleFactory
// Patrón: Singleton (IEEF)
let listaCompra = (function() {
  let shoppingListInstance

  return {
    get: () => {
      if (!shoppingListInstance) {
        // Patrón: Decorator
        shoppingListInstance = logBasket(create())
      }
      return shoppingListInstance
    }
  }

  function create() {
    // Aquí podemos añadir los métodos y propiedades particulares de la instancia
    const dataStore = new LocalStore('lista-compra')
    return new ShoppingList(dataStore)
  }
})()

document.addEventListener('DOMContentLoaded', onDOMContentLoaded)

function onDOMContentLoaded() {
  const formulario = document.getElementById('formulario')
  const campoArticulo = document.getElementById('articulo')
  const botonArticulo = document.getElementById('nuevoArticulo')
  const botonNuevaLista = document.getElementById('nuevaLista')

  formulario.addEventListener('submit', onFormSubmit)
  campoArticulo.addEventListener('keyup', onInputKeyUp)
  botonArticulo.addEventListener('click', onNewArticleClick)
  botonNuevaLista.addEventListener('click', onNewListClick)

  loadShoppingList()
  // Patrón: Observer
  listaCompra.get().subscribe('formulario', 'add', addToElementsList)
}

function onFormSubmit(e) {
  e.preventDefault()
}

function onInputKeyUp(e) {
  e.stopPropagation()
  const botonArticulo = document.getElementById('nuevoArticulo')

  if (e.code === 'Enter') {
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
    })
    botonArticulo.dispatchEvent(clickEvent)
    return
  }

  if (this.value !== '') {
    botonArticulo.removeAttribute('disabled')
  } else {
    botonArticulo.setAttribute('disabled', undefined)
  }
}

function onNewArticleClick(e) {
  e.stopPropagation()
  addToShoppingList()
}

function onNewListClick(e) {
  e.stopPropagation()
  resetShoppingList()
}

function loadShoppingList() {
  const carrito = listaCompra.get()
  if (carrito.basket.length > 0){
    for (let i = 0; i < carrito.basket.length; i++){
      addToElementsList(carrito.basket[i].name)
    }
  }
}

function addToShoppingList(){
  const campoArticulo = document.getElementById('articulo')
  const nombreArticulo = campoArticulo.value
  const carrito = listaCompra.get()

  if (nombreArticulo !== '') {
    // Patrón: Adapter
    const nuevoArticulo = fabricaArticulos.createTranslatedArticle(ARTICLE_TYPES.SIMPLE, nombreArticulo)
    // Patrón: Observer
    carrito.addItem(nuevoArticulo)
  }
}

function addToElementsList(nuevoArticulo){
  const listaArticulos = document.getElementById('lista')
  const elemento = document.createElement('li')
  // Patrón: Observer
  elemento.innerText = nuevoArticulo.name
  listaArticulos.appendChild(elemento)
  resetFormState()
}

function resetShoppingList() {
  const listaArticulos = document.getElementById('lista')
  const carrito = listaCompra.get()

  carrito.emptyBasket()

  for (let i = listaArticulos.childNodes.length - 1; i > 1; i--){
    listaArticulos.removeChild(listaArticulos.lastChild)
  }
  resetFormState()
}

function resetFormState(){
  const campoArticulo = document.getElementById('articulo')
  const botonArticulo = document.getElementById('nuevoArticulo')
  const carrito = listaCompra.get()
  campoArticulo.value = ''
  botonArticulo.setAttribute('disabled', undefined)
  // Patrón: Decorator
  carrito.log()
}