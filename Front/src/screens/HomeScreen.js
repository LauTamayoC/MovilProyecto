import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import logo from '../../assets/logo.png';
import { useUser } from '../../userContext.js';

export default function HomeScreen({ navigation }) {
  const [accountInfo, setAccountInfo] = useState('');
  const { user } = useUser();

  useEffect(() => {
    const fetchAccountInfo = async () => {
      try {
        const response = await fetch(`http://localhost:3000/principal/${user.id}`);
        const data = await response.json();
        console.log(data);
        setAccountInfo(data);
      } catch (error) {
        console.error('Error al obtener la información de la cuenta:', error);
      }
    };

    fetchAccountInfo();
  }, [user.id]);

  useEffect(() => {
    console.log(accountInfo);
  }, [accountInfo]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={logo} style={styles.logo} />
      </View>

      <Text style={styles.welcomeText}>Bienvenido a la Plataforma Banca Estebanquito</Text>

      <View>
        <Text style={styles.accountTitle2}>Cuenta</Text>
      </View>

      {accountInfo.numero_cuenta ? (
        <View style={styles.accountInfoContainer}>
          <Text style={styles.accountTitle}>{accountInfo.tipo_cuenta}</Text>
          <Text style={styles.accountNumber}>{accountInfo.numero_cuenta}</Text>
          <Text style={styles.balance}>${accountInfo.saldo}</Text>
        </View>
      ) : (
        <Text>Cargando...</Text>
      )}

      <View style={styles.buttonContainer}>
        <View style={styles.column}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Cuenta')}>
            <Text style={styles.buttonText}>Gestión de Cuentas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Transacciones')}>
            <Text style={styles.buttonText}>Transacciones</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.column}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Prestamos')}>
            <Text style={styles.buttonText}>Solicitudes de Préstamos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Reportes')}>
            <Text style={styles.buttonText}>Reportes Financieros</Text>
          </TouchableOpacity>
        </View>
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
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#8A05BE',
    marginBottom: 30,
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
    width: '100%',
    alignItems: 'center',
  },
  accountTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A0072',
    marginBottom: 5,
  },
  accountTitle2: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A0072',
    marginBottom: 5,
    textAlign: 'center',
  },
  accountNumber: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  balance: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8A05BE',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
    justifyContent: 'space-between',
    marginHorizontal: 5,
  },
  button: {
    flex: 1,
    backgroundColor: '#8A05BE',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
});
