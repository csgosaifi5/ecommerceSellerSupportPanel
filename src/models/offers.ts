import { OfferMessage } from "./message";
import { OfferProduct } from "./offer-product";

export class Offer {
    id: number | null;
    user_id: number | null;
    customerRemarks: string;
    images: string;
    total_price: number;
    offer_status: string;
    readCount: number;
    payment_status: string;
    latestMessage:OfferMessage|null;
    remarks: string;
    createdAt: Date;
    updatedAt: Date;
    unreadMessageCount: number;
    images_after_delivery: string;
    expense_field: string;
    products: OfferProduct[];
    expense_value: string;
    shipment_company: string;
    tracking_num: string;
    tracking_url: string;
    payment_method_id: number | null;
    payment_method: string;

    get productNames (){
        const names =  this.products.map(product=>product.product_name).join(", ");
        if(names.trim()=="")
        return "No Products Found";

        return names;

    }
    constructor({
        id,
        user_id,
        latestMessage,
        customerRemarks,
        images,
        total_price,
        offer_status,
        payment_status,
        createdAt,
        unreadMessageCount,
        updatedAt,
        remarks,
        images_after_delivery,
        expense_field,
        readCount,
        expense_value,
        shipment_company,
        offers_products,
        tracking_num,
        tracking_url,
        payment_method_id,
        payment_method
    }: {
        id?: number;
        unreadMessageCount?: number;
        user_id?: number;
        customerRemarks?: string;
        images?: string;
        total_price?: number;
        createdAt?: Date;
        updatedAt?: Date;
        offer_status?: string;
        payment_status?: string;
        readCount?: number;
        latestMessage:any;
        remarks?: string;
        images_after_delivery?: string;
        expense_field?: string;
        offers_products: any[];
        expense_value?: string;
        shipment_company?: string;
        tracking_num?: string;
        tracking_url?: string;
        payment_method_id?: number;
        payment_method?: string;
    }) {
        this.id = id || null;
        this.user_id = user_id || null;
        this.customerRemarks = customerRemarks || '';
        this.images = images || '';
        this.total_price = total_price || 0;
        this.readCount = readCount || 0;
        this.offer_status = offer_status || '';
        this.payment_status = payment_status || '';
        this.unreadMessageCount = unreadMessageCount || 0;
        this.remarks = remarks || '';
        this.images_after_delivery = images_after_delivery || '';
        this.expense_field = expense_field || '';
        this.expense_value = expense_value || '';
        this.products = Array.from(offers_products).map(product => new OfferProduct(product)) || [];
        this.shipment_company = shipment_company || '';
        this.tracking_num = tracking_num || '';
        this.createdAt = new Date(createdAt as any);
        this.updatedAt = new Date(updatedAt as any);
        this.tracking_url = tracking_url || '';
        this.payment_method_id = payment_method_id || null;
        this.latestMessage = latestMessage?new OfferMessage(latestMessage):null;
        this.payment_method = payment_method || '';
        
    }
}
