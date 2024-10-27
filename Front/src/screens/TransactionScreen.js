import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';

export default function TransactionScreen() {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('');

  return (
    <View style={styles.container}>
      <TextInput placeholder="Monto"
      value={amount} 
      secureTextEntry
      onChangeText={setAmount} 
      style={styles.input}
      placeholderTextColor="#b19cd9" />

      <TextInput placeholder="Tipo (Transferencia/Depósito/Retiro)" 
      value={type} 
      secureTextEntry
      onChangeText={setType}
      style={styles.input}     
      placeholderTextColor="#b19cd9" />

      <TouchableOpacity style={styles.button} onPress={() => {}}>
        <Text style = {styles.buttonText}>
          Continuar
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f0f0f5', 
  },
  button: {
    backgroundColor: '#8A05BE', 
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#8A05BE', 
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#fff', 
    color: '#333', 
  },
  buttonText: {
    fontSize: 16,
    color: '#fff', 
    fontWeight: 'bold',
  },
});