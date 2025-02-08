//@ts-check
// Model definitions
/**
 * @module Article
 */
import { translate } from 'utils/translate'

// Patrón: Factory
export class SimpleArticle {
  /**
   * @param {string} name
   */
  constructor(name) {
    this.name = name
    this.id = ''
  }
}
// Herencia & Mixin
export class ComplexArticle extends SimpleArticle {
  /**
   * @param {string} name
   * @param {number} qty
   * @param {number} price
   * */
  constructor(name, qty, price) {
    super(name)
    this.qty = qty || 1
    this.price = price || 0
  }
}
// Patrón: Prototype
/**
 * Ejemplo de uso:
 * const ejemploPrototipoLeche = Object.create(articuloLeche)
 * console.log(ejemploPrototipoLeche,
 *   ejemploPrototipoLeche.name,
 *   ejemploPrototipoLeche.qty,
 *   ejemploPrototipoLeche.price)
 */
export const articuloLeche = {
  name: 'leche',
  qty: 12,
  price: 15
}

export const ARTICLE_TYPES = {
  SIMPLE: 'simple',
  COMPLEX: 'complex'
}

export class ArticleFactory {
  /**
   * Crea un artículo
   * @param {string} type
   * @param {string} name
   * @param {number} qty
   * @param {number} price
   * @returns {SimpleArticle | ComplexArticle}
   */
  createArticle(type, name, qty, price) {
    switch(type) {
      case ARTICLE_TYPES.COMPLEX:
        return new ComplexArticle(name, qty, price)
      case ARTICLE_TYPES.SIMPLE:
      default:
        return new SimpleArticle(name)
    }
  }
  // Patrón: Adapter
  /**
   * Crea un artículo con el nombre traducido
   * @param {string} type
   * @param {string} name
   * @param {number} qty
   * @param {number} price
   * @returns {SimpleArticle | ComplexArticle}
   */
  createTranslatedArticle(type, name, qty, price) {
    switch(type) {
      case ARTICLE_TYPES.COMPLEX:
        return translateArticle(new ComplexArticle(name, qty, price))
      case ARTICLE_TYPES.SIMPLE:
      default:
        return translateArticle(new SimpleArticle(name))
    }
  }
}

/**
 * Traduce un artículo
 * @param {SimpleArticle | ComplexArticle} article
 * @returns {SimpleArticle | ComplexArticle}
 */
function translateArticle(article) {
  return {
    ...article,
    // Patrón: Command Pattern
    name: translate.toEnglish(article.name)
  }
}