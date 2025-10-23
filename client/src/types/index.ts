export interface Cart
{
    id: string,
    status: string,
    createdAt: string,
    updatedAt: string,
    products: ProductInCart[]
}

export type CategoriasJoyeria =
'aros' | 'anillos' | 'cadenitas' | 'chokers' | 'collares' | 'gargantillas' | 'pulseras' | 'tobilleras';

export type MapaDePesos = {
    [key in CategoriasJoyeria]: number
} 

export interface ProductInCart
{
    id: string,
    name: string,
    description: string,
    price: string,
    imageUrl: {url: string, public_id: string}[],
    category: string,
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
    material: string,
    medidas: string,
    visible: boolean,
    stock: number
}

export interface ProductCardProps
{
    item: Product; 
}

export interface ContactInfo
{
    name: string,
    surname: string,
    email: string,
    number: string
}

export interface packageInfo
{
    "senderLockerId": number, 
    "receiverLockerId": 456, 
    "packageSize": {
        "width": number, 
        "height": number,
        "length": number
    },
    "packageWeight": number,
    "declaredValue": number
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
    material: string,
    medidas: string,
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

export interface DashboardFilters {
    name: string;
    category: string;
    highlighted: boolean;
    visible: boolean;
    medida: string;
    material: string;
}