
interface Product {
    id: number;
    upc: string;
    product_name: string;
    brand: string;
    offer_id: number;
    quantity: number;
    price: string;
    description: string;
    model_num: string;
    createdAt: string;
    updatedAt: string;
}
export class OfferProduct {
    id: number;
    upc: string;
    product_name: string;
    brand: string;
    offer_id: number;
    quantity: number;
    price: number;
    description: string;
    model_num: string;
    createdAt: string;
    updatedAt: string;

    constructor({ id, upc, brand, product_name, offer_id, quantity, createdAt, description, model_num, price, updatedAt }: Product) {
        this.id = id;
        this.upc = upc;
        this.product_name = product_name;
        this.brand = brand;
        this.offer_id = offer_id;
        this.quantity = quantity;
        this.price = Number(price);
        this.description = description;
        this.model_num = model_num;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
