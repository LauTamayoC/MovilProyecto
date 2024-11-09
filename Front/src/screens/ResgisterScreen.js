import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountType, setAccountType] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleRegister = async () => {
    console.log('Intentando registrar usuario...');

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (!name || !email || !password || !accountNumber || !accountType) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert('Error', 'Formato de correo electrónico inválido');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/registrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          accountNumber,
          accountType,
        }),
      });
      if (!response.ok) {
        if (response.status === 400) {
          throw new Error('Solicitud incorrecta, revisa los datos');
        } else if (response.status === 500) {
          throw new Error('Error en el servidor, inténtalo más tarde');
        } else {
          throw new Error('Error desconocido');
        }
      }

      const data = await response.json();
      console.log('Usuario registrado:', data);
      Alert.alert('Éxito', 'Usuario registrado exitosamente');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error al registrar al usuario:', error);
      Alert.alert('Error', error.message || 'No se pudo registrar al usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro de Usuario</Text>
      <TextInput
        placeholder='Nombre'
        value={name}
        onChangeText={setName}
        style={styles.input}
        placeholderTextColor='#b3b3b3'
      />
      <TextInput
        placeholder='Email'
        value={email}
        onChangeText={setEmail}
        keyboardType='email-address' // Asegura que el teclado muestre el formato de email
        style={styles.input}
        placeholderTextColor='#b3b3b3'
      />
      <TextInput
        placeholder='Contraseña'
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        placeholderTextColor='#b3b3b3'
      />
      <TextInput
        placeholder='Confirmar Contraseña'
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
        placeholderTextColor='#b3b3b3'
      />
      <TextInput
        placeholder='Número de Cuenta'
        value={accountNumber}
        onChangeText={setAccountNumber}
        style={styles.input}
        placeholderTextColor='#b3b3b3'
      />
      <TextInput
        placeholder='Tipo de Cuenta (Ahorros/Corriente)'
        value={accountType}
        onChangeText={setAccountType}
        style={styles.input}
        placeholderTextColor='#b3b3b3'
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Registrando...' : 'Registrarse'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f0f0f5', // Fondo claro
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8A05BE', // Púrpura
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#8A05BE', // Púrpura
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#fff', // Blanco
    color: '#333',
  },
  button: {
    backgroundColor: '#8A05BE', // Púrpura
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff', // Blanco
    fontWeight: 'bold',
  },
});
