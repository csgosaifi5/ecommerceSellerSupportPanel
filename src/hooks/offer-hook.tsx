'use client'
import { OfferFormValues } from '@/components/sections/offers/form/offer-form';
import React, { createContext, useState } from 'react';

interface OfferFormValuesContextType {
    offer: OfferFormValues;
    setOfferFormValues: React.Dispatch<React.SetStateAction<OfferFormValues>>;
}

export const OfferContext = createContext<OfferFormValuesContextType>({} as any);

type Props = {
    offer: OfferFormValues;
    children: React.ReactNode;
}

export const OfferProvider = ({ children, offer: defaultOfferFormValues }: Props) => {
    const [offer, setOfferFormValues] = useState<OfferFormValues>(defaultOfferFormValues || {} as OfferFormValues);

    return (
        <OfferContext.Provider value={{ offer, setOfferFormValues }}>
            {children}
        </OfferContext.Provider>
    );
};


export const useOfferContext = () => {
    const context = React.useContext(OfferContext);

    return context;
}