import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  return (
    <div 
      className="product-card cursor-pointer transform hover:scale-105 transition-transform duration-200"
      onClick={onClick}
    >
      <div className="relative mb-4">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-48 object-cover rounded-lg"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/400x300?text=Product+Image';
          }}
        />
        <div className="absolute top-2 right-2">
          <span className="bg-primary-600 text-white text-xs font-medium px-2 py-1 rounded-full">
            {product.department}
          </span>
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
          {product.name}
        </h3>
        
        <p className="text-gray-600 text-sm line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary-600">
            ${product.price.toFixed(2)}
          </span>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              Stock: {product.stock_quantity}
            </span>
            <div className={`w-2 h-2 rounded-full ${
              product.stock_quantity > 0 ? 'bg-green-500' : 'bg-red-500'
            }`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 