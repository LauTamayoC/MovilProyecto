import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, FlatList } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { useUser } from '../../userContext'; // Cambiado a ../../userContext



export default function ReportScreen() {
  const { user } = useUser(); // Contexto de usuario para obtener numero_cuenta
  const numeroCuenta = user.numero_cuenta;
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(null);
  const [ingresosEgresos, setIngresosEgresos] = useState({});
  const [transacciones, setTransacciones] = useState([]);
  const [prestamos, setPrestamos] = useState({});
  const [estadisticas, setEstadisticas] = useState([]);

  // Función para cargar todos los datos de reportes
  const fetchReportData = async () => {
    setLoading(true);
    try {
      // 1. Balance de la cuenta
      const balanceRes = await fetch(`http://localhost:3000/reportes/balance/${numeroCuenta}`);
      const balanceData = await balanceRes.json();
      setBalance(balanceData.saldo);

      // 2. Ingresos y Egresos del último mes
      const ingresosEgresosRes = await fetch(`http://localhost:3000/reportes/ingresos-egresos/${numeroCuenta}`);
      const ingresosEgresosData = await ingresosEgresosRes.json();
      setIngresosEgresos(ingresosEgresosData);

      // 3. Resumen de transacciones por tipo
      const transaccionesRes = await fetch(`http://localhost:3000/reportes/transacciones/${numeroCuenta}`);
      const transaccionesData = await transaccionesRes.json();
      setTransacciones(transaccionesData);

      // 4. Resumen de préstamos
      const prestamosRes = await fetch(`http://localhost:3000/reportes/prestamos/${numeroCuenta}`);
      const prestamosData = await prestamosRes.json();
      setPrestamos(prestamosData);

      // 5. Estadísticas mensuales de ingresos vs egresos
      const estadisticasRes = await fetch(`http://localhost:3000/reportes/estadisticas-mensuales/${numeroCuenta}`);
      const estadisticasData = await estadisticasRes.json();
      setEstadisticas(estadisticasData);
    } catch (error) {
      console.error('Error al cargar los datos de reportes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Llamada a fetchReportData cuando la pantalla se carga
  useEffect(() => {
    fetchReportData();
  }, []);

  // Formato para el gráfico de estadísticas mensuales
  const getChartData = () => {
    return {
      labels: estadisticas.map((item) => item.mes),
      datasets: [
        {
          data: estadisticas.map((item) => item.ingresos),
          color: () => '#4CAF50', // Color para ingresos
        },
        {
          data: estadisticas.map((item) => item.egresos),
          color: () => '#F44336', // Color para egresos
        },
      ],
    };
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#8A05BE" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reportes Financieros</Text>

      {/* Balance */}
      <Text style={styles.sectionTitle}>Saldo Total: {balance ? `COP $${balance.toFixed(2)}` : 'N/A'}</Text>

      {/* Ingresos y Egresos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ingresos y Egresos (Último Mes)</Text>
        <Text>Ingresos: COP ${ingresosEgresos.ingresos?.toFixed(2)}</Text>
        <Text>Egresos: COP ${ingresosEgresos.egresos?.toFixed(2)}</Text>
      </View>

      {/* Resumen de Transacciones */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resumen de Transacciones</Text>
        <FlatList
          data={transacciones}
          keyExtractor={(item) => item.tipo}
          renderItem={({ item }) => (
            <Text>{item.tipo}: {item.cantidad} transacciones, Total: COP ${item.total.toFixed(2)}</Text>
          )}
        />
      </View>

      {/* Resumen de Préstamos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resumen de Préstamos</Text>
        <Text>Préstamos Totales: {prestamos.totalPrestamos}</Text>
        <Text>Préstamos Pendientes: {prestamos.prestamosPendientes}</Text>
        <Text>Préstamos Pagados: {prestamos.prestamosPagados}</Text>
      </View>

      {/* Gráfico de Ingresos vs Egresos (últimos 6 meses) */}
      <Text style={styles.sectionTitle}>Estadísticas Mensuales (Ingresos vs Egresos)</Text>
      <BarChart
        data={getChartData()}
        width={300}
        height={220}
        yAxisLabel="COP $"
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        verticalLabelRotation={30}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A0072',
    marginBottom: 5,
  },
});
