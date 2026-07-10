import type { ContactInfo } from '../types/index';

console.log( "Import meta env dev: ", import.meta.env.DEV );

export const URL = import.meta.env.DEV ? 'http://localhost:5000/' : "https://toy-store-zw00.onrender.com/";
export const LOCAL_URL = import.meta.env.DEV ? 'http://localhost:5173/' : "https://toy-store-tau.vercel.app/";

export const emptyCart =
{
    id: '',
    status: '',
    createdAt: '',
    updatedAt: '',
    products: []
};

export const emptyFormProduct =
{
    name: '',
    highlighted: false,
    description: '',
    price: 0,
    category: '',
    medidas: '',
    material: '',
    stock: 0
};

export const emptyProduct =
{
    id: '',
    highlighted: false,
    name: '',
    description: '',
    price: 0,
    imageUrl: [],
    category: '',
    medidas: '',
    material: '',
    visible: true,
    stock: 0
};

export const emptyEditForm =
{
    name: false,
    stock: false,
    price: false,
    description: false
}

export const emptyBannerForm = {
    imageUrl: { url: '', public_id: '' },
    category: 'default',
    active: false,
};

export const emptyFilters = {
    name: '',
    category: '',
    highlighted: false,
    visible: false,
    medida: '',
    material: ''
};

export const emptyContactInfo: ContactInfo =
{
    name: '',
    mail: '',    
    phoneNumber: ''
};