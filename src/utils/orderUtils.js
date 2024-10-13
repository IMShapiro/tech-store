import { db } from "../config/FirebaseConfig"
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  doc, 
  updateDoc,
  Timestamp } from "firebase/firestore";

export async function createOrder(uid, name, email, number, address, items, cartTotal, paymentRef) {
  try {
    const orderData = {
      uid,
      name,
      email,
      number,
      address,
      items,
      cartTotal,
      paymentRef,
      status: "pending",
      createdAt: new Date(),
    };

    const docRef = await addDoc(collection(db, "orders"), orderData);
  } catch (e) {
    console.error("Error adding document creating order", e);
  }
}

export async function getOrders(uid, status = null, startDate = null, endDate = null) {
  try {
    let ordersQuery = query(collection(db, "orders"), where("uid", "==", uid));
    
    if (status && status !== "all") {
      ordersQuery = query(ordersQuery, where("status", "==", status));
    }

    if (startDate && endDate) {
      ordersQuery = query(
        ordersQuery,
        where("createdAt", ">=", Timestamp.fromDate(new Date(startDate))),
        where("createdAt", "<=", Timestamp.fromDate(new Date(endDate)))
      );
    }

    const querySnapshot = await getDocs(ordersQuery);
    
    const orders = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return orders;
  } catch (e) {
    console.error("Error fetching orders: ", e);
    return [];
  }
}

export const cancelUsersOrder = async (ref) => {
  try {
    const orderDoc = doc(collection(db, "orders"), ref);
    await updateDoc(orderDoc, {
      status: "canceled"
    });
  } catch (error) {
    console.error("Error canceling order:", error);
  }
};

export const fetchOrdersWithDateRange = async (uid, startDate, endDate) => {
  let ordersQuery = query(collection(db, "orders"), where("uid", "==", uid));

  if (startDate && endDate) {
      ordersQuery = query(
          ordersQuery,
          where("createdAt", ">=", Timestamp.fromDate(new Date(startDate))),
          where("createdAt", "<=", Timestamp.fromDate(new Date(endDate)))
      );
  }

  const ordersSnapshot = await getDocs(ordersQuery);
  return ordersSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
};