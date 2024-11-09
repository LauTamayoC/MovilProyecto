import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, FlatList } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { useUser } from '../../userContext';

export default function ReportScreen() {
  const { user } = useUser();
  const numeroCuenta = user.numero_cuenta;
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(null);
  const [ingresosEgresos, setIngresosEgresos] = useState({});
  const [transacciones, setTransacciones] = useState([]);
  const [prestamos, setPrestamos] = useState({});
  const [estadisticas, setEstadisticas] = useState([]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const balanceRes = await fetch(`http://localhost:3000/reportes/balance/${numeroCuenta}`);
      const balanceData = await balanceRes.json();
      setBalance(balanceData.saldo || 0);

      const ingresosEgresosRes = await fetch(`http://localhost:3000/reportes/ingresos-egresos/${numeroCuenta}`);
      const ingresosEgresosData = await ingresosEgresosRes.json();
      setIngresosEgresos(ingresosEgresosData || { ingresos: 0, egresos: 0 });

      const transaccionesRes = await fetch(`http://localhost:3000/reportes/transacciones/${numeroCuenta}`);
      const transaccionesData = await transaccionesRes.json();
      setTransacciones(transaccionesData || []);

      const prestamosRes = await fetch(`http://localhost:3000/reportes/prestamos/${user.id}`);
      const prestamosData = await prestamosRes.json();
      setPrestamos(prestamosData || { totalPrestamos: 0, prestamosPendientes: 0, prestamosPagados: 0 });

      const estadisticasRes = await fetch(`http://localhost:3000/reportes/estadisticas-mensuales/${numeroCuenta}`);
      const estadisticasData = await estadisticasRes.json();
      setEstadisticas(estadisticasData || []);
    } catch (error) {
      console.error('Error al cargar los datos de reportes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  const getChartData = () => ({
    labels: estadisticas.map((item) => item.mes),
    datasets: [
      {
        data: estadisticas.map((item) => item.ingresos),
        color: () => '#4CAF50',
      },
      {
        data: estadisticas.map((item) => item.egresos),
        color: () => '#F44336',
      },
    ],
  });

  if (loading) {
    return <ActivityIndicator size="large" color="#8A05BE" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reportes Financieros</Text>

      <Text style={styles.sectionTitle}>Saldo Total: {balance !== null ? `COP $${balance.toFixed(2)}` : 'N/A'}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ingresos y Egresos (Último Mes)</Text>
        <Text>Ingresos: COP ${typeof ingresosEgresos.ingresos === 'number' ? ingresosEgresos.ingresos.toFixed(2) : '0.00'}</Text>
        <Text>Egresos: COP ${typeof ingresosEgresos.egresos === 'number' ? ingresosEgresos.egresos.toFixed(2) : '0.00'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resumen de Transacciones</Text>
        <FlatList
          data={transacciones}
          keyExtractor={(item) => item.tipo}
          renderItem={({ item }) => (
            <Text>{item.tipo}: {item.cantidad} transacciones, Total: COP ${typeof item.total === 'number' ? item.total.toFixed(2) : '0.00'}</Text>
          )}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resumen de Préstamos</Text>
        <Text>Préstamos Totales: {prestamos.totalPrestamos || 0}</Text>
        <Text>Préstamos Pendientes: {prestamos.prestamosPendientes || 0}</Text>
        <Text>Préstamos Pagados: {prestamos.prestamosPagados || 0}</Text>
      </View>

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
