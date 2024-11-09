import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useUser } from '../../userContext.js';

export default function AccountScreen() {
  const navigation = useNavigation();
  const { user } = useUser();
  const [accountInfo, setAccountInfo] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Número de cuenta del usuario:', user.numero_cuenta); // Agrega esto para depuración
    if (!user.numero_cuenta) {
      console.error('Número de cuenta no proporcionado');
      setLoading(false);
      return;
    }

    const fetchAccountInfo = async () => {
      try {
        const response = await fetch(`http://localhost:3000/cuenta/${user.numero_cuenta}`);
        if (!response.ok) {
          throw new Error('Error al obtener la información de la cuenta');
        }
        const data = await response.json();
        console.log('Datos de la cuenta:', data);
        setAccountInfo(data);
      } catch (error) {
        console.error('Error fetching account info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountInfo();
  }, [user.accountNumber]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value);
  };

  if (loading) {
    return <ActivityIndicator size='large' color='#8A05BE' style={{ flex: 1, justifyContent: 'center' }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.accountTitle}>Información de la Cuenta</Text>
      {accountInfo ? (
        <View style={styles.accountInfoContainer}>
          <Text style={styles.accountInfoText}>Saldo Actual:</Text>
          <Text style={styles.accountInfoBalance}>{formatCurrency(accountInfo.saldo)}</Text>
        </View>
      ) : (
        <Text style={styles.errorText}>No se pudo obtener la información de la cuenta</Text>
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('TransactionHistory')}>
          <Text style={styles.buttonText}>Ver Historial de Transacciones</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.homeButton]} onPress={() => navigation.navigate('Inicio')}>
          <Text style={styles.buttonText}>Volver al Inicio</Text>
        </TouchableOpacity>
      </View>
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
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  accountTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#8A05BE',
    marginBottom: 20,
    textAlign: 'center',
  },
  accountInfoContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 40,
    alignItems: 'center',
  },
  accountInfoText: {
    fontSize: 18,
    color: '#4A0072',
  },
  accountInfoBalance: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8A05BE',
    marginTop: 10,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
});
