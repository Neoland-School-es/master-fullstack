//@ts-check
// Bussiness Object: Shopping List
/**
 * @module ShoppingList
 */
import { addStringValidation } from 'decorators/validate'
/** @import {ComplexArticle} from 'classes/Article.js' */
/** @import {LocalStore} from 'LocalStore.js' */

/**
 * @typedef {Object} Subscriptor
 * @property {object} subscriptor
 * @property {string} eventName
 * @property {function} callback
 */

export class ShoppingList {
  // Private fields
  /** @type {ComplexArticle[]} */
  #basket
  /** @type {LocalStore} */
  #store
  // Patrón: Observer
  /** @type {Array<Subscriptor>} */
  #observers

  /**
   * @description Constructor de la clase ShoppingList
   * @param {LocalStore} store - Almacén local de datos
   */
  constructor(store) {
    /** @private */
    this.#basket = []
    /** @private */
    this.#store = store
    /** @private */
    this.#observers = []
    this._syncStoreData()
    // Patrón: Decorator
    addStringValidation(this)
  }

  get basket() {
    return this.#basket
  }

  // Private Methods

  /**
   * Adds an item to the data store
   * @param {ComplexArticle} item - The item to be added to the store
   * @private
   */
  _addToDataStore(item) {
    this.#store.addItem(item)
    // Patrón: Observer
    this._notifySubscriptors('add', item)
  }

  /**
   * Removes an item from the data store
   * @param {ComplexArticle} item - The item to be removed from the store
   * @private
   */
  _removeFromDataStore(item) {
    this.#store.removeItem(item)
    // Patrón: Observer
    this._notifySubscriptors('remove', item)
  }

  /**
   * Synchronizes the data store with the internal basket.
   *
   * Whenever the data store changes, this method should be called to update the
   * internal basket.
   * @private
   */
  _syncStoreData() {
    this.#basket = this.#store.items
  }

  /**
   * Resets the data store and synchronizes the internal basket.
   *
   * This method resets the data store by calling the `reset()` method on the
   * underlying store object. After resetting the store, it then calls the
   * `_syncStoreData()` method to update the internal basket with the new data
   * from the store.
   * @private
   */
  _resetDataStore() {
    this.#store.reset()
    this._syncStoreData()
  }

  // Patrón: Observer

/**
 * Notifies all subscribed observers about an event.
 *
 * Iterates over the list of observers and invokes the callback function
 * for those observers that have subscribed to the specified event name.
 *
 * @param {string} eventName - The name of the event to notify observers about.
 * @param {any} eventData - The data to be passed to the observer callback function.
 * @private
 */
  _notifySubscriptors(eventName, eventData) {
    this.#observers.forEach((subscriptor) => {
      if (subscriptor.eventName === eventName) {
        subscriptor.callback(eventData)
      }
    })
  }

  // Publich methods

  /**
   * Adds an item to the shopping list.
   *
   * @param {ComplexArticle} newItem - The item to be added to the list.
   * @returns {boolean} true if the item was added, false if the item was not added.
   */
  addItem(newItem) {
    // Patrón: Decorator
    // @ts-ignore
    if (this.validate.isString(newItem.name, 'Article name')) {
      const timestamp = new Date()
      newItem.id = `${newItem.name}_${String(timestamp.getTime())}`
      newItem.qty = Number(newItem?.qty)
      newItem.price = Number(newItem?.price)
      this._addToDataStore(newItem)
      return true
    } else {
      return false
    }
  }

/**
 * Removes an item from the shopping list.
 *
 * @param {ComplexArticle} item - The item to be removed from the list.
 * @throws {TypeError} Throws an error if the item ID is not a valid string.
 */
  removeItem(item) {
    if (typeof item.id === 'string') {
      this._removeFromDataStore(item)
    } else {
      try {
        throw new TypeError(`Invalid item ID`)
      } catch (err) {
        const typedError = /** @type {Error} */(err)
        console.error(typedError.name, typedError.message)
        if (err instanceof TypeError) console.log(err.stack)
      }
    }
  }

  /**
   * Empties the shopping list.
   *
   * Resets the list of items in the shopping list to its initial state.
   */
  emptyBasket() {
    this._resetDataStore()
  }

  // Patrón: Observer

  /**
   * Subscribes to an event emitted by the shopping list.
   *
   * Iterates over the list of observers and invokes the callback function
   * for those observers that have subscribed to the specified event name.
   *
   * @param {object} subscriptor - The object that will receive the event.
   * @param {string} eventName - The name of the event to subscribe to.
   * @param {function} callback - The function to be invoked when the event is emitted.
   */
  subscribe(subscriptor, eventName, callback) {
    this.#observers.push({
      subscriptor,
      eventName,
      callback
    })
  }

  // Patrón: Observer
  /**
   * Unsubscribes from an event emitted by the shopping list.
   *
   * Removes the observer that matches the specified parameters from the list
   * of observers.
   *
   * @param {object} subscriptor - The object that was subscribed to the event.
   * @param {string} eventName - The name of the event to unsubscribe from.
   */
  unsubscribe(subscriptor, eventName) {
    this.#observers.find((observer, index) => {
      if (observer.subscriptor === subscriptor && observer.eventName === eventName) {
        this.#observers.splice(index, 1)
      }
    })
  }
}

// Mixin
export const withTotalMixin = {
/**
 * Calculates the total cost of all items in the shopping basket.
 *
 * Iterates over each item in the basket and computes the total cost by
 * multiplying the price and quantity of each item, and then summing
 * up these values.
 *
 * @returns {number} The total cost of all items in the basket.
 */
  getTotal() {
    let total = 0
    // @ts-ignore
    this.basket.forEach(item => total += item.price * item.qty)
    return total
  }
}