import { getDocs, query, where, collection } from "firebase/firestore";
import { db } from "../config/FirebaseConfig";

if (!localStorage.getItem("recentlyViewed")) {
    localStorage.setItem("recentlyViewed", JSON.stringify([]));
}

/**
 * Add a product to the recently viewed list.
 * @param {string} productId 
 */
export const addToRecentlyViewed = (productId) => {
    const maxItems = 4; 
    let recentlyViewed = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
    
    // Remove if the product is already in the list
    recentlyViewed = recentlyViewed.filter(id => id !== productId);

    // Add the product to the start of the array
    recentlyViewed.unshift(productId);

    // Trim the array if it exceeds maxItems
    if (recentlyViewed.length > maxItems) {
        recentlyViewed.pop();
    }

    // Save back to local storage
    localStorage.setItem("recentlyViewed", JSON.stringify(recentlyViewed));
};

/**
 * Get the list of recently viewed products from Firestore.
 */
export const getRecentlyViewedProducts = async () => {
    const recentlyViewedIds = JSON.parse(localStorage.getItem("recentlyViewed")) || [];

    // Check if the array is empty
    if (recentlyViewedIds.length === 0) {
        return []; // Return an empty array to prevent invalid query error
    }

    // Fetch product details using IDs from the recently viewed array
    const productsSnapshot = await getDocs(
        query(collection(db, "products"), where("__name__", "in", recentlyViewedIds))
    );

    // Map the results to product data
    return productsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
};