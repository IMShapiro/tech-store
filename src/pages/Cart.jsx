import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import CartSummary from "../components/CartSummary";
import { useCart } from "../hooks/useCart";
import { UserContext } from "../contexts/UserContext";

const Cart = () => {
  const { 
    getCart, 
    removeFromCart, 
    increaseQuantity, 
    decreaseQuantity, 
    getTotalQuantity, 
    getTotalPrice 
  } = useCart();

  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);

  const {isSignedIn} = useContext(UserContext);

  // Initialize cart and totals on mount
  useEffect(() => {
    const cartData = getCart();
    setCart(cartData);
    updateCartTotals(cartData);
  }, [getCart]);

  // Recalculate totals
  const updateCartTotals = (cartData) => {
    setTotalPrice(getTotalPrice(cartData));
    setTotalQuantity(getTotalQuantity(cartData));
  };

  // Handle cart updates
  const handleIncreaseQuantity = (productId) => {
    increaseQuantity(productId);
    const updatedCart = getCart();
    setCart(updatedCart);
    updateCartTotals(updatedCart);
  };

  const handleDecreaseQuantity = (productId) => {
    decreaseQuantity(productId);
    const updatedCart = getCart();
    // Filter out items with zero quantity
    const filteredCart = updatedCart.filter(product => product.quantity > 0);
    setCart(filteredCart);
    updateCartTotals(filteredCart);
  };

  const handleRemoveFromCart = (productId) => {
    removeFromCart(productId);
    const updatedCart = getCart();
    setCart(updatedCart);
    updateCartTotals(updatedCart);
  };

  return (
    <div className="container">
      <h1>Shopping Cart</h1>

      <div className="row">
        <div className="col-md card p-2 m-1">
          {!cart.length && <div>No Products in cart</div>}
          {cart.length > 0 && (
            <table className="table table-striped table-hover">
              <thead className="thead-dark">
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cart.map(product => (
                  <tr key={product.id}>
                    <td>{product.productName}</td>
                    <td>
                      {product.discount > 0 ? (
                        <>ZAR {(product.price - (product.discount / product.price) * 100).toFixed(2)}*</>
                      ) : (
                        <>ZAR {product.price}</>
                      )}
                    </td>
                    <td>{product.quantity}</td>
                    <td>
                      <button className="btn btn-success btn-sm m-1" onClick={() => handleIncreaseQuantity(product.id)}>+</button>
                      <button className="btn btn-warning btn-sm m-1" onClick={() => handleDecreaseQuantity(product.id)}>-</button>
                      <button className="btn btn-danger btn-sm m-1" onClick={() => handleRemoveFromCart(product.id)}>Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="col-md card p-2 m-1">
          <CartSummary
            cartLength={cart.length}
            totalQuantity={totalQuantity}
            totalPrice={totalPrice}
          />
          {isSignedIn && cart.length > 0 && <Link className="btn btn-primary" to="../checkout">Proceed to Checkout</Link>}
          {!isSignedIn && <Link className="btn btn-primary" to="../login">Proceed to Checkout</Link>}
        </div>
      </div>
    </div>
  );
};

export default Cart;