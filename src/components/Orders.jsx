import React, { useState, useEffect } from "react";
import { cancelUsersOrder, getOrders } from "../utils/orderUtils";
import { auth } from "../config/FirebaseConfig";

const parsePrice = (price) => {
  if (typeof price === 'string') {
    return parseFloat(price.replace(/[^0-9.-]+/g, ""));
  }
  return typeof price === 'number' ? price : 0;
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredOrders, setFilteredOrders] = useState([]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [statuses] = useState(["all", "pending", "completed", "shipped", "canceled","delivered"]);

  const user = auth.currentUser;

  useEffect(() => {
    const fetchOrders = async () => {
      if (user) {
        const fetchedOrders = await getOrders(user.uid);
        setOrders(fetchedOrders);
        setFilteredOrders(fetchedOrders);
      }
      setLoading(false);
    };
    fetchOrders();
  }, [user]);

  useEffect(() => {
    filterOrders();
  }, [startDate, endDate, selectedStatus, orders]);

  const filterOrders = () => {
    let filtered = orders;

    if (selectedStatus !== "all") {
      filtered = filtered.filter(order => order.status === selectedStatus);
    }

    if (startDate && endDate) {
      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime();
      filtered = filtered.filter(order => {
        const orderDate = order.createdAt.seconds * 1000;
        return orderDate >= start && orderDate <= end;
      });
    }

    setFilteredOrders(filtered);
  };

  const handleCancelOrder = async (orderId) => {
    await cancelUsersOrder(orderId);
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId ? { ...order, status: "cancelled" } : order
      )
    );
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
  };

  const handleDateChange = (e, setter) => {
    setter(e.target.value);
  };

  if (loading) {
    return (
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    );
  }

  if (!filteredOrders.length) {
    return (
      <div>
        <div className="mb-2">
          {statuses.map(status => (
            <button
              key={status}
              className={`btn btn-sm me-2 ${selectedStatus === status ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => handleStatusChange(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        <div className="d-flex">
          <input
            type="date"
            className="form-control me-2"
            value={startDate}
            onChange={(e) => handleDateChange(e, setStartDate)}
          />
          <input
            type="date"
            className="form-control"
            value={endDate}
            onChange={(e) => handleDateChange(e, setEndDate)}
          />
        </div>

        <div>
          <p>No orders found</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-3">
        <div className="mb-2">
          {statuses.map(status => (
            <button
              key={status}
              className={`btn btn-sm me-2 ${selectedStatus === status ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => handleStatusChange(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
        <div className="d-flex">
          <input
            type="date"
            className="form-control me-2"
            value={startDate}
            onChange={(e) => handleDateChange(e, setStartDate)}
          />
          <input
            type="date"
            className="form-control"
            value={endDate}
            onChange={(e) => handleDateChange(e, setEndDate)}
          />
        </div>
      </div>

      {filteredOrders.map(order => (
        <div className="m-2 p-2 card" key={order.id}>
          <h3 className="card-title">Order ID: {order.id}</h3>
          <p>Payment Reference: {order.paymentRef}</p>
          <p>Delivery Address: {order.address.street}, {order.address.city}, {order.address.suburb}, {order.address.zip}</p>
          <div>
            Items: <button class="btn btn-primary" data-bs-toggle="collapse" href={`#orderItem${order.id}`} role="button" aria-expanded="false" aria-controls={`orderItem${order.id}`}>View Items</button>
            {order.items.map(item => (
              <ul key={item.id} className="collapse" id={`orderItem${order.id}`}>
                {item.discount > 0 ? 
                (
                  <li>{item.productName} - R{item.price - (item.discount/item.price)* 100} x {item.quantity} ({item.discount}% off)</li>
                ): (
                  <li>{item.productName} - R{item.price} x {item.quantity}</li>
                )
              }
              </ul>
            ))}
          </div>
          <p>Total: ZAR {order.cartTotal}</p>
          <p>Status: {order.status}</p>
          <p>Ordered on: {new Date(order.createdAt.seconds * 1000).toLocaleDateString()}</p>
          {order.status != "canceled" && order.status != "delivered" && <button className="btn btn-danger" onClick={() => handleCancelOrder(order.id)}>Cancel Order</button>} 
        </div>
      ))}
    </div>
  );
};

export default Orders;