import {db} from "../config/FirebaseConfig"
import { collection, getDocs } from "firebase/firestore";

// Adding a product to the cart
export function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProduct = cart.find(item => item.id === product.id);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      product.quantity = 1;
      cart.push(product);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
  }
  
  // Retrieving the cart
  export function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
  }
  
  // Removing a product from the cart
  export function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(product => product.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
  }
  
  // Increasing product quantity
  export function increaseQuantity(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const product = cart.find(item => item.id === productId);
    if (product) {
      product.quantity += 1;
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }
  
  // Decreasing product quantity
  export function decreaseQuantity(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const product = cart.find(item => item.id === productId);
    if (product && product.quantity > 1) {
      product.quantity -= 1;
      localStorage.setItem('cart', JSON.stringify(cart));
    } else if (product) {
      removeFromCart(productId);
    }
  }
  
  // Calculate the total quantity of items in the cart
  export function getTotalQuantity(cart) {
    return cart.reduce((acc, product) => acc + product.quantity, 0);
  }

  // Calculate the total price of items in the cart
  export function getTotalPrice(cart) {
    
    return cart.reduce((acc, product) => acc + ((product.price - (product.discount/product.price)* 100) * product.quantity), 0).toFixed(2);
  }

  export function emptyCart() {
    localStorage.removeItem('cart');
  }
