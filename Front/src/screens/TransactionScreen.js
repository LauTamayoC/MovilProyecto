import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function TransactionScreen() {
  const navigation = useNavigation();
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  const handleTransaction = async () => {
    if (!amount || !type || !accountNumber) {
      Alert.alert('Error', 'Todos los campos son requeridos');
      return;
    }

    console.log('Iniciando transacción con:', { amount, type, accountNumber });

    try {
      const response = await fetch('http://localhost:3000/transaccion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tipo: type,
          monto: parseFloat(amount),
          numero_cuenta_destino: accountNumber,
        }),
      });

      const data = await response.json();

      console.log('Datos recibidos:', data);

      if (response.ok) {
        Alert.alert('Éxito', 'Transacción creada exitosamente');
      } else {
        Alert.alert('Error', data.message || 'Algo salió mal');
      }
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
      Alert.alert('Error', 'No se pudo conectar con el servidor');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder='Monto'
        value={amount}
        onChangeText={setAmount}
        style={styles.input}
        placeholderTextColor='#b19cd9'
        keyboardType='numeric'
      />

      <TextInput
        placeholder='Tipo (Transferencia/deposito/Retiro)'
        value={type}
        onChangeText={setType}
        style={styles.input}
        placeholderTextColor='#b19cd9'
      />

      <TextInput
        placeholder='Número de cuenta'
        value={accountNumber}
        onChangeText={setAccountNumber}
        style={styles.input}
        placeholderTextColor='#b19cd9'
        keyboardType='numeric'
      />

      <TouchableOpacity style={styles.button} onPress={handleTransaction}>
        <Text style={styles.buttonText}>Continuar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.homeButton]} onPress={() => navigation.navigate('Inicio')}>
        <Text style={styles.buttonText}>Volver al Inicio</Text>
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
  homeButton: {
    backgroundColor: '#6A05BE',
  },
});
