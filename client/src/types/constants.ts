const offline = false;

export const URL = offline ? 'http://localhost:5000/' : "https://toy-store-zw00.onrender.com/";
export const LOCAL_URL = offline ? 'http://localhost:5173/' : "https://toy-store-tau.vercel.app/";

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
    address: '',
    number: '',
    email: ''
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