const offline = false;

export const URL = "https://toy-store-zw00.onrender.com/";
export const LOCAL_URL = offline ? "https://toy-store-tau.vercel.app/" : 'http://localhost:5173/';

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
    description: '',
    price: 0,
    image: '',
    category: '',
    stock: 0
};

export const emptyProduct =
{
    id: '',
    name: '',
    description: '',
    price: 0,
    image: '',
    category: '',
    stock: 0
};

export const emptyContactInfo =
{
    address: '',
    number: '',
    email: ''
};