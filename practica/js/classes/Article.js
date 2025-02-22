//@ts-check

/**
 * @module Article
 */

export class SimpleArticle {
  /**
   * @param {string} name
   */
  constructor(name) {
    this.name = name
  }
}

export class ComplexArticle extends SimpleArticle {
  /**
   * @param {string} _id
   * @param {string} name
   * @param {number} qty
   * @param {number} price
   * */
  constructor(_id = '', name, qty = 1, price = 0) {
    super(name)
    this._id = _id
    this.qty = Number(qty)
    this.price = Number(price)
  }
}