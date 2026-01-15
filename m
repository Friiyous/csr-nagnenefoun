import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={40} color="white" />
        </View>
        <Text style={styles.name}>Dr. Kouamé Jean</Text>
        <Text style={styles.role}>Directeur</Text>
      </View>

      {/* Menu */}
      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIcon}>
            <Ionicons name="person-outline" size={24} color="#3B82F6" />
          </View>
          <Text style={styles.menuText}>Mon profil</Text>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIcon}>
            <Ionicons name="settings-outline" size={24} color="#3B82F6" />
          </View>
          <Text style={styles.menuText}>Paramètres</Text>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIcon}>
            <Ionicons name="notifications-outline" size={24} color="#3B82F6" />
          </View>
          <Text style={styles.menuText}>Notifications</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIcon}>
            <Ionicons name="help-circle-outline" size={24} color="#3B82F6" />
          </View>
          <Text style={styles.menuText}>Aide</Text>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, styles.logout]}>
          <View style={[styles.menuIcon, { backgroundColor: '#FEE2E2' }]}>
            <Ionicons name="log-out-outline" size={24} color="#EF4444" />
          </View>
          <Text style={[styles.menuText, { color: '#EF4444' }]}>Déconnexion</Text>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {/* Version */}
      <Text style={styles.version}>EPS Manager Mobile v1.0.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { alignItems: 'center', paddingVertical: 40, backgroundColor: 'white' },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#3B82F6', justifyContent: 'center', alignItems: 'center' },
  name: { fontSize: 22, fontWeight: 'bold', color: '#1F2937', marginTop: 16 },
  role: { fontSize: 14, color: '#6B7280', marginTop: 4 },
  menu: { padding: 20 },
  menuItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 10 },
  menuIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center' },
  menuText: { flex: 1, marginLeft: 12, fontSize: 15, color: '#374151' },
  badge: { backgroundColor: '#EF4444', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
  badgeText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  logout: { marginTop: 20 },
  version: { textAlign: 'center', color: '#9CA3AF', fontSize: 12, marginTop: 20 },
});