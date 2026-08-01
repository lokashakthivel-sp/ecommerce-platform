const API_URL = '/api';

const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`
});

// Auth
export const register = async (data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Registration failed');
  return res.json();
};

export const login = async (email: string, password: string) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) throw new Error('Invalid credentials');
  return res.json();
};

// Products
export const getProducts = async () => {
  const res = await fetch(`${API_URL}/products`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
};

export const getProduct = async (id: string) => {
  const res = await fetch(`${API_URL}/products/${id}`);
  if (!res.ok) throw new Error('Product not found');
  return res.json();
};

// Cart
export const getCart = async (userId: string) => {
  const res = await fetch(`${API_URL}/cart/${userId}`, {
    headers: authHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch cart');
  return res.json();
};

export const addToCart = async (userId: string, item: {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
}) => {
  const res = await fetch(`${API_URL}/cart/${userId}/items`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(item)
  });
  if (!res.ok) throw new Error('Failed to add to cart');
  return res.json();
};

export const removeFromCart = async (userId: string, productId: number) => {
  const res = await fetch(`${API_URL}/cart/${userId}/items/${productId}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
  if (!res.ok) throw new Error('Failed to remove from cart');
};

export const getCartTotal = async (userId: string) => {
  const res = await fetch(`${API_URL}/cart/${userId}/total`, {
    headers: authHeaders()
  });
  if (!res.ok) throw new Error('Failed to get total');
  return res.json();
};

// Orders
export const placeOrder = async (userId: string, items: {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
}[]) => {
  const res = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ userId, items })
  });
  if (!res.ok) throw new Error('Failed to place order');
  return res.json();
};

export const getOrders = async (userId: string) => {
  const res = await fetch(`${API_URL}/orders/user/${userId}`, {
    headers: authHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch orders');
  return res.json();
};