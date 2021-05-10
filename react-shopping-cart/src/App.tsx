import React, { useEffect, useState } from 'react'
import {
  Page,
  Layout,
  Card,
  List,
} from '@shopify/polaris'
import { CardComponent } from './components/Card'

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

  const taxes: Array<{ name: number, value: number, }> = [{ name: 20, value: 4 }]

  const [cart, setCart] = useState<Product[]>([])

  const addToBasket = (item: Product) => {
    setCart([...cart, item])
  }

  const removeFromBasket = (productId: number) => {
    console.log(productId);

  }

  const quantityInBasket = (productId: number) => {
    return cart.filter(product => productId === product.id).length
  }

  return (
    <Page title="React Shopping Cart">
      <Layout>
        <CardComponent products={products} addToBasket={addToBasket} />
        <Layout.Section secondary>
          <Card
            title="Basket"
            secondaryFooterAction={{ content: 'Cancel cart' }}
            primaryFooterAction={{ content: 'Pay' }}
          >
            <Card.Section title="Items">
              <List>
                {products.map((product, productId) => (
                  quantityInBasket(product.id) >= 1
                    ? (
                      <List.Item key={productId}>
                        {quantityInBasket(product.id)} × {product.name}&nbsp;
                        <button onClick={() => removeFromBasket(productId)}>-</button>
                      </List.Item>
                    ) : null
                ))}
              </List>
            </Card.Section>
            <Card.Section title="Totals">
              <List>
                {taxes.map((tax, taxId) => (
                  <List.Item key={taxId}>
                    TVA {tax.name}% : {tax.value.toFixed(2)}€
                  </List.Item>
                ))}
                <List.Item>
                  24€ TTC
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
