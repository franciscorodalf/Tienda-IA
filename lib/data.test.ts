import { describe, it, expect } from 'vitest';
import { products } from './data';

describe('Data Integrity', () => {
    it('should have products', () => {
        expect(products.length).toBeGreaterThan(0);
    });

    it('products should have valid prices', () => {
        products.forEach((p) => {
            expect(p.price).toBeGreaterThan(0);
        });
    });

    it('products should have unique ids', () => {
        const ids = products.map(p => p.id);
        const uniqueIds = new Set(ids);
        expect(uniqueIds.size).toBe(ids.length);
    });
});
