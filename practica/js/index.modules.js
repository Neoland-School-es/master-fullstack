//@ts-check
import { ARTICLE_TYPES } from 'classes/Article'
import { simpleFetch } from 'utils/simpleFetch'

/** @import {ComplexArticle, ArticleFactory} from 'classes/Article.js' */
/** @import {ShoppingList} from 'classes/ShoppingList.js' */
/**
 * @typedef {Object} ListaCompra
 * @property {function} get
 */

/** @type {ArticleFactory} */
let fabricaArticulos
// Dynamic import:
import('classes/Article').then((ArticleModule) => {
  // Patrón: Factory
  fabricaArticulos = new ArticleModule.ArticleFactory
});
/** @type {ListaCompra} */
let listaCompra

document.addEventListener('DOMContentLoaded', onDOMContentLoaded)

/**
 * Event handler for DOMContentLoaded event.
 * Initializes the shopping list and fetches all products in the database.
 * Also sets up event listeners for the form and buttons.
 * @listens DOMContentLoaded
 */
function onDOMContentLoaded() {
  const formulario = document.getElementById('formulario')
  const campoArticulo = document.getElementById('articulo')
  const campoFiltro = document.getElementById('filtro')
  const botonArticulo = document.getElementById('nuevoArticulo')
  const botonNuevaLista = document.getElementById('nuevaLista')

  formulario?.addEventListener('submit', onFormSubmit)
  campoArticulo?.addEventListener('keyup', onArticleNameKeyUp)
  campoFiltro?.addEventListener('keyup', onFilterKeyUp)
  botonArticulo?.addEventListener('click', onNewArticleClick)
  botonNuevaLista?.addEventListener('click', onNewListClick)

  setUpShoppingList()
  getProducts()
}

/**
 * Prevents the default form submission event.
 * @param {Event} e - The DOM event being handled.
 * @listens form#formulario.submit
 */
function onFormSubmit(e) {
  e.preventDefault()
}

/**
 * Handles the keyup event on the article name input field.
 * Enables or disables the 'nuevoArticulo' button based on input value.
 * Triggers a click event on the button if the Enter key is pressed.
 * @param {KeyboardEvent} e - The keyup event object.
 */

function onArticleNameKeyUp(e) {
  e.stopPropagation()
  const campoArticulo = document.getElementById('articulo')
  const botonArticulo = document.getElementById('nuevoArticulo')

  if (e.code === 'Enter') {
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
    })
    botonArticulo?.dispatchEvent(clickEvent)
    return
  }

  if (getInputValue(campoArticulo) !== '') {
    botonArticulo?.removeAttribute('disabled')
  } else {
    botonArticulo?.setAttribute('disabled', 'true')
  }
}

/**
 * Handles the keyup event on the article filter input field.
 * Hides or shows the shopping list items based on the filter text.
 * @param {KeyboardEvent} e - The keyup event object.
 * @listens input#filtro.keyup
 */
function onFilterKeyUp(e) {
  e.stopPropagation()
  const campoFiltro = document.getElementById('filtro')
  const listaArticulos = document.querySelectorAll('#lista li')
  const textoFiltro = getInputValue(campoFiltro)

  for (const node of listaArticulos) {
    if (textoFiltro !== '' && node?.textContent?.includes(textoFiltro)) {
      node.setAttribute('hidden', 'true')
    } else {
      node.removeAttribute('hidden')
    }
  }
  // }
}

/**
 * Handles the click event on the 'nuevoArticulo' button.
 * Adds a new article to the shopping list.
 * @param {MouseEvent} e - The click event object.
 * @listens button#nuevoArticulo.click
 */
function onNewArticleClick(e) {
  e.stopPropagation()
  addToShoppingList()
}

/**
 * Handles the click event on the 'nuevaLista' button.
 * Resets the shopping list.
 * @param {MouseEvent} e - The click event object.
 * @listens button#nuevaLista.click
 */
function onNewListClick(e) {
  e.stopPropagation()
  resetShoppingList()
}

/**
 * Loads the shopping list from local storage and adds it to the DOM.
 */
function loadShoppingList() {
  const carrito = listaCompra.get()
  if (carrito.basket.length > 0){
    for (let i = 0; i < carrito.basket.length; i++){
      addToElementsList(carrito.basket[i])
    }
  }
  resetFormState()
}

/**
 * Initializes the shopping list and sets up event listeners for the form and buttons.
 */
function setUpShoppingList() {
  // Dynamic import:
  Promise.all([
    import('classes/ShoppingList'),
    import('classes/LocalStore'),
    import('decorators/log')
  ]).then((Modules) => {
    const ShoppingList = Modules[0].ShoppingList
    const withTotalMixin = Modules[0].withTotalMixin
    const LocalStore = Modules[1].LocalStore
    const logBasket = Modules[2].logBasket

    // Patrón: Singleton (IEEF)
    listaCompra = (function() {
      /** @type {ShoppingList} */
      let shoppingListInstance

      return {
        get: () => {
          if (!shoppingListInstance) {
            // Patrón: Decorator
            shoppingListInstance = logBasket(create())
          }
          return shoppingListInstance
        },
        log: () => {
          if (shoppingListInstance) {
            /** @type {any} */(shoppingListInstance).log()
          }
        }
      }

      /**
       * Creates a new instance of the ShoppingList class.
       * @returns {ShoppingList}
       */
      function create() {
        // Aquí podemos añadir los métodos y propiedades particulares de la instancia
        const dataStore = new LocalStore('lista-compra')
        // Mixin
        Object.assign(ShoppingList.prototype, withTotalMixin)
        return new ShoppingList(dataStore)
      }
    })()
    loadShoppingList()
    // Patrón: Observer
    listaCompra.get().subscribe('formulario', 'add', addToElementsList)
    listaCompra.get().subscribe('formulario', 'remove', removeFromElementsList)
  })
}

