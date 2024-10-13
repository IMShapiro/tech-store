import React from 'react';
import { Link } from 'react-router-dom';
import ProductActions from './ProductActions';
import "../assets/styles/ProductCard.css";

const ProductCard = ({ product, isInCart, handleDecreaseQuantity, getProductQuantity, handleIncreaseQuantity, handleAddToCart }) => {
    return (
        <div className="product" key={product.id}>
            <img src={product.imageRef} alt={product.productName} className="product-image h-30 w-30" />
            <Link to={`/products/${product.id}`} className="product-name-link">
                <h2 className="product-name">{product.productName}</h2>
            </Link>
            {product.discount > 0 ? (
                <>
                    <span className="badge text-bg-success m-1">{product.discount}% off</span>
                    <p className="product-price">
                        <b>ZAR</b> {(product.price - (product.discount / 100) * product.price).toFixed(2)} <s className="text-danger">{product.price}</s>
                    </p>
                </>
            ) : (
                <p className="product-price"><b>ZAR</b> {product.price}</p>
            )}
            <ProductActions
                isInCart={isInCart}
                product={product}
                handleDecreaseQuantity={handleDecreaseQuantity}
                getProductQuantity={getProductQuantity}
                handleIncreaseQuantity={handleIncreaseQuantity}
                handleAddToCart={handleAddToCart}
            />
        </div>
    );
};

export default ProductCard;