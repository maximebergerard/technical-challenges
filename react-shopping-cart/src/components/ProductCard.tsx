import React, { useState } from 'react'
import { Layout, ResourceList, Card, Avatar, TextStyle } from '@shopify/polaris'

import { Product } from "../interfaces/Product"

interface ProductProps {
  products: Product[];
  addToBasket: (item: Product) => void;
}

const ProductCard: React.FC<ProductProps> = ({ products, addToBasket }) => {
  const [inputValue, setInputValue] = useState<string>('')

  const filterProducts = (products: Product[], inputValue: string) => {
    if (!inputValue) {
      return products;
    }
    return products.filter((product) => {
      const productName = product.name.toLowerCase();
      return productName.includes(inputValue.toLowerCase())
    })
  }

  const filteredProducts = filterProducts(products, inputValue);

  return (
    <Layout.Section secondary>
      <Card>
        <ResourceList
          resourceName={{ singular: 'product', plural: 'products' }}
          items={filteredProducts}
          renderItem={item => {
            const { id, name, description, price } = item
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
                  <TextStyle variation="strong">{name} à {price}€</TextStyle>
                </h3>
                <div>{description}</div>
              </ResourceList.Item>
            )
          }}
          filterControl={
            // @ts-ignore
            <ResourceList.FilterControl
              searchValue={inputValue}
              onSearchChange={(searchValue) => {
                setInputValue(searchValue)
              }}
            />
          }
        />
      </Card>
    </Layout.Section>
  )
}

export { ProductCard }