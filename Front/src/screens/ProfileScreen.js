import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function ProfileScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.containerTitle}>     
        <Text style={styles.accountTitleP}>Perfil del Usuario</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text>Nombre</Text>
        <Text>Apellidos</Text>
        <Text>Telefono</Text>
        <Text>Email</Text>
      </View>

      <TouchableOpacity 
        onPress={() => {}}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Editar perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, styles.homeButton]}
        onPress={() => navigation.navigate('Inicio')}
      >
        <Text style={styles.buttonText}>Volver al Inicio</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20 
  },
    containerTitle: { 
      height: 50, 
      padding: 10 ,
      alignItems: 'center',
    },
    imageContainer: {
      width: '100%', 
      height: '50%', 
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
    },
    image: {
      width: '100%', 
      height: '100%', 
      borderRadius: 100, 
    },
    button: {
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
    },
    accountTitleP: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#4A0072', 
      marginBottom: 5,
    },
    infoContainer: {
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
    justifyContent: 'center'
  },
});