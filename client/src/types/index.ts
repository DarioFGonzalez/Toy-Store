// let OldCartItem =
// {
//     item: Product,
//     quantity: number
// }

export interface Cart
{
    id: string,
    status: string,
    createdAt: string,
    updatedAt: string,
    products: ProductInCart[]
}

export interface ProductInCart
{
    id: string,
    name: string,
    description: string,
    price: string,
    image: string,
    stock: number,
    CartItem: CartItem
}

export interface CartItem
{
    quantity: number,
    priceAtAddition: string
}

export interface CardProps
{
    product: Product
}

export interface Product
{
    id: string,
    name: string,
    description: string,
    price: number,
    image: string,
    category: string,
    stock: number
}

export interface ContactInfo
{
    email: string,
    address: string,
    number: string
}