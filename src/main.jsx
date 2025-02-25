import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import Home from './pages/Home.jsx'
import About from "./pages/About.jsx"
import Products from "./pages/Products.jsx"
import Cart from "./pages/Cart.jsx"
import Login from "./pages/Login.jsx"
import Contact from "./pages/Contact.jsx"
import UserContextProvider from './contexts/UserContext.jsx'
import ProductDetails from './pages/ProductDetails.jsx'
import Signup from './pages/Signup.jsx'
import Account from './pages/Account.jsx'
import Checkout from './pages/Checkout.jsx'
import { CheckoutProvider } from './contexts/CheckoutContext.jsx'

const router = createBrowserRouter([
  {
    path:"/",
    element: <App/>,
    errorElement:<h1>Error! Page not found.</h1>,
    children: [
      { index: true, element: <Home /> },
      {
        path: "/about",
        element: <About/>
      },
      {
        path: "/products",
        element: <Products/>
      },
      {
        path: "/products/:productId",
        element: <ProductDetails/>
      },
      {
        path: "/login",
        element: <Login/>
      },
      {
        path: "/signup",
        element: <Signup/>
      },
      {
        path: "/cart",
        element: <Cart/>
      },
      {
        path: "/checkout",
        element: <Checkout/>
      },
      {
        path: "/account",
        element: <Account />
      },
      {
        path: "/contact",
        element: <Contact/>
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserContextProvider>
      <CheckoutProvider>
        <RouterProvider router={router}/>
      </CheckoutProvider>
    </UserContextProvider>
  </StrictMode>,
)
