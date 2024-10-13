import { createContext, useState, useContext } from 'react';

const CheckoutContext = createContext();

export const CheckoutProvider = ({ children }) => {
    const [contactInfo, setContactInfo] = useState({
        firstName: "",
        surname: "",
        usersNumber: "",
    });
    const [address, setAddress] = useState({
        street: "",
        city: "",
        suburb: "",
        zip: "",
    });

    return (
        <CheckoutContext.Provider value={{ contactInfo, setContactInfo, address, setAddress }}>
            {children}
        </CheckoutContext.Provider>
    );
};

export const useCheckout = () => useContext(CheckoutContext);