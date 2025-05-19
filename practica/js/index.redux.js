//@ts-check
import { ComplexArticle } from 'classes/Article'
import { simpleFetch } from 'utils/simpleFetch'
import { HttpError } from 'classes/HttpError'
import { INITIAL_STATE, store } from 'store/redux'
/** @import {State, User} from './store/redux.js' */

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
  const botonArticulo = document.getElementById('nuevoArticulo')
  const botonNuevaLista = document.getElementById('nuevaLista')

  formulario?.addEventListener('submit', onFormSubmit)
  campoArticulo?.addEventListener('keyup', onArticleNameKeyUp)
  botonArticulo?.addEventListener('click', onNewArticleClick)
  botonNuevaLista?.addEventListener('click', onNewListClick)

  // Simulate User logged in
  updateSessionStorage({
    user: {
      token: '123456'
    }
  })

  getUsualProducts()
  setUpShoppingList()

  // Set up reactivity
  window.addEventListener('stateChanged', (event) => {
    const customEvent = /** @type {CustomEvent} */(event)
    const changes = customEvent.detail?.changes
    console.log('state changed', changes?.articles)
  })
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
 * Initializes the shopping list element from local storage.
 */
async function setUpShoppingList() {
  const state = getDataFromLocalStorage()
  const data = await getAPIData('http://127.0.0.1:1337/read/articles', 'GET')
  console.log('lectura de datos desde la API del servidor', data)

  state.articles.forEach((/** @type {ComplexArticle} */article) => {
    store.article.create(article, () => {
      addToElementsList(article)
    })
  })
}

/**
 * Retrieves article details from input fields and adds a new article to the shopping list.
 * If the article name is not empty, it creates a ComplexArticle instance with the provided
 * name, quantity, and price, then saves it to the store and adds it to the DOM elements list.
 * Updates local storage with the new state.
 */
async function addToShoppingList() {
  const campoArticulo = document.getElementById('articulo')
  const nombreArticulo = getInputValue(campoArticulo)

  if (nombreArticulo !== '') {
    const campoPrecio = document.getElementById('precio')
    const campoQty = document.getElementById('qty')
    const qtyArticulo = Number(getInputValue(campoQty))
    const precioArticulo = Number(getInputValue(campoPrecio))
    // La propiedad _id se genera en la BBDD
    const nuevoArticulo = new ComplexArticle(undefined, nombreArticulo, qtyArticulo, precioArticulo)

    const payload = new URLSearchParams();
    payload.append('name', nuevoArticulo.name);
    payload.append('qty', String(nuevoArticulo.qty)); // Convert qty to a string
    payload.append('price', String(nuevoArticulo.price)); // Convert price to a string
    payload.append('bought', String(nuevoArticulo.bought)); // Convert bought to a string

    const data = await getAPIData('http://127.0.0.1:1337/create/articles', 'POST', payload)
    console.log('ARTICULO CREADO EN BBDD', nuevoArticulo, data)

    store.article.create(nuevoArticulo, () => {
      setLocalStorageFromStore()
      addToElementsList(nuevoArticulo)
    })
  }
}

/**
 * Añade un nuevo elemento a la lista de la compra
 * @param {ComplexArticle} nuevoArticulo - Nuevo artículo
 */
function addToElementsList(nuevoArticulo) {
  const listaArticulos = document.getElementById('lista')
  const elemento = document.createElement('li')
  const articulo = document.createElement('span')
  const boton = document.createElement('button')

  let elementText = nuevoArticulo.name
  if (nuevoArticulo?.qty > 0) {
    elementText = `${elementText} x ${nuevoArticulo.qty}`
  }
  if (nuevoArticulo?.price > 0) {
    elementText = `${elementText} @ ${nuevoArticulo.price}€`
  }
  articulo.innerText = elementText
  articulo.classList.add('articulo')
  articulo.addEventListener('click', buyArticle.bind(elemento, nuevoArticulo))
  elemento.appendChild(articulo)
  elemento.id = nuevoArticulo._id
  boton.innerText = 'BORRAR'
  boton.addEventListener('click', removeFromShoppingList.bind(boton, nuevoArticulo), { once: true })
  elemento.appendChild(boton)
  if (nuevoArticulo.bought) {
    elemento.classList.add('bought')
  }
  listaArticulos?.appendChild(elemento)
  resetFormState()
}

/**
 * @param {ComplexArticle} articulo - Artículo comprado
 * @this {HTMLElement}
 */
function buyArticle(articulo) {
  const storeArticle = store.article.getById(articulo._id)
  const articuloComprado = {
    ...storeArticle,
    bought: !storeArticle.bought
  }
  store.article.update(articuloComprado, () => {
    setLocalStorageFromStore()
    if (articuloComprado.bought) {
      this.classList.add('bought')
    } else {
      this.classList.remove('bought')
    }
  })
}

