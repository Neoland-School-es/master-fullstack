//@ts-check
// Local Storage based class
/**
 * @module LocalStore
 */
/** @import {ComplexArticle} from 'classes/Article.js' */
export class LocalStore {
  // Private fields
  /** @type {string} */
  #name
  /** @type {Array<ComplexArticle>} */
  #items

  /**
   * @param {string} storeName Name of the store
   * @description Constructor to create a LocalStore instance
   * @description It gets the data from LocalStorage and saves it in the #items field
   */

  constructor(storeName) {
    this.#name = storeName
    this.#items = this._getParsedDataFromLocalStorage(this.#name)
  }

  get items() {
    return this.#items
  }

  // Private Methods
  /**
   * @description Gets the data from LocalStorage
   * @param {string} dataSet
   * @returns {Array<ComplexArticle>}
   */
  _getParsedDataFromLocalStorage(dataSet) {
    const data = window.localStorage.getItem(dataSet) || '[]'
    return JSON.parse(data)
  }

  /**
   * @description Stores the provided data set into local storage under the store's name.
   * @param {Array<ComplexArticle>} dataSet - The data to be serialized and stored in local storage.
   */

  _setDataToLocalStorage(dataSet) {
    window.localStorage.setItem(this.#name, JSON.stringify(dataSet))
  }

  // Public Methods
  /**
   * Adds an item to the local store.
   *
   * @param {ComplexArticle} item - The item to be added to the store.
   */
  addItem(item) {
    this.#items.push(item)
    this._setDataToLocalStorage(this.#items)
  }

  /**
   * Removes an item from the local store based on its ID.
   *
   * @param {ComplexArticle} item - The item to be removed, identified by its ID.
   * @throws Will throw an error if the item does not exist in the store.
   */
  removeItem(item) {
    const index = this.#items.findIndex(loopItem => /** @type {ComplexArticle} */(loopItem).id === item.id)
    this.#items.splice(index, 1)
    this._setDataToLocalStorage(this.#items)
  }

  /**
   * Resets the local store by clearing all items.
   *
   * This method empties the #items array and updates the local storage to reflect the cleared state.
   */
  reset() {
    this.#items = []
    this._setDataToLocalStorage(this.#items)
  }
}