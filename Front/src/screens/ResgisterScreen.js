import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountType, setAccountType] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro de Usuario</Text>

      <TextInput 
        placeholder="Nombre" 
        value={name} 
        onChangeText={setName} 
        style={styles.input} 
        placeholderTextColor="#b3b3b3" 
      />

      <TextInput 
        placeholder="Email" 
        value={email} 
        onChangeText={setEmail} 
        style={styles.input} 
        placeholderTextColor="#b3b3b3" 
      />

      <TextInput 
        placeholder="Contraseña" 
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry 
        style={styles.input} 
        placeholderTextColor="#b3b3b3" 
      />

      <TextInput 
        placeholder="Confirmar Contraseña" 
        value={confirmPassword} 
        onChangeText={setConfirmPassword} 
        secureTextEntry 
        style={styles.input} 
        placeholderTextColor="#b3b3b3" 
      />

      <TextInput 
        placeholder="Número de Cuenta" 
        value={accountNumber} 
        onChangeText={setAccountNumber} 
        style={styles.input} 
        placeholderTextColor="#b3b3b3" 
      />

      <TextInput 
        placeholder="Tipo de Cuenta (Ahorros/Corriente)" 
        value={accountType} 
        onChangeText={setAccountType} 
        style={styles.input} 
        placeholderTextColor="#b3b3b3" 
      />

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Registrarse</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8A05BE', 
    textAlign: 'center',
    marginBottom: 20,
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
