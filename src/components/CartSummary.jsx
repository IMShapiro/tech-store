const CartSummary = ({ cartLength, totalQuantity, totalPrice, qualifiesForSpecial, previousPrice }) => {
    return (
      <>
        <h3>Cart Summary</h3>
        {qualifiesForSpecial && <p>You qualify for our special. Enjoy the discount.</p>}
        <p><b>{cartLength}</b> Products</p>
        <p><b>{totalQuantity}</b> Items</p>
        {previousPrice && <p><b>Previous Price:</b> {previousPrice}</p>}
        <h4>ZAR {totalPrice}</h4>
      </>
    );
  };
  
  export default CartSummary;