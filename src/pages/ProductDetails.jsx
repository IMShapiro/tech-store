import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from "../config/FirebaseConfig";
import { addToCart, getCart, increaseQuantity, decreaseQuantity } from "../utils/cartUtils.js";
import ProductActions from "../components/ProductActions";
import { addToRecentlyViewed } from '../utils/productUtils';

const ProductDetails = () => {

  const { productId } = useParams();
  const [product, setProduct] = useState(null);

  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      const productDoc = await getDoc(doc(db, 'products', productId));
      if (productDoc.exists()) {
        setProduct({ id: productDoc.id, ...productDoc.data() });
      }
    };
    fetchProduct();
    
    addToRecentlyViewed(productId)
  }, [productId]);


  const handleAddToCart = (product) => {
    addToCart(product);
    setCart(getCart());
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

  if (!product) {
    return (
      <div className="container">
      <div className="row product-grid">
          <div className="card placeholder-glow col-md-3 p-1 h-30">
            <img src="#" alt="" className="placeholder card-img-top m-1" height="200" width="150"/>
            <h2 className="placeholder card-title">Product Name</h2>
            <p className="product-price"><b className="placeholder">ZAR 00.00</b></p>
            <button className="placeholder btn btn-primary disabled w-50"></button>
          </div>
      </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="p-1">
        <button className="btn btn-danger btn-sm" onClick={()=>{
          navigate("/products")
        }}>Back</button>
      </div>
      <div className="row product-details">
        <div className="col">
          <img src={product.imageRef} alt={product.productName} className="img-fluid img-thumbnail product-image" />
          <h3>{product.productName}</h3>
          <div>
            {product.discount > 0 ? (
              <>
                <strong>Price:</strong> <span>ZAR <s>{product.price}</s> {product.price - (product.discount/product.price) * 100}</span>
                <p>{product.discount}% off</p>
              </>
            ):(
              <>
                <strong>Price:</strong> <span>ZAR{product.price}</span>
              </>
            ) 
            }
          </div>
          <div>
            <strong>Category:</strong> <p>{product.category}</p>
          </div>
          <ProductActions
            isInCart={isInCart}
            product={product}
            handleDecreaseQuantity={handleDecreaseQuantity}
            getProductQuantity={getProductQuantity}
            handleIncreaseQuantity={handleIncreaseQuantity}
            handleAddToCart={handleAddToCart}
          />
          <div>
            <strong>Description:</strong> <p>{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;