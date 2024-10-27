import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const dummyTransactions = [
  { id: '1', date: '2024-10-01', type: 'Depósito', amount: 500 },
  { id: '2', date: '2024-10-03', type: 'Retiro', amount: -200 },
  { id: '3', date: '2024-10-05', type: 'Transferencia', amount: -150 },
  { id: '4', date: '2024-10-07', type: 'Depósito', amount: 1000 },
  { id: '5', date: '2024-10-09', type: 'Retiro', amount: -50 },
];

const TransactionItem = ({ item }) => (
  <View style={styles.transactionItem}>
    <Text style={styles.date}>{item.date}</Text>
    <Text style={styles.type}>{item.type}</Text>
    <Text style={[styles.amount, { color: item.amount > 0 ? '#4CAF50' : '#F44336' }]}>
      ${Math.abs(item.amount).toFixed(2)}
    </Text>
  </View>
);
export default function TransactionHistoryScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial de Transacciones</Text>
      <FlatList
        data={dummyTransactions}
        renderItem={({ item }) => <TransactionItem item={item} />}
        keyExtractor={item => item.id}
      />
      <TouchableOpacity
        style={[styles.button, styles.homeButton]}
        onPress={() => navigation.navigate('Cuenta')}
      >
        <Text style={styles.buttonText}>Volver a tus cuentas</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8A05BE',
    textAlign: 'center',
    marginBottom: 20,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  type: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A0072',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#8A05BE',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});