import { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, ScrollView, TouchableOpacity, 
  ActivityIndicator, RefreshControl 
} from 'react-native';
import { Card } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import { getFinanceStats } from '../services/api';

export default function DashboardScreen() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const data = await getFinanceStats();
      setStats(data.stats);
    } catch (error) {
      console.error('Erreur:', error);
      // Données mockées
      setStats({
        todayRecettes: 150000,
        monthRecettes: 2500000,
        monthDepenses: 1800000,
        monthSolde: 700000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>Établissement Public de Santé</Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsGrid}>
        <TouchableOpacity style={[styles.statCard, styles.cardBlue]}>
          <Ionicons name="cash" size={32} color="#3B82F6" />
          <Text style={styles.statValue}>{stats?.todayRecettes?.toLocaleString() || 0} F</Text>
          <Text style={styles.statLabel}>Aujourd'hui</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.statCard, styles.cardGreen]}>
          <Ionicons name="trending-up" size={32} color="#10B981" />
          <Text style={styles.statValue}>{(stats?.monthRecettes / 1000000).toFixed(1)}M F</Text>
          <Text style={styles.statLabel}>Ce mois</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.statCard, styles.cardRed]}>
          <Ionicons name="trending-down" size={32} color="#EF4444" />
          <Text style={styles.statValue}>{(stats?.monthDepenses / 1000000).toFixed(1)}M F</Text>
          <Text style={styles.statLabel}>Dépenses</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.statCard, styles.cardPurple]}>
          <Ionicons name="wallet" size={32} color="#8B5CF6" />
          <Text style={styles.statValue}>{(stats?.monthSolde / 1000000).toFixed(1)}M F</Text>
          <Text style={styles.statLabel}>Solde</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Actions rapides</Text>
      <View style={styles.actionsGrid}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="person-add" size={24} color="#3B82F6" />
          <Text style={styles.actionText}>Nouveau patient</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="medkit" size={24} color="#10B981" />
          <Text style={styles.actionText}>Pharmacie</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="document-text" size={24} color="#F59E0B" />
          <Text style={styles.actionText}>Rapport</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="calendar" size={24} color="#8B5CF6" />
          <Text style={styles.actionText}>Agenda</Text>
        </TouchableOpacity>
      </View>

      {/* Alerts */}
      <Card containerStyle={styles.card}>
        <Card.Title>Alertes récentes</Card.Title>
        <View style={styles.alertItem}>
          <Ionicons name="warning" size={20} color="#EF4444" />
          <Text style={styles.alertText}>Stock Paracetamol bas</Text>
        </View>
        <View style={styles.alertItem}>
          <Ionicons name="time" size={20} color="#F59E0B" />
          <Text style={styles.alertText}>3 patients en attente</Text>
        </View>
        <View style={styles.alertItem}>
          <Ionicons name="checkmark-circle" size={20} color="#10B981" />
          <Text style={styles.alertText}>Rapport validé</Text>
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1F2937' },
  subtitle: { fontSize: 14, color: '#6B7280', marginTop: 4 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 10, gap: 10 },
  statCard: {
    width: '47%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardBlue: { borderLeftWidth: 4, borderLeftColor: '#3B82F6' },
  cardGreen: { borderLeftWidth: 4, borderLeftColor: '#10B981' },
  cardRed: { borderLeftWidth: 4, borderLeftColor: '#EF4444' },
  cardPurple: { borderLeftWidth: 4, borderLeftColor: '#8B5CF6' },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#1F2937', marginTop: 8 },
  statLabel: { fontSize: 12, color: '#6B7280', marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#1F2937', marginHorizontal: 20, marginTop: 20 },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 15, gap: 15 },
  actionButton: {
    width: '43%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  actionText: { fontSize: 14, color: '#374151' },
  card: { borderRadius: 12, marginHorizontal: 15 },
  alertItem: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 },
  alertText: { fontSize: 14, color: '#4B5563' },
});