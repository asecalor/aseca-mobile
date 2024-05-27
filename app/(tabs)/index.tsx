import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

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
  adress: string;
  products: Product[];
  error?: boolean;
}

export default function OrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [clientIdFilter, setClientIdFilter] = useState<string>('');
  const orderIds = [1, 2, 3, 4, 5];

  useEffect(() => {
    const fetchOrders = async () => {
      const fetchedOrders: Order[] = await Promise.all(
        orderIds.map(id => 
          fetch(`http://localhost:3000/order/${id}`)
            .then(res => res.json())
            .catch(() => ({ id, error: true }))
        )
      );
      setOrders(fetchedOrders);
    };

    fetchOrders();
  }, []);

  const filteredOrders = clientIdFilter
    ? orders.filter(order => order.clientId.toString() === clientIdFilter)
    : orders;

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
        <View key={order.id} style={styles.orderContainer}>
          {order.error ? (
            <Text style={styles.errorText}>Failed to fetch order with ID: {order.id}</Text>
          ) : (
            <>
              <Text style={styles.orderText}>Order ID: {order.id}</Text>
              <Text style={styles.orderText}>Provider ID: {order.providerId}</Text>
              <Text style={styles.orderText}>Client ID: {order.clientId}</Text>
              <Text style={styles.orderText}>Total Amount: {order.totalAmount}</Text>
              <Text style={styles.orderText}>Status: {order.status}</Text>
              <Text style={styles.orderText}>Address: {order.adress}</Text>
              <Text style={styles.orderText}>Products:</Text>
              {order.products.map(product => (
                <View key={product.productId} style={styles.productContainer}>
                  <Text style={styles.productText}>Product ID: {product.productId}</Text>
                  <Text style={styles.productText}>Quantity: {product.quantity}</Text>
                </View>
              ))}
            </>
          )}
        </View>
      ))}
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
  errorText: {
    fontSize: 16,
    color: 'red',
  },
});
