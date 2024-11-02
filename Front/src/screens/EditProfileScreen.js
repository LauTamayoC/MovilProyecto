import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';

export default function EditProfileScreen({ route, navigation }) {
  const { userId } = route.params; 
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [accountType, setAccountType] = useState('');

  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/getUsuario/${userId}`);
        const { nombre, email, tipo_cuenta } = response.data;
        setName(nombre);
        setEmail(email);
        setAccountType(tipo_cuenta);
      } catch (error) {
        console.error("Error al cargar los datos del usuario:", error);
      }
    };
    fetchUserData();
  }, [userId]);

  
  const handleSave = async () => {
    try {
      const response = await axios.put(`http://localhost:8081/editarUsuario/${userId}`, {
        name,
        email,
        accountType,
      });

      if (response.data.message) {
        Alert.alert('Éxito', response.data.message);
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      Alert.alert('Error', 'No se pudo actualizar el perfil');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Perfil</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Tipo de cuenta"
        value={accountType}
        onChangeText={setAccountType}
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Guardar cambios</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f3f3f3',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8A05BE',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#8A05BE',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#8A05BE',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#666',
  },
});