function addToShoppingList() {
  const campoArticulo = document.getElementById('articulo')
  const nombreArticulo = getInputValue(campoArticulo)
  const carrito = listaCompra.get()

  if (nombreArticulo !== '') {
    const campoPrecio = document.getElementById('precio')
    const campoQty = document.getElementById('qty')
    const qtyArticulo = Number(getInputValue(campoQty)) || 1
    const precioArticulo = Number(getInputValue(campoPrecio)) || 0
    // Patrón: Adapter
    const nuevoArticulo = fabricaArticulos.createTranslatedArticle(ARTICLE_TYPES.COMPLEX,
        nombreArticulo,
        qtyArticulo,
        precioArticulo)
    // Patrón: Observer
    carrito.addItem(nuevoArticulo)
  }
}

/**
 * Añade un nuevo elemento a la lista de la compra
 * @param {ComplexArticle} nuevoArticulo - Nuevo artículo
 */
function addToElementsList(nuevoArticulo) {
  const listaArticulos = document.getElementById('lista')
  const elemento = document.createElement('li')
  const boton = document.createElement('button')
  // Patrón: Observer
  let elementText = nuevoArticulo.name
  if (nuevoArticulo?.qty > 0) {
    elementText = `${elementText} x ${nuevoArticulo.qty}`
  }
  if (nuevoArticulo?.price > 0) {
    elementText = `${elementText} @ ${nuevoArticulo.price}€`
  }
  elemento.innerText = elementText
  elemento.id = nuevoArticulo.id
  boton.innerText = 'BORRAR'
  boton.addEventListener('click', removeFromShoppingList.bind(boton, nuevoArticulo), { once: true })
  elemento.appendChild(boton)
  listaArticulos?.appendChild(elemento)
  resetFormState()
}

/**
 * Elimina un artículo de la lista de la compra
 * @param {ComplexArticle} articulo - Artículo a eliminar
 */
function removeFromShoppingList(articulo) {
  const carrito = listaCompra.get()
  carrito.removeItem(articulo)
}

/**
 * Removes an article from the elements list in the DOM.
 * Iterates over the child nodes of the 'lista' element and removes the node
 * with the matching article ID.
 * @param {Object} articulo - The article object to be removed.
 * @param {string} articulo.id - The ID of the article to be removed.
 */

function removeFromElementsList(articulo) {
  const listaArticulos = document.querySelectorAll('#lista li')
  console.log('remove from elements list', articulo.id)
  for (const node of listaArticulos) {
    if (node.id === articulo.id) {
      node.remove()
    }
  }
}

/**
 * Resets the shopping list.
 * Removes all elements from the shopping list and empties the basket.
 */
function resetShoppingList() {
  const listaArticulos = document.querySelectorAll('#lista li')
  const carrito = listaCompra.get()

  carrito.emptyBasket()

  for (const node of listaArticulos) {
    node.remove()
  }
  resetFormState()
}

/**
 * Resets the shopping list form to its initial state.
 */
function resetFormState() {
  const campoArticulo = document.getElementById('articulo')
  const campoQty = document.getElementById('qty')
  const campoPrecio = document.getElementById('precio')
  const botonArticulo = document.getElementById('nuevoArticulo')
  const totalLista = document.getElementById('total')
  const carrito = listaCompra.get()
  setInputValue(campoArticulo, '')
  setInputValue(campoQty, '1')
  setInputValue(campoPrecio, '0')
  botonArticulo?.removeAttribute('disabled')
  if (totalLista) {
    totalLista.innerText = `${carrito.getTotal()}€`
  }
  // Patrón: Decorator
  carrito.log()
}

/**
 * Gets the list of products from api/articles.json and fills the <datalist>
 * element with the product titles
 */
function getProducts() {
  const productsURL = 'api/articles.json'
  simpleFetch(productsURL).then((listaProductos) => {
    const productos = document.getElementById('productos')
    console.log(listaProductos)
    listaProductos.forEach((/** @type {ComplexArticle} */product) => {
      const opcion = document.createElement('option')
      opcion.value = product.name
      productos?.appendChild(opcion)
    })
  })
}

/**
 * Retrieves the value from the specified input element.
 * @param {HTMLElement | null} inputElement - The input element from which to get the value.
 * @returns {string} The value of the input element, or an empty string if the element is null.
 */
function getInputValue(inputElement) {
  if (inputElement) {
    return /** @type {HTMLInputElement} */(inputElement).value
  } else {
    return ''
  }
}

/**
 * Sets the value of the specified input element.
 * @param {HTMLElement | null} inputElement - The input element on which to set the value.
 * @param {string} value - The value to set on the input element.
 */
function setInputValue(inputElement, value) {
  if (inputElement) {
    /** @type {HTMLInputElement} */(inputElement).value = value
  }
}