import { ARTICLE_TYPES, ArticleFactory, articuloLeche } from "./classes/Article.js"
import { ShoppingList } from "./classes/ShoppingList.js"
import { LocalStore } from "./classes/LocalStore.js"

// Patrón: Factory
const fabricaArticulos = new ArticleFactory
// Patrón Singleton (IEEF)
let listaCompra = (function() {
  let shoppingListInstance

  return {
    get: () => {
      if (!shoppingListInstance) {
        shoppingListInstance = create()
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
  // Patrón: Prototype
  const ejemploPrototipoLeche = Object.create(articuloLeche)
  console.log(ejemploPrototipoLeche,
    ejemploPrototipoLeche.name,
    ejemploPrototipoLeche.qty,
    ejemploPrototipoLeche.price)
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
    const nuevoArticulo = fabricaArticulos.createArticle(ARTICLE_TYPES.SIMPLE, nombreArticulo)
    carrito.addItem(nuevoArticulo)
    addToElementsList(nuevoArticulo.name)
  }
}

function addToElementsList(nuevoArticulo){
  const listaArticulos = document.getElementById('lista')
  const elemento = document.createElement('li')
  elemento.innerText = nuevoArticulo
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
  campoArticulo.value = ''
  botonArticulo.setAttribute('disabled', undefined)
}
