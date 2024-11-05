import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useUser } from '../../userContext.js';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { user } = useUser();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:3000/perfilUsuario/${user.id}`);
        if (!response.ok) {
          throw new Error('Usuario no encontrado');
        }
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchProfile();
    }
  }, [user]);

  if (loading) {
    return <ActivityIndicator size='large' color='#8A05BE' style={{ flex: 1, justifyContent: 'center' }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil de Usuario</Text>
      {profile ? (
        <View style={styles.profileContainer}>
          <Text style={styles.label}>Nombre:</Text>
          <Text style={styles.value}>{profile.nombre}</Text>

          <Text style={styles.label}>Correo electrónico:</Text>
          <Text style={styles.value}>{profile.email}</Text>

          <Text style={styles.label}>Cuenta:</Text>
          <Text style={styles.value}>{profile.numero_cuenta}</Text>

          <Text style={styles.label}>Tipo Cuenta:</Text>
          <Text style={styles.value}>{profile.tipo_cuenta}</Text>
        </View>
      ) : (
        <Text style={styles.error}>No se pudo cargar el perfil.</Text>
      )}
      <TouchableOpacity style={[styles.button, styles.homeButton]} onPress={() => navigation.navigate('EditProfile')}>
        <Text style={styles.buttonText}>Editar Perfil</Text>
      </TouchableOpacity>

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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#8A05BE',
  },
  profileContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A0072',
  },
  value: {
    fontSize: 18,
    color: '#4A0072',
    marginBottom: 10,
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
  error: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});
