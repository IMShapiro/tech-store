import { useEffect, useState } from "react";
import { getRecentlyViewedProducts } from "../utils/productUtils";
import useProducts from "../hooks/useProducts";
import Searchbar from "../components/Searchbar";
import ProductCard from "../components/ProductCard";
import { useCart } from "../hooks/useCart";
import "../assets/styles/Products.css";

const Products = () => {
  const { 
    loading, 
    products, 
    categories, 
    selectedCategory, 
    handleCategoryClick, 
    loadMoreProducts 
  } = useProducts();

  const { 
    addToCart, 
    getCart, 
    increaseQuantity, 
    decreaseQuantity
  } = useCart();

  const [cart, setCart] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchRecentlyViewed = async () => {
      const recentlyViewedProducts = await getRecentlyViewedProducts();
      setRecentlyViewed(recentlyViewedProducts);
    };
    
    fetchRecentlyViewed();

    // Sync cart with cookie
    const cartData = getCart();
    setCart(cartData);

  }, [getCart]);

  const handleAddToCart = (product) => {
    addToCart(product);
    setCart(getCart()); // Refresh cart from cookies
  };

  const handleIncreaseQuantity = (productId) => {
    increaseQuantity(productId);
    setCart(getCart()); 
  };

  const handleDecreaseQuantity = (productId) => {
    decreaseQuantity(productId);
    setCart(getCart());
  };

  const isInCart = (productId) => {
    return cart.some(product => product.id === productId);
  };

  const getProductQuantity = (productId) => {
    const product = cart.find(item => item.id === productId);
    return product ? product.quantity : 0;
  };

  if (loading) {
    return (
      <div className="container">
        <div className="row">
          {Array(12).fill().map((_, index) => (
            <div className="col-md-3" key={index}>
              <div className="card placeholder-glow m-1 p-1">
                <img className="placeholder" src="..." alt="placeholder" />
                <h4 className="placeholder">Item Name</h4>
                <button className="placeholder btn btn-primary disabled w-50"></button>
                <button className="placeholder btn btn-danger disabled w-50"></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <Searchbar onSearchResults={setSearchResults} />

      <div className="category-tabs">
        {categories.map((category) => (
          <button 
            key={category} 
            onClick={() => handleCategoryClick(category)}
            className={`btn btn-primary btn-sm m-1 ${selectedCategory === category ? "active" : ""}`}
          >
            {category}
          </button>
        ))}
      </div>

      {recentlyViewed.length > 0 && selectedCategory === "All" && searchResults.length === 0 && (
        <div className="recently-viewed">
          <h2 className="category-title">Recently Viewed</h2>
          <div className="product-grid">
            {recentlyViewed.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                isInCart={isInCart}
                handleDecreaseQuantity={handleDecreaseQuantity}
                getProductQuantity={getProductQuantity}
                handleIncreaseQuantity={handleIncreaseQuantity}
                handleAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </div>
      )}

      <div className="product-grid">
        {searchResults.length > 0 ? (
          searchResults.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              isInCart={isInCart}
              handleDecreaseQuantity={handleDecreaseQuantity}
              getProductQuantity={getProductQuantity}
              handleIncreaseQuantity={handleIncreaseQuantity}
              handleAddToCart={handleAddToCart}
            />
          ))
        ) : (
          products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              isInCart={isInCart}
              handleDecreaseQuantity={handleDecreaseQuantity}
              getProductQuantity={getProductQuantity}
              handleIncreaseQuantity={handleIncreaseQuantity}
              handleAddToCart={handleAddToCart}
            />
          ))
        )}
      </div>

      {!loading && products.length > 0 && searchResults.length === 0 && (
        <div className="col m-2">
          <button onClick={loadMoreProducts} className="btn btn-primary load-more-button">Load More</button>
        </div>
      )}
    </div>
  );
};

export default Products;