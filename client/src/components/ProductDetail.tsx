import React from 'react';
import { Product } from '../types';

interface ProductDetailProps {
  product: Product;
  onBack?: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack }) => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-primary-600 hover:text-primary-700 font-medium"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Products
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Product Image */}
          <div className="md:w-1/2">
            <div className="relative">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-96 md:h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/600x400?text=Product+Image';
                }}
              />
              <div className="absolute top-4 left-4">
                <span className="bg-primary-600 text-white text-sm font-medium px-3 py-1 rounded-full">
                  {product.department}
                </span>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="md:w-1/2 p-8">
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
                <div className="flex items-center space-x-4">
                  <span className="text-4xl font-bold text-primary-600">
                    ${product.price.toFixed(2)}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      Stock: {product.stock_quantity}
                    </span>
                    <div className={`w-3 h-3 rounded-full ${
                      product.stock_quantity > 0 ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Description
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="border-t pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Department</span>
                    <p className="text-gray-900">{product.department}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Product ID</span>
                    <p className="text-gray-900">#{product.id}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Availability</span>
                    <p className={`font-medium ${
                      product.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Stock Level</span>
                    <p className="text-gray-900">{product.stock_quantity} units</p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button className="btn-primary flex-1">
                  Add to Cart
                </button>
                <button className="btn-secondary">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 