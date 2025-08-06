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

export interface ProductCardProps
{
    item: Product; 
}

export interface ContactInfo
{
    email: string,
    address: string,
    number: string
}

export interface PaginadoProps
{
    currentPage: number,
    totalPages: number
}