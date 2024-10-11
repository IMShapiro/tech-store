import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs, startAfter, where } from 'firebase/firestore';
import { db } from "../config/FirebaseConfig.js";

const useProducts = (initialCategory = "All", pageSize = 20) => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [lastVisibleDoc, setLastVisibleDoc] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  useEffect(() => {
    const fetchInitialData = async () => {
      const fetchedCategories = await fetchCategories();
      setCategories(["All", ...fetchedCategories]);
      await fetchProducts(initialCategory);
      setLoading(false);
    };

    fetchInitialData();
  }, [initialCategory]);

  const fetchCategories = async () => {
    const categoriesSet = new Set();
    const productsSnapshot = await getDocs(collection(db, "products"));
    productsSnapshot.forEach(doc => {
      const category = doc.data().category;
      if (category) {
        categoriesSet.add(category);
      }
    });
    return Array.from(categoriesSet);
  };

  const fetchProducts = async (category = selectedCategory) => {
    let productsQuery = query(collection(db, "products"), orderBy("price"), limit(pageSize));
    if (category !== "All") {
      productsQuery = query(collection(db, "products"), where("category", "==", category), orderBy("price"), limit(pageSize));
    }
    const productsSnapshot = await getDocs(productsQuery);
    setProducts(productsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    setLastVisibleDoc(productsSnapshot.docs[productsSnapshot.docs.length - 1]);
  };

  const loadMoreProducts = async () => {
    if (!lastVisibleDoc) return;
    const nextPageSnapshot = await getDocs(query(collection(db, "products"), orderBy("productName"), startAfter(lastVisibleDoc), limit(pageSize)));
    setProducts(prevProducts => [...prevProducts, ...nextPageSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))]);
    setLastVisibleDoc(nextPageSnapshot.docs[nextPageSnapshot.docs.length - 1]);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    fetchProducts(category);
  };

  return {
    loading,
    products,
    categories,
    selectedCategory,
    handleCategoryClick,
    loadMoreProducts
  };
};

export default useProducts;