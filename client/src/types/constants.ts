const offline = true;

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
    name: '',
    surname: '',
    number: '',
    email: ''    
};

export const packageInfo =
{
    "senderLockerId": 0, 
    "receiverLockerId": 0, 
    "packageSize": {
        "width": 0, 
        "height": 0,
        "length": 0
    },
    "packageWeight": 0,
    "declaredValue": 0
}

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