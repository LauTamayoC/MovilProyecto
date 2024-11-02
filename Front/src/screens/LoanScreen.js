import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, Alert, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function LoanScreen() {
  const navigation = useNavigation();
  const [amount, setAmount] = useState('');
  const [term, setTerm] = useState('');
  const [loans, setLoans] = useState([]); // Estado para almacenar los préstamos obtenidos

  const solicitarPrestamo = async () => {
    const data = {
      monto: amount,
      plazo: term,
    };

    try {
      const response = await fetch('http://localhost:3000/prestamos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        Alert.alert('Éxito', result.message);
        obtenerPrestamos(); // Llama a obtenerPrestamos para actualizar la lista después de solicitar
      } else {
        Alert.alert('Error', 'Error al solicitar préstamo: ' + result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Error en la solicitud');
    }
  };

  const obtenerPrestamos = async () => {
    try {
      const response = await fetch('http://localhost:3000/prestamos', {
        method: 'GET',
      });

      const result = await response.json();
      if (response.ok) {
        setLoans(result); // Almacena la lista de préstamos en el estado
      } else {
        Alert.alert('Error', 'Error al obtener préstamos: ' + result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'No se pudieron obtener los préstamos');
    }
  };

  useEffect(() => {
    obtenerPrestamos(); // Llama a obtenerPrestamos al cargar la pantalla
  }, []);

  return (
    <View style={styles.container}>
      <TextInput 
        placeholder="Monto del Préstamo" 
        value={amount}
        onChangeText={setAmount} 
        style={styles.input}
        placeholderTextColor="#b19cd9"
        keyboardType="numeric"
      />

      <TextInput 
        placeholder="Plazo (en meses)" 
        value={term} 
        onChangeText={setTerm} 
        style={styles.input}
        placeholderTextColor="#b19cd9"
        keyboardType="numeric"
      />
      
      <TouchableOpacity style={styles.button} onPress={solicitarPrestamo}>
        <Text style={styles.buttonText}>Solicitar préstamo</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, styles.homeButton]}
        onPress={() => navigation.navigate('Inicio')}
      >
        <Text style={styles.buttonText}>Volver al Inicio</Text>
      </TouchableOpacity>

      {/* Lista de préstamos obtenidos */}
      <FlatList
        data={loans}
        keyExtractor={(item) => item.id.toString()} // Asegúrate de que cada préstamo tenga un ID único
        renderItem={({ item }) => (
          <View style={styles.loanItem}>
            <Text>Monto: {item.monto}</Text>
            <Text>Plazo: {item.plazo} meses</Text>
          </View>
        )}
      />
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
  loanItem: {
    backgroundColor: '#e6e6fa',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
});
