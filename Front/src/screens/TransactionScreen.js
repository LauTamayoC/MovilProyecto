import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useUser } from '../../userContext.js';

export default function TransactionScreen() {
  const navigation = useNavigation();
  const { user } = useUser();
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [originAccountNumber, setOriginAccountNumber] = useState('');
  const [originAccountInfo, setOriginAccountInfo] = useState(''); // Estado para la información de la cuenta de origen
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchOriginAccountInfo = async () => {
      console.log('User account number:', user.numero_cuenta); // Mensaje de depuración
      if (user && user.numero_cuenta) {
        try {
          const response = await fetch(`http://localhost:3000/transaccion/${user.numero_cuenta}`);
          const data = await response.json();

          if (response.ok) {
            setOriginAccountInfo(data);
            setOriginAccountNumber(user.numero_cuenta); // Establecer el número de cuenta de origen
            console.log('Numero de cuenta asignado: ', user.numero_cuenta);
          } else {
            setMessage(data.message || 'Algo salió mal al obtener la cuenta de origen');
          }
        } catch (error) {
          console.error('Error al obtener la cuenta de origen:', error);
          setMessage('No se pudo conectar con el servidor');
        }
      }
    };
    if (user) {
      fetchOriginAccountInfo();
    }
  }, [user]);

  const handleTransaction = async () => {
    if (!amount || !type || (type.toLowerCase() !== 'retiro' && !accountNumber)) {
      Alert.alert('Error', 'Todos los campos son requeridos');
      return;
    }

    console.log('Iniciando transacción con:', { amount, type, accountNumber, originAccountNumber });

    try {
      const response = await fetch('http://localhost:3000/transaccion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tipo: type,
          monto: parseFloat(amount),
          numero_cuenta_origen: originAccountNumber,
          numero_cuenta_destino: type.toLowerCase() !== 'retiro' ? accountNumber : null,
        }),
      });

      const data = await response.json();

      console.log('Datos recibidos:', data);

      if (response.ok) {
        let successMessage = '';
        switch (type.toLowerCase()) {
          case 'transferencia':
            successMessage = 'Transferencia realizada exitosamente';
            break;
          case 'deposito':
            successMessage = 'Depósito realizado exitosamente';
            break;
          case 'retiro':
            successMessage = 'Retiro realizado exitosamente';
            break;
          default:
            successMessage = 'Transacción realizada exitosamente';
        }
        setMessage(successMessage);
      } else {
        setMessage(data.message || 'Algo salió mal');
      }
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
      setMessage('No se pudo conectar con el servidor');
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
        placeholder='Tipo (Transferencia/Deposito/Retiro)'
        value={type}
        onChangeText={setType}
        style={styles.input}
        placeholderTextColor='#b19cd9'
      />

      <TextInput
        placeholder='Número de cuenta de origen'
        value={originAccountNumber}
        style={styles.input}
        placeholderTextColor='#b19cd9'
        keyboardType='numeric'
        editable={false} // Hacer que este campo no sea editable
      />

      {type.toLowerCase() !== 'retiro' && (
        <TextInput
          placeholder='Número de cuenta de destino'
          value={accountNumber}
          onChangeText={setAccountNumber}
          style={styles.input}
          placeholderTextColor='#b19cd9'
          keyboardType='numeric'
        />
      )}

      <TouchableOpacity style={styles.button} onPress={handleTransaction}>
        <Text style={styles.buttonText}>Continuar</Text>
      </TouchableOpacity>

      {message ? <Text style={styles.message}>{message}</Text> : null}

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
  message: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  accountInfo: {
    marginTop: 10,
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
});
