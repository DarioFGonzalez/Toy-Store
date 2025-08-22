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
    imageUrl: {url: string, public_id: string}[],
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
    highlighted: boolean,
    name: string,
    description: string,
    price: number,
    imageUrl: { url: string, public_id: string}[],
    category: string,
    visible: boolean,
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

export interface editForm
{
    name: boolean,
    stock: boolean,
    price: boolean,
    description: boolean
}

export interface DBImagesFormat
{
    url: string,
    public_id: string
}

export interface FormProduct
{
    highlighted?: boolean,
    name: string,
    description?: string,
    price: number,
    imageUrl?: { url: string, public_id: string}[],
    category: string,
    visible?: boolean,
    stock: number   
}

export interface BannerImages
{
    url: string,
    public_id: string
}

export interface Banner
{
    id: string,
    imageUrl: BannerImages,
    category: string,
    active: boolean
}

export interface BannerForm {
    imageUrl: DBImagesFormat;
    category: string;
    active: boolean;
}