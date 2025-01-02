// Bussiness Object: Shopping List
import { addStringValidation } from '../decorators/validate.js'

export class ShoppingList {
  // Private fields
  #basket
  #store
  // Patrón: Observer
  #observers = []

  constructor(store) {
    this.#store = store
    this._syncStoreData()
    // Patrón: Decorator
    addStringValidation(this)
  }

  get basket() {
    return this.#basket
  }

  // Private Methods
  _addToDataStore(item) {
    this.#store.addItem(item)
    // Patrón: Observer
    this._notifySubscriptors('add', item)
  }

  _syncStoreData() {
    this.#basket = this.#store.items
  }

  _resetDataStore() {
    this.#store.reset()
    this._syncStoreData()
  }

  // Patrón: Observer
  _notifySubscriptors(eventName, eventData) {
    this.#observers.forEach((subscriptor) => {
      if (subscriptor.eventName === eventName) {
        subscriptor.callback(eventData)
      }
    })
  }

  // Publich methods
  addItem(newItem) {
    // Patrón: Decorator
    if (this.validate.isString(newItem.name, 'Article name')) {
        this._addToDataStore(newItem)
        return true
    } else {
      return false
    }
  }

  emptyBasket() {
    this._resetDataStore()
  }

  // Patrón: Observer
  subscribe(subscriptor, eventName, callback) {
    this.#observers.push({
      subscriptor,
      eventName,
      callback
    })
  }

  // Patrón: Observer
  /**
   * Ejemplo de uso
   * listaCompra.get().unsubscribe('formulario', 'add')s
   */
  unsubscribe(subscriptor, eventName) {
    this.#observers.find((observer, index) => {
      if (observer.subscriptor === subscriptor && observer.eventName === eventName) {
        this.#observers.splice(index, 1)
      }
    })
  }
}