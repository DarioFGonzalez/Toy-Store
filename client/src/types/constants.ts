import type { DestinationLocker } from '../types/index';

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

export const emptyContactInfo =
{
    name: '',
    phoneNumber: '',
    email: ''    
};

export const packageMeasures =
{
    widthInMm: 300,
    heightInMm: 300, 
    depthInMm: 500,
    weightInGrams: 0
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

export const destinationLockerInfo: DestinationLocker =
{
    shippingMethodId: 1, 
    lockerId: 0,
    price: 0,
    destination:
    {
        address: '', 
        province: '',
        country: 'AR',
        city: '',
        postalCode: 0
    }
};