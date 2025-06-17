export interface CartItem
{
    item: Product,
    quantity: number
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