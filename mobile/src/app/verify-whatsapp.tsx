import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Ionicons } from '@expo/vector-icons';

export default function VerifyWhatsAppScreen() {
  const router = useRouter();
  const { userId, phoneNumber } = useLocalSearchParams<{ userId: string; phoneNumber: string }>();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userId && phoneNumber) {
      sendCode();
    }
  }, []);

  const sendCode = async () => {
    try {
      const response = await fetch(`${process.env.API_BASE_URL}/api/auth/whatsapp/send-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, phoneNumber }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to send code');
    } catch (e: any) {
      Alert.alert('Erreur', e.message);
    }
  };

  const handleVerify = async () => {
    if (!code) {
      Alert.alert('Erreur', 'Veuillez entrer le code de vérification');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.API_BASE_URL}/api/auth/whatsapp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, code }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Verification failed');

      Alert.alert('Succès', 'Votre compte a été vérifié avec succès !');
      router.replace('/(tabs)');
    } catch (e: any) {
      Alert.alert('Erreur', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <Ionicons name="checkmark-circle-outline" size={64} color="#2d936c" />
        </View>
        <Text style={styles.title}>Vérification</Text>
        <Text style={styles.subtitle}>
          Nous avons envoyé un code de vérification à{'\n'}
          <Text style={styles.phone}>{phoneNumber}</Text>
        </Text>
      </View>

      <View style={styles.card}>
        <Input
          label="Code de vérification"
          value={code}
          onChangeText={setCode}
          placeholder="Entrez le code à 6 chiffres"
          keyboardType="number-pad"
          icon={<Ionicons name="key-outline" size={20} color="#666" />}
        />

        <Button 
          title="Vérifier et continuer" 
          onPress={handleVerify} 
          loading={loading} 
          variant="primary" 
        />

        <View style={styles.divider}>
          <Text style={styles.dividerText}>Vous n'avez pas reçu le code ?</Text>
          <TouchableOpacity onPress={sendCode}>
            <Text style={styles.resendLink}>Renvoyer le code</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: '#F9F9F9',
    justifyContent: 'center',
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#eee',
    boxShadow: '0px 2px 3px rgba(0, 0, 0, 0.05)',
    elevation: 2,
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
    lineHeight: 24,
  },
  phone: {
    fontSize: 16,
    color: '#1a1c1c',
    fontFamily: 'GoogleSansText-Bold',
  },
  card: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: '#eee',
    boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.05)',
    elevation: 2,
  },
  divider: {
    marginTop: 24,
    alignItems: 'center',
    gap: 8,
  },
  dividerText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'GoogleSansText-Regular',
  },
  resendLink: {
    fontSize: 14,
    color: '#2d936c',
    fontFamily: 'GoogleSansText-Medium',
    fontWeight: '600',
  },
});
