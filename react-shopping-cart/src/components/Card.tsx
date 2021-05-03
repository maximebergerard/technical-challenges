import React from 'react'
import { Layout, ResourceList, Card, Avatar, TextStyle } from '@shopify/polaris'

import { Product } from "../interfaces/Product"

interface ProductProps {
  data: Product[];
}

const CardComponent: React.FC<ProductProps> = ({ data }) => {
  return (
    <Layout.Section>
      <Card>
        <ResourceList
          resourceName={{ singular: 'customer', plural: 'customers' }}
          items={data}
          renderItem={item => {
            const { id, name, description } = item
            const media = (
              <Avatar customer={true} size="medium" name={name} />
            )
            const shortcutActions = [
              {
                content: 'Add to basket (+1)',
                onAction: () => alert('Add to basket'),
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
                onClick={console.log}
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

export { CardComponent }