import React, { useState } from 'react'
import {
  Page,
  Layout,
  Card,
  List,
} from '@shopify/polaris'
import { CardComponent } from './components/Card'

import { Cart } from "./interfaces/Cart"
import { Product } from "./interfaces/Product"

const App: React.FC = () => {
  const [products, setProduct] = useState<Product[]>([
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
  ])

  const [cart, setCart] = useState<Cart>({
    products: [
      {
        productId: 0,
        quantity: 2,
      },
    ],
    taxes: [
      {
        name: 20,
        value: 4,
      },
    ],
    totalAmountIncludingTaxes: 24,

  })

  return (
    <Page title="React Shopping Cart">
      <Layout>
        <CardComponent data={products} />
        <Layout.Section secondary>
          <Card
            title="Basket"
            secondaryFooterAction={{ content: 'Cancel cart' }}
            primaryFooterAction={{ content: 'Pay' }}
          >
            <Card.Section title="Items">
              <List>
                {cart.products.map((product, productId) => (
                  <List.Item key={productId}>{product.quantity} × xxx</List.Item>
                ))}
              </List>
            </Card.Section>
            <Card.Section title="Totals">
              <List>
                {cart.taxes.map((tax, taxId) => (
                  <List.Item key={taxId}>
                    TVA {tax.name}% : {tax.value.toFixed(2)}€
                  </List.Item>
                ))}
                <List.Item>
                  {cart.totalAmountIncludingTaxes.toFixed(2)}€ TTC
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
