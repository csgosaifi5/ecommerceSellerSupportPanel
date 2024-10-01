class Transaction {
    id?: number | null;
    offer_id?: number | null;
    user_id?: number | null;
    transaction_id?: string | null;
    date?: string | null;
    platform?: string | null;
    details?: string | null;
    amount?: number | null;
    remarks?: string | null;
    payment_method_id?: number | null;
    createdAt?: string | null;
    updatedAt?: string | null;

    constructor(data: Partial<Transaction> = {}) {
        this.id = data?.id ?? null;
        this.offer_id = data?.offer_id ?? null;
        this.user_id = data?.user_id ?? null;
        this.transaction_id = data?.transaction_id ?? null;
        this.date = data?.date ?? null;
        this.platform = data?.platform ?? null;
        this.details = data?.details ?? null;
        this.amount = data?.amount ?? null;
        this.remarks = data?.remarks ?? null;
        this.payment_method_id = data?.payment_method_id ?? null;
        this.createdAt = data?.createdAt ?? null;
        this.updatedAt = data?.updatedAt ?? null;
    }
}

export default Transaction;