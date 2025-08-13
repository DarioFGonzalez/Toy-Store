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

export const formProduct =
{
    name: '',
    highlighted: false,
    description: '',
    price: 0,
    imageUrl: [],
    category: '',
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