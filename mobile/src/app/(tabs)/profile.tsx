import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { authClient } from '@/lib/auth-client';

export default function ProfileScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.replace('/login');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>KG</Text>
          </View>
        </View>
        <Text style={styles.userName}>Kossi Georges-Noé</Text>
        <Text style={styles.userPhone}>+228 90 00 00 00</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>12</Text>
          <Text style={styles.statLabel}>Coopératives</Text>
        </View>
        <View style={[styles.statBox, styles.statBorder]}>
          <Text style={styles.statValue}>48</Text>
          <Text style={styles.statLabel}>Votes</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>1.2M</Text>
          <Text style={styles.statLabel}>Volume</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Paramètres du compte</Text>
        <View style={styles.menu}>
          <MenuItem 
            icon="person-outline" 
            title="Informations personnelles" 
            onPress={() => {}} 
          />
          <MenuItem 
            icon="notifications-outline" 
            title="Notifications" 
            onPress={() => {}} 
          />
          <MenuItem 
            icon="shield-checkmark-outline" 
            title="Sécurité et Confidentialité" 
            onPress={() => {}} 
          />
          <MenuItem 
            icon="help-circle-outline" 
            title="Centre d'aide" 
            onPress={() => {}} 
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Application</Text>
        <View style={styles.menu}>
          <MenuItem 
            icon="language-outline" 
            title="Langue" 
            subtitle="Français"
            onPress={() => {}} 
          />
          <MenuItem 
            icon="information-circle-outline" 
            title="À propos de CoopLedger" 
            onPress={() => {}} 
          />
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#ef4444" />
        <Text style={styles.logoutText}>Se déconnecter</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function MenuItem({ icon, title, subtitle, onPress }: { icon: any, title: string, subtitle?: string, onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        <View style={styles.menuIcon}>
          <Ionicons name={icon} size={22} color="#3e4943" />
        </View>
        <View>
          <Text style={styles.menuTitle}>{title}</Text>
          {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#F9F9F9',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#2d936c',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  avatarText: {
    fontSize: 32,
    color: '#fff',
    fontFamily: 'GoogleSansText-Bold',
  },
  userName: {
    fontSize: 24,
    color: '#1a1c1c',
    fontFamily: 'GoogleSansText-Bold',
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'GoogleSansText-Regular',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#eee',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#eee',
  },
  statValue: {
    fontSize: 18,
    color: '#1a1c1c',
    fontFamily: 'GoogleSansText-Bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'GoogleSansText-Regular',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#1a1c1c',
    fontFamily: 'GoogleSansText-Bold',
    marginBottom: 16,
  },
  menu: {
    gap: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuTitle: {
    fontSize: 15,
    color: '#1a1c1c',
    fontFamily: 'GoogleSansText-Medium',
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'GoogleSansText-Regular',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#fee2e2',
    marginTop: 16,
    marginBottom: 40,
  },
  logoutText: {
    fontSize: 16,
    color: '#ef4444',
    fontFamily: 'GoogleSansText-Medium',
  },
});
