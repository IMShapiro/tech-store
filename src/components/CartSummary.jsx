const CartSummary = ({ cartLength, totalQuantity, totalPrice, previousPrice }) => {
    return (
      <>
        <h3>Cart Summary</h3>
        <p><b>{cartLength}</b> Products</p>
        <p><b>{totalQuantity}</b> Items</p>
        {previousPrice && <p><b>Previous Price:</b> {previousPrice}</p>}
        <h4>ZAR {totalPrice}</h4>
      </>
    );
  };
  
  export default CartSummary;