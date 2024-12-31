// Patrón: Factory
class SimpleArticle {
  constructor(name) {
    this.name = name
  }
}
// Herencia
class ComplexArticle extends SimpleArticle {
  constructor(name, qty, price) {
    super(name)
    this.qty = qty
    this.price = price
  }
}
// Patrón: Prototype
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
  createArticle(type, name, qty, price) {
    switch(type) {
      case ARTICLE_TYPES.COMPLEX:
        return new ComplexArticle(name, qty, price)
      case ARTICLE_TYPES.SIMPLE:
      default:
        return new SimpleArticle(name)
    }
  }
}