/**
 * Elimina un artículo de la lista de la compra
 * @param {ComplexArticle} articulo - Artículo a eliminar
 */
function removeFromShoppingList(articulo) {
  store.article.delete(articulo, () => {
    setLocalStorageFromStore()
    removeFromElementsList(articulo)
  })
}

/**
 * Removes an article from the elements list in the DOM.
 * Iterates over the child nodes of the 'lista' element and removes the node
 * with the matching article ID.
 * @param {Object} articulo - The article object to be removed.
 * @param {string} articulo._id - The ID of the article to be removed.
 */
function removeFromElementsList(articulo) {
  const listaArticulos = document.querySelectorAll('#lista li')
  for (const node of listaArticulos) {
    if (node.id === articulo._id) {
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

  store.article.deleteAll(() => {
    setLocalStorageFromStore()
  })

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
  const articulos = store.article.getAll()
  setInputValue(campoArticulo, '')
  setInputValue(campoQty, '1')
  setInputValue(campoPrecio, '0')
  botonArticulo?.removeAttribute('disabled')
  if (totalLista) {
    let total = 0
    articulos.forEach((/** @type {ComplexArticle} */articulo) => {
      total += articulo.qty * articulo.price
    })
    totalLista.innerText = `${total}€`
  }
}

/**
 * Gets the list of usual products from api/articles.json and fills the <datalist>
 * element with the product titles
 */
function getUsualProducts() {
  const productsURL = 'api/articles.json'
  let headers = new Headers()
  headers.append('Content-Type', 'application/json')
  simpleFetch(productsURL, { headers: headers }).then((listaProductos) => {
    const productos = document.getElementById('productos')
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
export function getInputValue(inputElement) {
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
export function setInputValue(inputElement, value) {
  if (inputElement) {
    /** @type {HTMLInputElement} */(inputElement).value = value
  }
}

/**
 * Retrieves the shopping list data from local storage.
 *
 * @returns {State} Saved state.
 * If no data is found, returns an empty State object.
 */
export function getDataFromLocalStorage() {
  const defaultValue = JSON.stringify(INITIAL_STATE)
  return JSON.parse(localStorage.getItem('shoppingList') || defaultValue)
}

/**
 * Saves the current state of the store in local storage.
 */
function setLocalStorageFromStore() {
  // Remove user data from store before saving
  const storeState = store.getState()
  updateLocalStorage(storeState)
}

/**
 * Saves shopping list on localStorage
 * @param {State} storeValue
 */
export function updateLocalStorage(storeValue) {
  localStorage.setItem('shoppingList', JSON.stringify(storeValue))
}

/**
 * Get data from API
 * @param {string} apiURL
 * @param {string} method
 * @param {any} [data]
 * @returns {Promise<Array<ComplexArticle | User>>}
 */
export async function getAPIData(apiURL, method = 'GET', data) {
  let apiData

  try {
    let headers = new Headers()
    headers.append('Content-Type', 'application/json')
    headers.append('Access-Control-Allow-Origin', '*')
    if (data) {
      headers.append('Content-Length', String(JSON.stringify(data).length))
    }
    // Set Bearer authorization if user is logged in
    if (isUserLoggedIn()) {
      const userData = getDataFromSessionStorage()
      headers.append('Authorization', `Bearer ${userData?.user?.token}`)
    }
    apiData = await simpleFetch(apiURL, {
      // Si la petición tarda demasiado, la abortamos
      signal: AbortSignal.timeout(3000),
      method: method,
      body: data ?? undefined,
      headers: headers
    });
  } catch (/** @type {any | HttpError} */err) {
    if (err.name === 'AbortError') {
      console.error('Fetch abortado');
    }
    if (err instanceof HttpError) {
      if (err.response.status === 404) {
        console.error('Not found');
      }
      if (err.response.status === 500) {
        console.error('Internal server error');
      }
    }
  }

  return apiData
}

/**
 * Checks if there is a user logged in by verifying the presence of a token
 * in the local storage.
 *
 * @returns {boolean} True if the user is logged in, false otherwise.
 */
function isUserLoggedIn() {
  const userData = getDataFromSessionStorage()
  return userData?.user?.token
}

/**
 * Retrieves the shopping list data from session storage.
 *
 * @returns {State} Saved state.
 * If no data is found, returns an empty State object.
 */
function getDataFromSessionStorage() {
  const defaultValue = JSON.stringify(INITIAL_STATE)
  return JSON.parse(sessionStorage.getItem('shoppingList') || defaultValue)
}

/**
 * Saves shopping list on sessionStorage
 * @param {State} storeValue
 */
function updateSessionStorage(storeValue) {
  sessionStorage.setItem('shoppingList', JSON.stringify(storeValue))
}