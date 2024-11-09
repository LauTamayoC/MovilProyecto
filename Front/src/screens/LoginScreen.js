import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useUser } from '../../userContext.js';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useUser();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Formato de email inválido');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          contrasena: password,
        }),
      });
  
      // Verifica si la respuesta es exitosa antes de procesar JSON
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData ? errorData.message : 'Error en el servidor';
        Alert.alert('Error', errorMessage);
        return;
      }
  
      const data = await response.json(); // Convierte la respuesta a JSON
      setUser({ id: data.userId, numero_cuenta: data.accountNumber });
  
      console.log('Usuario autenticado:', data);
      Alert.alert('Éxito', 'Inicio de sesión exitoso');
      navigation.replace('Main');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      Alert.alert('Error', 'No se pudo iniciar sesión. Verifica tu conexión.');
    }
  };
  

  return (
    <View style={styles.containerdef}>
      <View style={styles.logoContainer}>
        <Image source={require('../../assets/logodef.png')} style={styles.logo} />
      </View>
      <View style={styles.container}>
        <Text style={styles.title}>Iniciar Sesión</Text>
        <TextInput
          placeholder='Email'
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          placeholderTextColor='#b19cd9'
        />
        <TextInput
          placeholder='Contraseña'
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          placeholderTextColor='#b19cd9'
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerdef: {
    flex: 1,
    backgroundColor: '#f0f0f5',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f0f0f5',
  },
  logoContainer: {
    flexDirection: 'row', // Asegura que los elementos se alineen en fila
    justifyContent: 'flex-start', // Alinea a la izquierda
    paddingTop: 10,
  },
  logo: {
    width: 200,
    height: 200,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#8A05BE',
  },
  input: {
    borderWidth: 1,
    borderColor: '#8A05BE',
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
    color: '#4A0072',
  },
  button: {
    backgroundColor: '#8A05BE',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  secondaryButton: {
    backgroundColor: '#4A0072',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
