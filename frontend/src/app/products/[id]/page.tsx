'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getProduct, addToCart } from '@/lib/api';
import { getAuth } from '@/lib/auth';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    getProduct(params.id as string)
      .then(setProduct)
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleAddToCart = async () => {
    const auth = getAuth();
    if (!auth) {
      router.push('/login');
      return;
    }
    setAdding(true);
    try {
      await addToCart(auth.userId, {
        productId: product!.id,
        productName: product!.name,
        price: product!.price,
        quantity: 1
      });
      alert(`${product!.name} added to cart!`);
    } catch {
      alert('Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  if (loading) return (
    <div className="text-center mt-16 text-gray-500">Loading product...</div>
  );

  if (!product) return (
    <div className="text-center mt-16 text-red-500">Product not found</div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/" className="text-blue-600 hover:underline text-sm mb-6 block">
        ← Back to products
      </Link>

      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
        <div className="bg-gray-100 rounded-xl h-48 flex items-center justify-center mb-6">
          <span className="text-6xl">📦</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
        <p className="text-gray-500 mb-6">{product.description}</p>

        <div className="flex items-center justify-between mb-6">
          <span className="text-3xl font-bold text-blue-600">${product.price}</span>
          <span className="text-sm text-gray-400">{product.stockQuantity} in stock</span>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={adding}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-xl font-semibold transition-colors"
        >
          {adding ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}