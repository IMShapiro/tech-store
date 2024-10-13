import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Login from "./Login";
import { auth } from "../config/FirebaseConfig";
import { createOrder } from "../utils/orderUtils";
import CartSummary from "../components/CartSummary";
import Paystack from "@paystack/inline-js";
import { useCart } from "../hooks/useCart";
import { useCheckout } from "../contexts/CheckoutContext";

const Checkout = () => {
    const { 
        getCart,
        getTotalQuantity, 
        getTotalPrice, 
        emptyCart 
    } = useCart();
    
    const { contactInfo, setContactInfo, address, setAddress } = useCheckout();

    const user = auth.currentUser;
    const [cart, setCart] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [formsFilled, setFormsFilled] = useState(false);
    const [specials, setSpecials] = useState([]);
    const [qualifiesForSpecial, setQualifiesForSpecial] = useState(false);
    const [previousPrice, setPreviousPrice] = useState(null);

    useEffect(() => {
        const loadSpecials = async () => {
            const specialsData = await fetchSpecials();
            setSpecials(specialsData);
        };
        loadSpecials();
    }, []);

    useEffect(() => {
        const cartData = getCart();
        setCart(cartData);
    
        const initialTotalPrice = getTotalPrice(cartData);
        const cartLength = cartData.length;
        
        setTotalPrice(initialTotalPrice);
        setTotalQuantity(getTotalQuantity(cartData));
        
        if (specials.length > 0 && specials[0].minRequirements !== undefined) {
            if (cartLength >= specials[0].minCartItems && initialTotalPrice >= specials[0].minRequirements) {
                setPreviousPrice(initialTotalPrice);
                const discount = ((specials[0].appliedDiscount / 100) * initialTotalPrice).toFixed(2);
                setTotalPrice((initialTotalPrice - discount).toFixed(2));
                setQualifiesForSpecial(true);
            }
        } else {
            console.log("No special found.");
        }
    }, [specials]);

    if (!user) {
        return <Login />;
    }

    useEffect(() => {
        const allFormsFilled = Object.values(contactInfo).every(Boolean) && Object.values(address).every(Boolean);
        setFormsFilled(allFormsFilled);
    }, [contactInfo, address]);

    const navigate = useNavigate();

    const publicKey = "pk_test_447a03140b3feb891eea0cac077ab648fda2f025";
    const amount = Math.round(totalPrice * 100);
    const currency = "ZAR";

    const popup = new Paystack();

    function handlePaystack() { 
        let user = auth.currentUser;
        const email = user.email;

        popup.newTransaction({
            key: publicKey,
            firstName: contactInfo.firstName,
            lastName: contactInfo.surname,
            phone: contactInfo.usersNumber,
            email: email, 
            amount: amount,
            currency: currency,
            onSuccess: async (transaction) => {
                try {
                    await createOrder(
                        user.uid,
                        `${contactInfo.firstName} ${contactInfo.surname}`,
                        email,
                        contactInfo.usersNumber,
                        address,
                        cart,
                        totalPrice,
                        transaction.reference,
                        qualifiesForSpecial,
                    );

                    emptyCart();
                    navigate("/");
                } catch (error) {
                    console.log("Error creating order: ", error.message);
                }
            },
            onCancel: () => {
                console.log('Payment process was not completed.');
            },
            onError: (error) => {
                console.log("Error: ", error.message);
            },
            onClose: () => {
                console.log('Payment window closed.');
            }
        }); 
    }

    return (
        <div className="container">
            <div className="row">
                <h2>Checkout</h2>
                <div className="col-md">
                    <form className="form">
                        <div className="contact-info">
                            <div className="row">
                                <div className="col">
                                    <label className="form-label"><b>Name:</b></label><br />
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="firstName"
                                        value={contactInfo.firstName}
                                        onChange={(e) => setContactInfo({ ...contactInfo, firstName: e.target.value })}
                                    /><br />
                                </div>

                                <div className="col">
                                    <label className="form-label"><b>Surname:</b></label><br />
                                    <input
                                        className="form-control"
                                        type="text"
                                        name="surname"
                                        value={contactInfo.surname}
                                        onChange={(e) => setContactInfo({ ...contactInfo, surname: e.target.value })}
                                    /><br />
                                </div>
                            </div>

                            <label className="form-label"><b>Phone Number:</b></label><br />
                            <input
                                className="form-control"
                                type="number"
                                name="usersNumber"
                                value={contactInfo.usersNumber}
                                onChange={(e) => setContactInfo({ ...contactInfo, usersNumber: e.target.value })}
                            /><br />
                        </div>
                        <div className="shipping-info">
                            <label className="form-label"><b>Street:</b></label><br />
                            <input
                                className="form-control"
                                type="text"
                                name="street"
                                value={address.street}
                                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                            /><br />
                            <label className="form-label"><b>City:</b></label><br />
                            <input
                                className="form-control"
                                type="text"
                                name="city"
                                value={address.city}
                                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                            /><br />
                            <label className="form-label"><b>Suburb:</b></label><br />
                            <input
                                className="form-control"
                                type="text"
                                name="suburb"
                                value={address.suburb}
                                onChange={(e) => setAddress({ ...address, suburb: e.target.value })}
                            /><br />
                            <label className="form-label"><b>Zip:</b></label><br />
                            <input
                                className="form-control"
                                type="text"
                                name="zip"
                                value={address.zip}
                                onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                            /><br />
                        </div>
                    </form>
                </div>
                <div className="col-md card p-2 m-1">
                    <CartSummary
                        cartLength={cart.length}
                        totalQuantity={totalQuantity}
                        totalPrice={totalPrice}
                        qualifiesForSpecial={qualifiesForSpecial}
                        previousPrice={previousPrice}
                    />
                    {!formsFilled && <button
                        className="btn btn-secondary"
                        data-bs-toggle="popover"
                        data-bs-title="Form is incomplete!"
                        data-bs-content="Please complete the form before making a purchase!!"
                    >Pay</button>}
                    {formsFilled && <button
                        className="btn btn-primary"
                        onClick={handlePaystack}
                    >Pay Now</button>}
                </div>
            </div>
        </div>
    );
};

export default Checkout;