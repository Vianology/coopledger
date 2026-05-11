import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Ionicons } from '@expo/vector-icons';
import { authClient, getAuthToken } from '@/utils/auth-client';
import { env } from '@/config/env';

export default function HomeScreen() {
  const [userData, setUserData] = useState<any>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const session = await authClient.getSession();

        if (session.data) {
          setUserData(session.data.user);

          const response = await fetch(`${env.API_BASE_URL}/api/user/dashboard`, {
            headers: { 'Authorization': `Bearer ${await getAuthToken()}` },
          });
          const data = await response.json();
          setDashboardData(data);
        }
      } catch (e) {
        console.error('Error loading dashboard data:', e);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2d936c" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Bonjour,</Text>
          <Text style={styles.userName}>{userData?.name || 'Utilisateur'}</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color="#1a1c1c" />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>

      <View style={styles.walletCard}>
        <Text style={styles.walletLabel}>MON PORTEFEUILLE</Text>
        <Text style={styles.walletValue}>
          {dashboardData?.balance || '0'} {dashboardData?.currency || 'FCFA'}
        </Text>
        <View style={styles.walletActions}>
          <Button title="Envoyer" variant="primary" style={styles.actionButton} onPress={() => {}} />
          <Button title="Recevoir" variant="secondary" style={styles.actionButton} onPress={() => {}} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mes Coopératives</Text>
        <View style={styles.coopList}>
          {dashboardData?.cooperatives?.map((coop: any, index: number) => (
            <View key={coop.id || index} style={styles.coopItem}>
              <View style={styles.coopIcon}>
                <Ionicons name="leaf" size={24} color="#2d936c" />
              </View>
              <View style={styles.coopInfo}>
                <Text style={styles.coopName}>{coop.name}</Text>
                <Text style={styles.coopStatus}>Active</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </View>
          )) || <Text style={styles.emptyText}>Aucune coopérative rejointe.</Text>}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Activité Récente</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>Voir tout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.activityList}>
          {dashboardData?.transactions?.map((tx: any, index: number) => (
            <View key={tx.id || index} style={styles.activityItem}>
              <View style={[styles.activityIcon, {
                backgroundColor: tx.type === 'deposit' ? '#d1fae5' : tx.type === 'withdrawal' ? '#fee2e2' : '#dbeafe'
              }]}>
                <Ionicons
                  name={tx.type === 'deposit' ? "arrow-down" : tx.type === 'withdrawal' ? "arrow-up" : "cube"}
                  size={20}
                  color={tx.type === 'deposit' ? "#2d936c" : tx.type === 'withdrawal' ? "#ef4444" : "#3b82f6"}
                />
              </View>
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>{tx.description || tx.type}</Text>
                <Text style={styles.activityDate}>
                  {new Date(tx.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
              <Text style={tx.type === 'deposit' ? styles.activityAmountPositive : styles.activityAmountNegative}>
                {tx.type === 'deposit' ? '+' : '-'} {tx.amount} FCFA
              </Text>
            </View>
          )) || <Text style={styles.emptyText}>Aucune transaction récente.</Text>}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#F9F9F9',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  greeting: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'GoogleSansText-Regular',
  },
  userName: {
    fontSize: 24,
    color: '#1a1c1c',
    fontFamily: 'GoogleSansText-Bold',
  },
  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  notificationBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ef4444',
    borderWidth: 2,
    borderColor: '#fff',
  },
  walletCard: {
    backgroundColor: '#2d936c',
    borderRadius: 32,
    padding: 24,
    marginBottom: 32,
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    elevation: 5,
  },
  walletLabel: {
    fontSize: 12,
    color: '#94f6c8',
    fontFamily: 'GoogleSansText-Medium',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  walletValue: {
    fontSize: 32,
    color: '#fff',
    fontFamily: 'GoogleSansText-Bold',
    marginBottom: 24,
  },
  walletActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 99,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#1a1c1c',
    fontFamily: 'GoogleSansText-Bold',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: '#2d936c',
    fontFamily: 'GoogleSansText-Medium',
  },
  coopList: {
    gap: 12,
  },
  coopItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#eee',
  },
  coopIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  coopInfo: {
    flex: 1,
  },
  coopName: {
    fontSize: 16,
    color: '#1a1c1c',
    fontFamily: 'GoogleSansText-Medium',
  },
  coopStatus: {
    fontSize: 13,
    color: '#666',
    fontFamily: 'GoogleSansText-Regular',
  },
  activityList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#eee',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 15,
    color: '#1a1c1c',
    fontFamily: 'GoogleSansText-Medium',
  },
  activityDate: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'GoogleSansText-Regular',
  },
  activityAmountPositive: {
    fontSize: 15,
    color: '#2d936c',
    fontFamily: 'GoogleSansText-Bold',
  },
  activityAmountNegative: {
    fontSize: 15,
    color: '#ef4444',
    fontFamily: 'GoogleSansText-Bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontFamily: 'GoogleSansText-Regular',
    marginVertical: 20,
  },
});
