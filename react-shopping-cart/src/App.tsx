import React, { useState } from 'react'
import {
  Page,
  Layout,
  Card,
  List,
} from '@shopify/polaris'
import { ProductCard } from './components/ProductCard'

import { Product } from "./interfaces/Product"

const App: React.FC = () => {
  const products: Product[] = [
    {
      id: 0,
      name: 'Product A',
      description: 'Lorem ipsum dolor sit, amet consectetur',
      price: 12,
      tax: 20,
    },
    {
      id: 1,
      name: 'Product B',
      description: 'Lorem ipsum dolor sit, amet consectetur',
      price: 13,
      tax: 5.5,
    },
    {
      id: 2,
      name: 'Product C',
      description: 'Lorem ipsum dolor sit, amet consectetur',
      price: 15,
      tax: 5.5,
    },
  ]

  // const taxes: Array<{ name: number, value: number, }> = [{ name: 20, value: 4 }]
  const [taxes, setTaxes] = useState<Array<{ name: number, value: number, }>>([])

  const [cart, setCart] = useState<Product[]>([])

  // Total of products prices in cart + total of taxes
  const totalAmountIncludingTaxes = cart.reduce((total, { price = 0 }) => total + price, 0) + taxes.reduce((total, { value = 0 }) => total + value, 0)

  const addToBasket = (item: Product) => {
    setCart([...cart, item])
    addTax(item)
  }

  const removeFromBasket = (productId: number) => {
    const myCart = [...cart]
    // Looking for the first index of my specific product clicked on
    const indexOfItemToRemove = cart.findIndex((cartItem) => cartItem.id === productId);
    // Then removing this item
    myCart.splice(indexOfItemToRemove, 1)

    setCart(myCart)
  }

  const quantityInBasket = (productId: number) => {
    // Getting an array of all my products pass in parameters, length = numbers of products
    return cart.filter(product => productId === product.id).length
  }

  const addTax = (item: Product) => {
    const myTax = [...taxes]
    // Find if the tax already exist
    const index = myTax.findIndex(tax => tax.name === item.tax);

    if (index !== -1) {
      // Add the current value to the previous one
      const updateTax = Math.round((item.price * item.tax / 100 + myTax[index].value) * 100) / 100
      myTax[index].value = updateTax

      setTaxes(myTax)
    } else {
      setTaxes([...taxes, {
        name: item.tax,
        value: item.price * item.tax / 100
      }])
    }
  }

  const removeTax = (item: Product) => {
    const myTax = [...taxes]

    const index = myTax.findIndex(tax => tax.name === item.tax);
    const taxResult = item.price * item.tax / 100

    // If my item is the last return myTax value to 0
    if (myTax[index].value <= Math.round((taxResult) * 100) / 100 || cart.filter(product => item.id === product.id).length === 1) {
      myTax[index].value = 0
    } else {
      const updateTax = Math.round((myTax[index].value - taxResult) * 100) / 100
      myTax[index].value = updateTax
    }

    setTaxes(myTax)
  }

  // Return the total of taxes according to the product with the same tax percentage
  const totalTaxes = (taxeName: number, taxeValue: number) => {
    return (taxes.filter(item => taxeName === item.name).length * taxeValue)
  }

  return (
    <Page title="React Shopping Cart">
      <Layout>
        <ProductCard products={products} addToBasket={addToBasket} />
        <Layout.Section secondary>
          <Card
            title="Basket"
            secondaryFooterAction={{
              content: 'Cancel cart',
              onAction: () => {
                setCart([])
                setTaxes([])
              }
            }}
            primaryFooterAction={{ content: 'Pay' }}
          >
            <Card.Section title="Items">
              <List>
                {products.map((product, productId) => (
                  quantityInBasket(product.id) >= 1
                    ? (
                      <List.Item key={productId}>
                        {quantityInBasket(product.id)} × {product.name}&nbsp;
                        <button onClick={() => {
                          removeFromBasket(product.id)
                          removeTax(product)
                        }}>-</button>
                      </List.Item>
                    ) : null
                ))}
              </List>
            </Card.Section>
            <Card.Section title="Totals">
              <List>
                {taxes.map((tax, taxId) => (
                  tax.value > 0 ? (
                    <List.Item key={taxId}>
                      TVA {tax.name}% : {totalTaxes(tax.name, tax.value).toFixed(2)}.€
                    </List.Item>
                  ) : null
                ))}
                <List.Item>
                  {totalAmountIncludingTaxes.toFixed(2)}€ TTC
                </List.Item>
              </List>
            </Card.Section>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  )
}

export default App
