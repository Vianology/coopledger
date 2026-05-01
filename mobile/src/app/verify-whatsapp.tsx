import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

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
      Alert.alert('Error', e.message);
    }
  };

  const handleVerify = async () => {
    if (!code) {
      Alert.alert('Error', 'Please enter the verification code');
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

      Alert.alert('Success', 'Your account has been verified!');
      router.replace('/');
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Vérifier le compte</Text>
        <Text style={styles.subtitle}>
          Nous avons envoyé un code de vérification à{'\n'}
          <Text style={styles.phone}>{phoneNumber}</Text>
        </Text>
      </View>

      <View style={styles.form}>
        <Input
          label="Code de vérification"
          value={code}
          onChangeText={setCode}
          placeholder="123456"
          keyboardType="number-pad"
        />

        <Button title="Vérifier et continuer" onPress={handleVerify} loading={loading} />

        <Button
          title="Renvoyer le code"
          onPress={sendCode}
          variant="secondary"
          style={styles.resendButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
    fontFamily: 'GoogleSansText-Bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: 'GoogleSansText-Regular',
  },
  phone: {
    fontWeight: '600',
    color: '#000',
    fontFamily: 'GoogleSansText-Medium',
  },
  form: {
    width: '100%',
  },
  resendButton: {
    marginTop: 16,
    backgroundColor: 'transparent',
    borderColor: '#666',
  },
});
