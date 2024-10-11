import { useCookies } from 'react-cookie';
import { useCallback } from 'react';

export function useCart() {
    const [cookies, setCookie, removeCookie] = useCookies(['cart'], {
        doNotParse: true,
    });

    function addToCart(product) {
        let cart = cookies.cart ? JSON.parse(cookies.cart) : [];
        const existingProduct = cart.find(item => item.id === product.id);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            product.quantity = 1;
            cart.push(product);
        }
        setCookie('cart', JSON.stringify(cart), { path: '/' });
    }

    const getCart = useCallback(()=>{
        return cookies.cart ? JSON.parse(cookies.cart) : [];
    },[cookies])

    function removeFromCart(productId) {
        let cart = cookies.cart ? JSON.parse(cookies.cart) : [];
        cart = cart.filter(product => product.id !== productId);
        setCookie('cart', JSON.stringify(cart), { path: '/' });
    }

    function increaseQuantity(productId) {
        let cart = cookies.cart ? JSON.parse(cookies.cart) : [];
        const product = cart.find(item => item.id === productId);
        if (product) {
            product.quantity += 1;
            setCookie('cart', JSON.stringify(cart), { path: '/' });
        }
    }

    function decreaseQuantity(productId) {
        let cart = cookies.cart ? JSON.parse(cookies.cart) : [];
        const product = cart.find(item => item.id === productId);
        if (product) {
            if (product.quantity > 1) {
                product.quantity -= 1;
                setCookie('cart', JSON.stringify(cart), { path: '/' });
            } else {
                removeFromCart(productId);
            }
        }
    }

    function getTotalQuantity() {
        const cart = cookies.cart ? JSON.parse(cookies.cart) : [];
        return cart.reduce((acc, product) => acc + product.quantity, 0);
    }

    function getTotalPrice() {
        const cart = cookies.cart ? JSON.parse(cookies.cart) : [];
        return cart.reduce((acc, product) => {
            const price = parseFloat(product.price) || 0;
            const discount = parseFloat(product.discount) || 0;
            const quantity = parseInt(product.quantity) || 0;
            const discountedPrice = price - (price * (discount / 100));
            return acc + (discountedPrice * quantity);
        }, 0).toFixed(2);
    }

    function emptyCart() {
        removeCookie('cart', { path: '/' });
    }

    return {
        addToCart,
        getCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        getTotalQuantity,
        getTotalPrice,
        emptyCart
    };
}