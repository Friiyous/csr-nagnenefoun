import { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, FlatList, TouchableOpacity, 
  TextInput, ActivityIndicator, Modal 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getPatients, createPatient } from '../services/api';

interface Patient {
  id: string;
  numero: string;
  nom: string;
  prenom: string;
  genre: string;
  telephone?: string;
}

export default function PatientsScreen() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [newPatient, setNewPatient] = useState({ nom: '', prenom: '', genre: 'MASCULIN', telephone: '' });

  const fetchPatients = async () => {
    try {
      const data = await getPatients({ search });
      setPatients(data.data || []);
    } catch (error) {
      // Mock data
      setPatients([
        { id: '1', numero: 'P001', nom: 'Kouassi', prenom: 'Marie', genre: 'FEMININ', telephone: '0102030405' },
        { id: '2', numero: 'P002', nom: 'Traoré', prenom: 'Bassam', genre: 'MASCULIN', telephone: '0102030406' },
        { id: '3', numero: 'P003', nom: 'Diallo', prenom: 'Fatou', genre: 'FEMININ', telephone: '0102030407' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [search]);

  const handleAddPatient = async () => {
    await createPatient(newPatient);
    setModalVisible(false);
    setNewPatient({ nom: '', prenom: '', genre: 'MASCULIN', telephone: '' });
    fetchPatients();
  };

  const renderItem = ({ item }: { item: Patient }) => (
    <TouchableOpacity style={styles.patientCard}>
      <View style={styles.avatar}>
        <Ionicons name="person" size={24} color="white" />
      </View>
      <View style={styles.patientInfo}>
        <Text style={styles.patientName}>{item.nom} {item.prenom}</Text>
        <Text style={styles.patientDetails}>{item.numero} • {item.genre}</Text>
        {item.telephone && (
          <Text style={styles.patientPhone}>{item.telephone}</Text>
        )}
      </View>
      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Patients</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un patient..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* List */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      ) : (
        <FlatList
          data={patients}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
        />
      )}

      {/* Add Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nouveau patient</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Nom"
              value={newPatient.nom}
              onChangeText={text => setNewPatient({ ...newPatient, nom: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Prénom"
              value={newPatient.prenom}
              onChangeText={text => setNewPatient({ ...newPatient, prenom: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Téléphone"
              value={newPatient.telephone}
              onChangeText={text => setNewPatient({ ...newPatient, telephone: text })}
              keyboardType="phone-pad"
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleAddPatient}>
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
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', marginHorizontal: 20, borderRadius: 12, padding: 10 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1 },
  list: { padding: 20 },
  patientCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 10 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#3B82F6', justifyContent: 'center', alignItems: 'center' },
  patientInfo: { flex: 1, marginLeft: 12 },
  patientName: { fontSize: 16, fontWeight: '600', color: '#1F2937' },
  patientDetails: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  patientPhone: { fontSize: 12, color: '#3B82F6', marginTop: 2 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: 'white', borderRadius: 16, padding: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  input: { backgroundColor: '#f3f4f6', borderRadius: 8, padding: 12, marginBottom: 12 },
  modalButtons: { flexDirection: 'row', gap: 10, marginTop: 20 },
  cancelButton: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center' },
  cancelText: { color: '#6B7280' },
  saveButton: { flex: 1, backgroundColor: '#3B82F6', padding: 12, borderRadius: 8, alignItems: 'center' },
  saveText: { color: 'white', fontWeight: '600' },
});