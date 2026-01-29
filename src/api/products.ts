// Products API
const ECOMMERCE_API_BASE_URL = 'https://api.mastrokart.com/dashboard';

export interface Product {
  product_id: number;
  product_name: string;
  description: string;
  category_id: number;
  category_name: string;
  price: number;
  discount: number;
  stock_quantity: number;
  status: number;
  added_by: string;
  role_id?: number;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export interface ProductsResponse {
  detail: string;
  data: Product[];
}

export async function fetchProducts(): Promise<ProductsResponse> {
  const token = localStorage.getItem('ecommerce_token');

  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch(`${ECOMMERCE_API_BASE_URL}/products`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Failed to fetch products');
  }

  return response.json();
}

export interface CreateProductData {
  product_name: string;
  description: string;
  category_id: string;
  price: string;
  discount: string;
  stock_quantity: string;
  product_image: File;
}

export interface CreateProductResponse {
  detail: string;
  data?: Product;
}

export async function createProduct(data: CreateProductData): Promise<CreateProductResponse> {
  const token = localStorage.getItem('ecommerce_token');

  if (!token) {
    throw new Error('No authentication token found');
  }

  const formData = new FormData();
  formData.append('product_name', data.product_name);
  formData.append('description', data.description);
  formData.append('category_id', data.category_id);
  formData.append('price', data.price);
  formData.append('discount', data.discount);
  formData.append('stock_quantity', data.stock_quantity);
  formData.append('product_image', data.product_image);

  const response = await fetch(`${ECOMMERCE_API_BASE_URL}/products/add`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Failed to create product');
  }

  return response.json();
}

export interface Category {
  category_id: number;
  category_name: string;
  parent_id?: number | null;
  status: number;
  added_by: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export interface CategoriesResponse {
  detail: string;
  data: Category[];
}

export async function fetchCategories(): Promise<CategoriesResponse> {
  const token = localStorage.getItem('ecommerce_token');

  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch(`${ECOMMERCE_API_BASE_URL}/categories`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Failed to fetch categories');
  }

  return response.json();
}

export interface CreateCategoryData {
  category_name: string;
  parent_id?: string;
  image?: File;
}

export interface CreateCategoryResponse {
  detail: string;
  data?: Category;
}

export async function createCategory(data: CreateCategoryData): Promise<CreateCategoryResponse> {
  const token = localStorage.getItem('ecommerce_token');

  if (!token) {
    throw new Error('No authentication token found');
  }

  const formData = new FormData();
  formData.append('category_name', data.category_name);
  
  if (data.parent_id) {
    formData.append('parent_id', data.parent_id);
  }
  
  if (data.image) {
    formData.append('image', data.image);
  }

  const response = await fetch(`${ECOMMERCE_API_BASE_URL}/categories/add`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Failed to create category');
  }

  return response.json();
}

export interface UpdateCategoryData {
  category_name?: string;
  parent_id?: string;
  category_status?: string;
  image?: File;
}

export interface UpdateCategoryResponse {
  detail: string;
  data?: Category;
}

export async function updateCategory(categoryId: number, data: UpdateCategoryData): Promise<UpdateCategoryResponse> {
  const token = localStorage.getItem('ecommerce_token');

  if (!token) {
    throw new Error('No authentication token found');
  }

  console.log(`Calling PATCH API for category ${categoryId}:`, data);

  const formData = new FormData();
  
  if (data.category_name) {
    formData.append('category_name', data.category_name);
  }
  
  // Always send parent_id, even if it's empty (to convert subcategory to main category)
  if (data.parent_id !== undefined) {
    formData.append('parent_id', data.parent_id);
  }
  
  if (data.category_status) {
    formData.append('category_status', data.category_status);
  }
  
  if (data.image) {
    formData.append('image', data.image);
  }

  console.log('FormData entries:', Array.from(formData.entries()));

  const url = `${ECOMMERCE_API_BASE_URL}/categories/update/${categoryId}`;
  console.log('Request URL:', url);

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  console.log('Response status:', response.status, response.statusText);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    console.error('API Error:', error);
    throw new Error(error.detail || 'Failed to update category');
  }

  const result = await response.json();
  console.log('API Success:', result);
  return result;
}

export interface UpdateProductData {
  product_name?: string;
  description?: string;
  category_id?: string;
  price?: string;
  discount?: string;
  stock_quantity?: string;
  status?: string;
  product_image?: File;
}

export interface UpdateProductResponse {
  detail: string;
  data?: Product;
}

export async function updateProduct(productId: number, data: UpdateProductData): Promise<UpdateProductResponse> {
  const token = localStorage.getItem('ecommerce_token');

  if (!token) {
    throw new Error('No authentication token found');
  }

  console.log(`Calling PATCH API for product ${productId}:`, data);

  const formData = new FormData();
  
  if (data.product_name) {
    formData.append('product_name', data.product_name);
  }
  
  if (data.description) {
    formData.append('description', data.description);
  }
  
  if (data.category_id) {
    formData.append('category_id', data.category_id);
  }
  
  if (data.price) {
    formData.append('price', data.price);
  }
  
  if (data.discount) {
    formData.append('discount', data.discount);
  }
  
  if (data.stock_quantity) {
    formData.append('stock_quantity', data.stock_quantity);
  }
  
  if (data.status) {
    formData.append('status', data.status);
  }
  
  if (data.product_image) {
    formData.append('product_image', data.product_image);
  }

  console.log('FormData entries:', Array.from(formData.entries()));

  const url = `${ECOMMERCE_API_BASE_URL}/products/update/${productId}`;
  console.log('Request URL:', url);

  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  console.log('Response status:', response.status, response.statusText);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    console.error('API Error:', error);
    throw new Error(error.detail || 'Failed to update product');
  }

  const result = await response.json();
  console.log('API Success:', result);
  return result;
}
