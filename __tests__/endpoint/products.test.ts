/**
 * @jest-environment node
 */

import {GET, DELETE, PUT} from '@/app/api/products/[id]/route'
import {POST as addProductHandler} from '@/app/api/products/[id]/route'
import * as getAllProductHandler from '@/app/api/products/[id]/route'
import { createMocks } from 'node-mocks-http'
import { describe, expect, test, it, beforeAll } from '@jest/globals';
import { CreateTagDTO } from "@/crud/tags";
import { CreateProductDTO } from "@/crud/product";
import { Product, ProductStatus } from "@prisma/client";
import { CreateImageDTO } from "@/crud/DTOs";


describe('Testing Products Api', () => {
    const mockProduct: CreateProductDTO = {
        sku: 'ABC123',
        name: 'Sample Product',
        status: ProductStatus.AVAILABLE,
        ratings: 4.5,
        inventory: 100,
        productBreakdown: 'Detailed breakdown goes here',
        shippingReturnPolicy: 'Free shipping and 30-day return policy',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        price: 49.99,
        profitMargin: 0.2, // 20%
        displayPrice: 59.99,
        category: 'Electronics',
        subcategory: 'Smartphones',
        tags: [
            { name: 'Tech' },
            { name: 'Mobile' },
        ] as CreateTagDTO[],
        images: [
            { name: 'Image 1', src: 'image1.jpg' } as CreateImageDTO,
            { name: 'Image 2', src: 'image2.jpg' } as CreateImageDTO,
        ],
    };

    let createdProduct: Product;


    it('Adds a product to the test database', async () => {
        const { req, res } = createMocks({
            method: 'POST',
            body: mockProduct,
        })

        const response = await addProductHandler(req);

        expect(response.status).toEqual(200);
        createdProduct = (await response.json()).data;
    });
    it('delete Product', async () => {
        const { req, res } = createMocks({
            method: 'DELETE',
            body: mockProduct,
        })

        const response = await DELETE(req, { params: { id: createdProduct.id } });
        expect(response.status).toBe(200)
    })

});
