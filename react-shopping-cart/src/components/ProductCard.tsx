import React from 'react'
import { Layout, ResourceList, Card, Avatar, TextStyle } from '@shopify/polaris'

import { Product } from "../interfaces/Product"

interface ProductProps {
  products: Product[];
  addToBasket: (item: Product) => void;
}

const ProductCard: React.FC<ProductProps> = ({ products, addToBasket }) => {

  return (
    <Layout.Section>
      <Card>
        <ResourceList
          resourceName={{ singular: 'customer', plural: 'customers' }}
          items={products}
          renderItem={item => {
            const { id, name, description } = item
            const media = (
              <Avatar customer={true} size="medium" name={name} />
            )
            const shortcutActions = [
              {
                content: 'Add to basket (+1)',
                onAction: () => addToBasket(item),
              },
            ]
            return (
              // @ts-ignore
              <ResourceList.Item
                id={id}
                media={media}
                accessibilityLabel={`View details for ${name}`}
                shortcutActions={shortcutActions}
                persistActions={true}
              >
                <h3>
                  <TextStyle variation="strong">{name}</TextStyle>
                </h3>
                <div>{description}</div>
              </ResourceList.Item>
            )
          }}
        />
      </Card>
    </Layout.Section>
  )
}

export { ProductCard }