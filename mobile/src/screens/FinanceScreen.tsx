import { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, FlatList, TouchableOpacity, 
  ActivityIndicator, Modal, TextInput 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getTransactions, getFinanceStats, createTransaction } from '../services/api';

interface Transaction {
  id: string;
  type: string;
  categorie: string;
  montant: number;
  description?: string;
  date: string;
  reference: string;
}

export default function FinanceScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTransaction, setNewTransaction] = useState({ type: 'RECETTE', categorie: '', montant: '', description: '' });

  const fetchData = async () => {
    try {
      const [txData, statsData] = await Promise.all([
        getTransactions({}),
        getFinanceStats(),
      ]);
      setTransactions(txData.data || []);
      setStats(statsData.stats);
    } catch (error) {
      // Mock data
      setTransactions([
        { id: '1', type: 'RECETTE', categorie: 'Consultation', montant: 15000, description: 'Consultations', date: '2024-12-01', reference: 'R001' },
        { id: '2', type: 'DEPENSE', categorie: 'Pharmacie', montant: 5000, description: 'Achat', date: '2024-12-01', reference: 'D001' },
        { id: '3', type: 'RECETTE', categorie: 'Hospitalisation', montant: 45000, description: 'Chambre 3', date: '2024-12-02', reference: 'R002' },
      ]);
      setStats({ totalRecettes: 60000, totalDepenses: 5000, solde: 55000 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddTransaction = async () => {
    await createTransaction({
      ...newTransaction,
      montant: parseInt(newTransaction.montant),
    });
    setModalVisible(false);
    setNewTransaction({ type: 'RECETTE', categorie: '', montant: '', description: '' });
    fetchData();
  };

  const renderItem = ({ item }: { item: Transaction }) => (
    <View style={styles.txCard}>
      <View style={[styles.txIcon, { backgroundColor: item.type === 'RECETTE' ? '#D1FAE5' : '#FEE2E2' }]}>
        <Ionicons 
          name={item.type === 'RECETTE' ? 'arrow-down' : 'arrow-up'} 
          size={20} 
          color={item.type === 'RECETTE' ? '#10B981' : '#EF4444'} 
        />
      </View>
      <View style={styles.txInfo}>
        <Text style={styles.txCategory}>{item.categorie}</Text>
        <Text style={styles.txDesc}>{item.description}</Text>
        <Text style={styles.txDate}>{item.date}</Text>
      </View>
      <Text style={[styles.txAmount, { color: item.type === 'RECETTE' ? '#10B981' : '#EF4444' }]}>
        {item.type === 'RECETTE' ? '+' : '-'}{item.montant.toLocaleString()} F
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Finance</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="trending-up" size={24} color="#10B981" />
          <Text style={styles.statValue}>{stats?.totalRecettes?.toLocaleString() || 0} F</Text>
          <Text style={styles.statLabel}>Recettes</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="trending-down" size={24} color="#EF4444" />
          <Text style={styles.statValue}>{stats?.totalDepenses?.toLocaleString() || 0} F</Text>
          <Text style={styles.statLabel}>Dépenses</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="wallet" size={24} color="#8B5CF6" />
          <Text style={styles.statValue}>{stats?.solde?.toLocaleString() || 0} F</Text>
          <Text style={styles.statLabel}>Solde</Text>
        </View>
      </View>

      {/* List */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      ) : (
        <FlatList
          data={transactions}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
        />
      )}

      {/* Add Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nouvelle transaction</Text>
            
            <View style={styles.typeButtons}>
              <TouchableOpacity 
                style={[styles.typeBtn, newTransaction.type === 'RECETTE' && styles.typeBtnActive]}
                onPress={() => setNewTransaction({ ...newTransaction, type: 'RECETTE' })}
              >
                <Ionicons name="arrow-down" size={16} color={newTransaction.type === 'RECETTE' ? 'white' : '#10B981'} />
                <Text style={[styles.typeBtnText, newTransaction.type === 'RECETTE' && { color: 'white' }]}>Recette</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.typeBtn, newTransaction.type === 'DEPENSE' && styles.typeBtnActive]}
                onPress={() => setNewTransaction({ ...newTransaction, type: 'DEPENSE' })}
              >
                <Ionicons name="arrow-up" size={16} color={newTransaction.type === 'DEPENSE' ? 'white' : '#EF4444'} />
                <Text style={[styles.typeBtnText, newTransaction.type === 'DEPENSE' && { color: 'white' }]}>Dépense</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Catégorie"
              value={newTransaction.categorie}
              onChangeText={text => setNewTransaction({ ...newTransaction, categorie: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Montant"
              value={newTransaction.montant}
              onChangeText={text => setNewTransaction({ ...newTransaction, montant: text })}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={newTransaction.description}
              onChangeText={text => setNewTransaction({ ...newTransaction, description: text })}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleAddTransaction}>
                <Text style={styles.saveText}>Enregistrer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1F2937' },
  addButton: { backgroundColor: '#3B82F6', borderRadius: 25, padding: 12 },
  statsContainer: { flexDirection: 'row', paddingHorizontal: 20, gap: 10 },
  statCard: { flex: 1, backgroundColor: 'white', borderRadius: 12, padding: 16, alignItems: 'center' },
  statValue: { fontSize: 16, fontWeight: 'bold', color: '#1F2937', marginTop: 8 },
  statLabel: { fontSize: 11, color: '#6B7280', marginTop: 4 },
  list: { padding: 20 },
  txCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 10 },
  txIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  txInfo: { flex: 1, marginLeft: 12 },
  txCategory: { fontSize: 15, fontWeight: '600', color: '#1F2937' },
  txDesc: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  txDate: { fontSize: 11, color: '#9CA3AF', marginTop: 2 },
  txAmount: { fontSize: 15, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: 'white', borderRadius: 16, padding: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  typeButtons: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  typeBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB' },
  typeBtnActive: { backgroundColor: '#3B82F6', borderColor: '#3B82F6' },
  typeBtnText: { fontWeight: '600' },
  input: { backgroundColor: '#f3f4f6', borderRadius: 8, padding: 12, marginBottom: 12 },
  modalButtons: { flexDirection: 'row', gap: 10, marginTop: 20 },
  cancelButton: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center' },
  cancelText: { color: '#6B7280' },
  saveButton: { flex: 1, backgroundColor: '#3B82F6', padding: 12, borderRadius: 8, alignItems: 'center' },
  saveText: { color: 'white', fontWeight: '600' },
});