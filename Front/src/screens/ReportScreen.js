import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ReportScreen() {
  return (
    <View style={styles.container}>
      <View style = {styles.containerTitle}>
      <Text style = {styles.acTitle}>Reportes Financieros</Text>
      </View>
      <TouchableOpacity style = {styles.button} onPress={() => {}}>
        <Text style={styles.buttonText}>
        Generar Reporte
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: 
  { flex: 1, 
    justifyContent: 'center',
    padding: 20 ,
  },
  containerTitle: 
  { flex: 1, 
    justifyContent: 'center',
    padding: 20 ,
    alignItems: 'center'
  },
    button: {
      backgroundColor: '#8A05BE', 
      padding: 15,
      borderRadius: 5,
      alignItems: 'center',
      marginBottom: 15,
    },
    buttonText: {
      color: '#fff', 
      fontSize: 16,
      fontWeight: 'bold',
    },
    button: {
      backgroundColor: '#8A05BE', 
      paddingVertical: 15,
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 20,
    },
    acTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#4A0072', 
      marginBottom: 5,
    },
});