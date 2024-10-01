
export const offerStatusOptions = [
    { value: "all", label: "All" },
    { value: "draft", label: "Draft" },
    { value: "sent", label: "Sent" },
    { value: "revised", label: "Revised" },
    { value: "approved", label: "Approved" },
    { value: "not-approved", label: "Not approved" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "delivered-with-defects", label: "Delivered With Defects" },
    { value: "rejected", label: "Rejected" },
    { value: "cancelled", label: "Cancelled" },
    { value: "closed", label: "Closed" },
];

export const offerStatus = offerStatusOptions.map((status) => status.value);





