import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProductCard } from './ProductCard';
import { Product } from '@/lib/data';

const mockProduct: Product = {
    id: 'test-1',
    name: 'Test Product',
    price: 99.99,
    description: 'Test Description',
    category: 'Test Category',
    stock: true,
    imageUrl: 'https://example.com/image.jpg',
    colors: ['black', 'white'],
    sizes: ['S', 'M', 'L', 'XL'],
    features: ['cotton', 'polyester'],
};

describe('ProductCard Component', () => {
    const mockOnClick = vi.fn();

    it('renders product information correctly', () => {
        render(<ProductCard product={mockProduct} onClick={mockOnClick} />);

        expect(screen.getByText('Test Product')).toBeDefined();
        expect(screen.getByText('$99.99')).toBeDefined();
        expect(screen.getByText('Test Category')).toBeDefined();
    });

    it('shows out of stock badge when stock is false', () => {
        const outOfStockProduct = { ...mockProduct, stock: false };
        render(<ProductCard product={outOfStockProduct} onClick={mockOnClick} />);
        expect(screen.getByText('Sold Out')).toBeDefined();
    });
});
