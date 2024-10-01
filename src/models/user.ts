export class User {
    id?: number;
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string | null;
    address_1?: string | null;
    address_2?: string | null;
    address_3?: string | null;
    city?: string | null;
    state?: string | null;
    zipcode: string;
    role?: number;
    agreement?: string | null;
    is_active?: boolean;
    country?: string | null;
    company_name?: string | null;
    profile_image?: string | null;
    payout_preferences?: string | null;
    createdAt?: Date | null;
    updatedAt?: Date | null;

    constructor({
        id,
        first_name,
        last_name,
        email,
        phone = "",
        address_1 = "",
        address_2 = "",
        address_3 = "",
        city = "",
        state = "",
        zipcode = "",
        profile_image,
        role,
        agreement = "",
        is_active = false,
        country = "",
        company_name = "",
        payout_preferences = "",
        createdAt = null,
        updatedAt = null
    }: Partial<User> = {}) {
        this.id = id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.phone = phone;
        this.address_1 = address_1 || "";
        this.address_2 = address_2 || "";
        this.address_3 = address_3;
        this.city = city || "";
        this.profile_image = profile_image||"";
        this.state = state || "";
        this.zipcode = zipcode || "";
        this.role = role;
        this.agreement = agreement;
        this.is_active = is_active;
        this.country = country || "";
        this.company_name = company_name || "";
        this.payout_preferences = payout_preferences;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    get fullName() {
        if(this.first_name || this.last_name)
        return `${this.first_name} ${this.last_name}`;

        return "User";
    }

    get address () {
        return `${this.address_1} ${this.address_2} ${this.address_3}`;
    }
}
