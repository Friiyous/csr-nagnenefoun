import { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, FlatList, TouchableOpacity, 
  ActivityIndicator, Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getProduits } from '../services/api';

interface Produit {
  id: string;
  code: string;
  nom: string;
  categorie: string;
  unite: string;
  seuil_alerte: number;
  quantite_stock: number;
}

export default function PharmacieScreen() {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'stock' | 'alertes'>('stock');

  const fetchProduits = async () => {
    try {
      const data = await getProduits(selectedTab === 'alertes' ? 'alerte' : undefined);
      setProduits(data.data || []);
    } catch (error) {
      // Mock data
      setProduits([
        { id: '1', code: 'MED001', nom: 'Paracetamol 500mg', categorie: 'ANTALGIQUE', unite: 'cp', seuil_alerte: 100, quantite_stock: 2500 },
        { id: '2', code: 'MED002', nom: 'Amoxicilline 1g', categorie: 'ANTIBIOTIQUE', unite: 'cp', seuil_alerte: 50, quantite_stock: 45 },
        { id: '3', code: 'MED003', nom: 'Artémether+Luméfantrine', categorie: 'ANTIPALUDEEN', unite: 'cp', seuil_alerte: 20, quantite_stock: 150 },
        { id: '4', code: 'MED004', nom: 'Insuline Glargine', categorie: 'HYPOGLYCEMIANT', unite: 'flacon', seuil_alerte: 10, quantite_stock: 8 },
        { id: '5', code: 'MED005', nom: 'Chloroquine 100mg', categorie: 'ANTIPALUDEEN', unite: 'cp', seuil_alerte: 100, quantite_stock: 0 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduits();
  }, [selectedTab]);

  const getStockStatus = (produit: Produit) => {
    if (produit.quantite_stock === 0) return { color: '#EF4444', label: 'Rupture' };
    if (produit.quantite_stock <= produit.seuil_alerte) return { color: '#F59E0B', label: 'Alerte' };
    return { color: '#10B981', label: 'OK' };
  };

  const renderItem = ({ item }: { item: Produit }) => {
    const status = getStockStatus(item);
    return (
      <TouchableOpacity style={styles.produitCard}>
        <View style={styles.produitIcon}>
          <Ionicons name="medical" size={24} color="#3B82F6" />
        </View>
        <View style={styles.produitInfo}>
          <Text style={styles.produitName}>{item.nom}</Text>
          <Text style={styles.produitDetails}>{item.code} • {item.categorie}</Text>
          <Text style={styles.produitStock}>
            Stock: {item.quantite_stock} {item.unite}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: status.color + '20' }]}>
          <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const stats = {
    total: produits.length,
    alertes: produits.filter(p => p.quantite_stock <= p.seuil_alerte).length,
    ruptures: produits.filter(p => p.quantite_stock === 0).length,
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Pharmacie</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{stats.total}</Text>
          <Text style={styles.statLabel}>Produits</Text>
        </View>
        <View style={[styles.statBox, styles.statAlert]}>
          <Text style={styles.statNumber}>{stats.alertes}</Text>
          <Text style={styles.statLabel}>Alertes</Text>
        </View>
        <View style={[styles.statBox, styles.statRupture]}>
          <Text style={styles.statNumber}>{stats.ruptures}</Text>
          <Text style={styles.statLabel}>Ruptures</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'stock' && styles.activeTab]}
          onPress={() => setSelectedTab('stock')}
        >
          <Text style={[styles.tabText, selectedTab === 'stock && styles.activeTabText']}>Stock</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, selectedTab === 'alertes' && styles.activeTab]}
          onPress={() => setSelectedTab('alertes')}
        >
          <Text style={[styles.tabText, selectedTab === 'alertes' && styles.activeTabText]}>Alertes</Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      ) : (
        <FlatList
          data={produits}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1F2937' },
  statsRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 10 },
  statBox: { flex: 1, backgroundColor: 'white', borderRadius: 12, padding: 16, alignItems: 'center' },
  statAlert: { borderTopWidth: 3, borderTopColor: '#F59E0B' },
  statRupture: { borderTopWidth: 3, borderTopColor: '#EF4444' },
  statNumber: { fontSize: 24, fontWeight: 'bold', color: '#1F2937' },
  statLabel: { fontSize: 12, color: '#6B7280', marginTop: 4 },
  tabs: { flexDirection: 'row', paddingHorizontal: 20, marginTop: 20 },
  tab: { flex: 1, padding: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: '#E5E7EB' },
  activeTab: { borderBottomColor: '#3B82F6' },
  tabText: { color: '#6B7280', fontWeight: '600' },
  activeTabText: { color: '#3B82F6' },
  list: { padding: 20 },
  produitCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 10 },
  produitIcon: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center' },
  produitInfo: { flex: 1, marginLeft: 12 },
  produitName: { fontSize: 15, fontWeight: '600', color: '#1F2937' },
  produitDetails: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  produitStock: { fontSize: 12, color: '#3B82F6', marginTop: 4 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  statusText: { fontSize: 12, fontWeight: '600' },
});