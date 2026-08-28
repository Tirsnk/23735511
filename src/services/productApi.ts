// src/services/productApi.ts
import { PRICE_MULTIPLIER } from '@constants/student';

export interface Product {
  id: number;
  title: string;
  price: number;
  formattedPrice: string;
  category: 'food' | 'drink' | 'study';
  image: string;
  description: string;
}

export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch('https://fakestoreapi.com/products?limit=8');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();

  return data.map((item: any) => {
    let cat: 'food' | 'drink' | 'study' = 'food';
    if (item.category.includes('clothing')) {
      cat = 'study';
    } else if (item.category.includes('jewel')) {
      cat = 'drink';
    } else {
      cat = 'food';
    }

    const calculatedPrice = Math.round(item.price * PRICE_MULTIPLIER);

    return {
      id: item.id,
      title: item.title,
      price: calculatedPrice,
      formattedPrice: calculatedPrice.toLocaleString('vi-VN') + ' đ',
      category: cat,
      image: item.image,
      description: item.description,
    };
  });
}