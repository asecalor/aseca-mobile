import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

interface Product {
  productId: number;
  quantity: number;
}

interface Order {
  id: number;
  providerId: number;
  clientId: number;
  totalAmount: number;
  status: string;
  address?: string;
  error?: boolean;
  products?: Product[];
}

export default function OrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [clientIdFilter, setClientIdFilter] = useState<string>('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`http://10.0.2.2:3000/order`);
        const data: Order[] = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      }
    };

    fetchOrders();
  }, []);

  const fetchOrderProducts = async (orderId: number) => {
    try {
      const response = await fetch(`http://10.0.2.2:3000/order/${orderId}`);
      const data: Order = await response.json();
      setOrders(prevOrders =>
        prevOrders.map(order => (order.id === orderId ? { ...order, ...data } : order))
      );
    } catch (error) {
      console.error(`Failed to fetch products for order ${orderId}:`, error);
    }
  };

  const filteredOrders = clientIdFilter
    ? orders.filter(order => order.clientId.toString() === clientIdFilter).reverse()
    : [];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Orders:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Client ID"
        value={clientIdFilter}
        onChangeText={setClientIdFilter}
        keyboardType="numeric"
      />
      {filteredOrders.map(order => (
        <TouchableOpacity
          key={order.id}
          onPress={() => fetchOrderProducts(order.id)}
          style={styles.orderContainer}
        >
          <Text style={styles.orderText}>Order ID: {order.id}</Text>
          <Text style={styles.orderText}>Provider ID: {order.providerId}</Text>
          <Text style={styles.orderText}>Client ID: {order.clientId}</Text>
          <Text style={styles.orderText}>Total Amount: {order.totalAmount}</Text>
          <Text style={styles.orderText}>Status: {order.status}</Text>
          {order.address && <Text style={styles.orderText}>Address: {order.address}</Text>}
          {order.products && order.products.length > 0 && (
            <>
              <Text style={styles.orderText}>Products:</Text>
              {order.products.map(product => (
                <View key={product.productId} style={styles.productContainer}>
                  <Text style={styles.productText}>Product ID: {product.productId}</Text>
                  <Text style={styles.productText}>Quantity: {product.quantity}</Text>
                </View>
              ))}
            </>
          )}
          {order.error && <Text style={styles.orderText}>Failed to fetch products</Text>}
        </TouchableOpacity>
      ))}
      {filteredOrders.length === 0 && <Text>No orders found</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  orderContainer: {
    marginBottom: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
  orderText: {
    fontSize: 16,
  },
  productContainer: {
    marginLeft: 16,
    marginTop: 4,
  },
  productText: {
    fontSize: 14,
  },
});
