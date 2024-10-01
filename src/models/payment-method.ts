
export class PaymentMethod {
    platform: string;
    id?: string;
    default_method: boolean;
    label: string;
    details: string;
    constructor(data: { platform: string, default_method?: boolean, label: string, details: string, id?: string }) {
        this.platform = data.platform || "";
        this.default_method = data.default_method ?? false; // Use default value if not provided
        this.label = data.label || "";
        this.id = data.id || "";
        this.details = data.details || "";
    }

}

