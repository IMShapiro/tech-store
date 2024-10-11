const ProductActions = ({
    isInCart,
    product, 
    handleDecreaseQuantity,
    getProductQuantity,
    handleIncreaseQuantity, 
    handleAddToCart}) => {
    return (
        <div className="product-actions">
            {isInCart(product.id) ? (
            <div className="quantity-controls">
                <button className="btn btn-danger btn-sm" onClick={() => handleDecreaseQuantity(product.id)}>-</button>
                <span><b className="m-1">{getProductQuantity(product.id)}</b></span>
                <button className="btn btn-primary btn-sm" onClick={() => handleIncreaseQuantity(product.id)}>+</button>
            </div>
            ) : (
            <button className="btn btn-primary" onClick={() => handleAddToCart(product)}>Add to Cart</button>
            )}
        </div>
    )
}

export default ProductActions