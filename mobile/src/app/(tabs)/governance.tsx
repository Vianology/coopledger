import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Ionicons } from '@expo/vector-icons';

export default function GovernanceScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gouvernance</Text>
        <Text style={styles.subtitle}>Participez aux décisions de votre coopérative.</Text>
      </View>

      <View style={styles.bentoBox}>
        <View style={styles.volumeCard}>
          <Text style={styles.volumeLabel}>VOLUME MENSUEL SÉCURISÉ</Text>
          <Text style={styles.volumeValue}>12 450 000 FCFA</Text>
          <View style={styles.volumeTrend}>
            <Ionicons name="trending-up" size={12} color="#78d9ad" />
            <Text style={styles.volumeTrendText}>+14% ce mois</Text>
          </View>
        </View>

        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Text style={styles.statusLabel}>STATUT DU RÉSEAU</Text>
            <View style={styles.statusDot} />
          </View>
          <Text style={styles.statusValue}>Synchronisé</Text>
          <Text style={styles.statusDetail}>Dernier bloc: #8942A</Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Transactions Récentes</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Filtrer</Text>
          <Ionicons name="options-outline" size={14} color="#006949" />
        </TouchableOpacity>
      </View>

      <View style={styles.activeProposal}>
        <View style={styles.badge}>
          <Ionicons name="time-outline" size={12} color="#f59e0b" />
          <Text style={styles.badgeText}>Vote en cours</Text>
        </View>
        <Text style={styles.proposalTitle}>Achat de tracteur - Campagne 2026</Text>
        <Text style={styles.proposalDesc}>
          Décision d'investissement de 1 500 000 FCFA pour l'acquisition d'un nouveau tracteur afin d'optimiser les rendements de la prochaine saison.
        </Text>

        <View style={styles.statsBox}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Échéance</Text>
            <Text style={styles.statValue}>Dans 3 jours</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Participation actuelle</Text>
            <Text style={styles.statValue}>68%</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: '68%' }]} />
          </View>
        </View>

        <View style={styles.voteActions}>
          <Button title="OUI" onPress={() => {}} variant="primary" style={styles.voteButton} />
          <Button title="NON" onPress={() => {}} variant="secondary" style={[styles.voteButton, { backgroundColor: '#d90429', borderColor: '#d90429' }]} />
        </View>
      </View>

      <View style={styles.historySection}>
        <Text style={styles.historyTitle}>Historique des votes</Text>

        <View style={styles.historyItem}>
          <View style={styles.historyContent}>
            <Text style={styles.historyTitleText}>Rénovation de l'entrepôt principal</Text>
            <Text style={styles.historyDate}>Approuvé le 12 Oct 2023</Text>
          </View>
          <View style={[styles.historyBadge, styles.badgeAdopted]}>
            <Ionicons name="checkmark-circle" size={12} color="#17845f" />
            <Text style={styles.badgeAdoptedText}>Adopté</Text>
          </View>
        </View>

        <View style={styles.historyItem}>
          <View style={styles.historyContent}>
            <Text style={styles.historyTitleText}>Partenariat logistique externe</Text>
            <Text style={styles.historyDate}>Rejeté le 05 Sep 2023</Text>
          </View>
          <View style={[styles.historyBadge, styles.badgeRejected]}>
            <Ionicons name="close-circle" size={12} color="#93000a" />
            <Text style={styles.badgeRejectedText}>Rejeté</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F9F9F9',
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    color: '#1a1c1c',
    fontFamily: 'GoogleSansText-Bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#3e4943',
    textAlign: 'center',
    fontFamily: 'GoogleSansText-Regular',
  },
  bentoBox: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  volumeCard: {
    flex: 1,
    backgroundColor: '#006949',
    borderRadius: 48,
    padding: 20,
    justifyContent: 'center',
  },
  volumeLabel: {
    fontSize: 12,
    color: '#94f6c8',
    fontFamily: 'GoogleSansText-Medium',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  volumeValue: {
    fontSize: 24,
    color: '#fff',
    fontFamily: 'GoogleSansText-Bold',
    marginBottom: 8,
  },
  volumeTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  volumeTrendText: {
    fontSize: 12,
    color: '#78d9ad',
    fontFamily: 'GoogleSansText-Regular',
  },
  statusCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 48,
    padding: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusLabel: {
    fontSize: 12,
    color: '#6e7a72',
    fontFamily: 'GoogleSansText-Medium',
    textTransform: 'uppercase',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#006949',
  },
  statusValue: {
    fontSize: 18,
    color: '#1a1c1c',
    fontFamily: 'GoogleSansText-Bold',
    marginBottom: 4,
  },
  statusDetail: {
    fontSize: 13,
    color: '#6e7a72',
    fontFamily: 'GoogleSansText-Regular',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    color: '#1a1c1c',
    fontFamily: 'GoogleSansText-Bold',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  filterText: {
    fontSize: 12,
    color: '#006949',
    fontFamily: 'GoogleSansText-Medium',
  },
  activeProposal: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 32,
    boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.05)',
    elevation: 2,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  badgeText: {
    fontSize: 12,
    color: '#f59e0b',
    fontFamily: 'GoogleSansText-Medium',
  },
  proposalTitle: {
    fontSize: 24,
    color: '#1a1c1c',
    fontFamily: 'GoogleSansText-Bold',
    marginBottom: 12,
  },
  proposalDesc: {
    fontSize: 16,
    color: '#3e4943',
    fontFamily: 'GoogleSansText-Regular',
    lineHeight: 24,
    marginBottom: 20,
  },
  statsBox: {
    backgroundColor: '#f4f3f3',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#3e4943',
    fontFamily: 'GoogleSansText-Regular',
  },
  statValue: {
    fontSize: 12,
    color: '#1a1c1c',
    fontFamily: 'GoogleSansText-Medium',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#dadada',
    borderRadius: 3,
    marginTop: 12,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#006949',
  },
  voteActions: {
    flexDirection: 'row',
    gap: 12,
  },
  voteButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 99,
  },
  historySection: {
    marginBottom: 40,
  },
  historyTitle: {
    fontSize: 24,
    color: '#1a1c1c',
    fontFamily: 'GoogleSansText-Bold',
    marginBottom: 16,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 17,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: '#e2e2e2',
    marginBottom: 12,
  },
  historyContent: {
    flex: 1,
  },
  historyTitleText: {
    fontSize: 18,
    color: '#1a1c1c',
    fontFamily: 'GoogleSansText-Regular',
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 13,
    color: '#3e4943',
    fontFamily: 'GoogleSansText-Regular',
  },
  historyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
  },
  badgeAdopted: {
    backgroundColor: '#d1fae5',
  },
  badgeAdoptedText: {
    fontSize: 12,
    color: '#17845f',
    fontFamily: 'GoogleSansText-Medium',
  },
  badgeRejected: {
    backgroundColor: '#ffdad6',
  },
  badgeRejectedText: {
    fontSize: 12,
    color: '#93000a',
    fontFamily: 'GoogleSansText-Medium',
  },
});
