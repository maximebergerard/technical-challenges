import React, { useState, useEffect, useCallback } from 'react'
import {
  Page,
  Layout,
  Card,
  List,
  TextStyle,
  TextField,
} from '@shopify/polaris'
import { ProductCard } from './components/ProductCard'

import { Product } from "./interfaces/Product"

const App: React.FC = () => {
  const products: Product[] = [
    {
      id: 0,
      name: 'Bob lumineux',
      description: 'Lorem ipsum dolor sit, amet consectetur',
      price: 12,
      tax: 20,
    },
    {
      id: 1,
      name: 'Super PC portable',
      description: 'Lorem ipsum dolor sit, amet consectetur',
      price: 13,
      tax: 5.5,
    },
    {
      id: 2,
      name: 'iMac dernière génération',
      description: 'Lorem ipsum dolor sit, amet consectetur',
      price: 15,
      tax: 5.5,
    },
    {
      id: 3,
      name: 'Des chaussures qui roulent',
      description: 'Lorem ipsum dolor sit, amet consectetur',
      price: 150,
      tax: 15,
    }
  ]

  const [cart, setCart] = useState<Product[]>([])
  const [taxes, setTaxes] = useState<Array<{ name: number, value: number, }>>([])
  const [total, setTotal] = useState<number>(0)
  const [discountInput, setDiscountInput] = useState<string>('')

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

  const totalAmountIncludingTaxes = () => {
    // Total of products prices in cart + total of taxes
    const total =
      cart.reduce((total, { price = 0 }) => total + price, 0) +
      taxes.reduce((total, { value = 0 }) => total + value, 0)

    if (discountInput === "Wino") {
      // Discount code of 20% !!!
      setTotal(total - total * 20 / 100)
    } else setTotal(total)
  }

  const handleTextFieldChange = useCallback(
    (value) => setDiscountInput(value),
    [],
  );

  useEffect(() => {
    // @ts-ignore
    const parsedCart = JSON.parse(localStorage.getItem("cart"))
    setCart(parsedCart)

    // @ts-ignore
    const parsedTaxes = JSON.parse(localStorage.getItem("taxes"))
    setTaxes(parsedTaxes)
  }, [])

  useEffect(() => {
    // When cart is changed, update user local storage
    localStorage.setItem("cart", JSON.stringify(cart))
    localStorage.setItem("taxes", JSON.stringify(taxes))
    totalAmountIncludingTaxes()
  }, [cart])

  useEffect(() => {
    totalAmountIncludingTaxes()
  }, [discountInput])

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
            primaryFooterAction={{
              content: 'Pay',
              onAction: () => {
                window.open("https://img.filmsactu.net/datas/films/l/a/la-cite-de-la-peur/n/la-cite-de-la-peur-gif-5c88fa11c7dd3.gif", "_blank")
              }
             }}
          >
            <Card.Section title="My products">
              <List>
                {products.map((product, productId) => (
                  quantityInBasket(product.id) >= 1
                    ? (
                      <List.Item key={productId}>
                        {quantityInBasket(product.id)} × <b>{product.name}</b> à {product.price}€/u&emsp;
                        <button onClick={() => {
                          removeFromBasket(product.id)
                          removeTax(product)
                        }}>-</button>
                      </List.Item>
                    ) : null
                ))}
              </List>
            </Card.Section>
            {total !== 0 ? (
              <>
                <Card.Section title="Taxes">
                  <List>
                    {taxes.map((tax, taxId) => (
                      tax.value > 0 ? (
                        <List.Item key={taxId}>
                          TVA {tax.name}% : {totalTaxes(tax.name, tax.value).toFixed(2)}€
                        </List.Item>
                      ) : null
                    ))}
                  </List>
                </Card.Section>
                <Card.Section title="Discount code">
                  <TextField
                    label="Discount code"
                    labelHidden
                    value={discountInput}
                    onChange={handleTextFieldChange}
                    placeholder={'D81X62A'}
                  />
                </Card.Section>
                <Card.Section title="Total">
                  <TextStyle variation="strong">{total.toFixed(2)}€ {discountInput === "Wino" ? "-20% sur votre panier !" : null}</TextStyle>
                </Card.Section>
              </>
            ) : null}
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  )
}

export default App
