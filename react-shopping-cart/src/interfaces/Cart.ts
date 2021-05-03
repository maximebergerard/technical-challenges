interface CartProduct {
  productId: number,
  quantity: number,
}

export interface Cart {
  products: CartProduct[],
  taxes: Array<{
    name: number,
    value: number,
  }>,
  totalAmountIncludingTaxes: number,
}