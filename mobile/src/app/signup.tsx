import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { authClient } from '@/lib/auth-client';
import { Ionicons } from '@expo/vector-icons';

WebBrowser.maybeCompleteAuthSession();

export default function SignupScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [cooperative, setCooperative] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!fullName || !phone || !password || !cooperative) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await authClient.signUp.email({
        email: `${phone}@coopledger.tg`, // Use phone as unique identifier for better-auth email provider
        password,
        name: fullName,
      });

      if (error) {
        Alert.alert('Échec de l\'inscription', error.message);
      } else if (data?.user) {
        router.push({
          pathname: '/verify-whatsapp',
          params: { userId: data.user.id, phoneNumber: phone },
        });
      }
    } catch (e: any) {
      Alert.alert('Erreur', e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const { data, error } = await authClient.signIn.social({
        provider: 'google',
        callbackURL: 'coopledger://auth/callback',
      });

      if (error) {
        Alert.alert('Erreur Google', error.message);
        return;
      }

      if (data?.url) {
        const result = await WebBrowser.openAuthSessionAsync(data.url, 'coopledger://auth/callback');
        if (result.type === 'success') {
          await authClient.getSession();
          router.replace('/');
        }
      }
    } catch (e: any) {
      Alert.alert('Erreur', e.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://www.figma.com/api/mcp/asset/dafc4e55-49e7-4e36-bf9e-f6bc9f7cbbb3' }}
          style={styles.logo}
        />
        <Text style={styles.title}>Créer mon compte</Text>
        <Text style={styles.subtitle}>Rejoignez notre réseau coopératif transparent.</Text>
      </View>

      <View style={styles.card}>
        <Input
          label="Nom complet"
          value={fullName}
          onChangeText={setFullName}
          placeholder="Entrez votre nom et prénom"
          icon={<Ionicons name="person-outline" size={20} color="#666" />}
        />
        <Input
          label="Numéro de téléphone"
          value={phone}
          onChangeText={setPhone}
          placeholder="XX XX XX XX"
          prefix="+228"
          icon={<Ionicons name="call-outline" size={20} color="#666" />}
          keyboardType="phone-pad"
        />
        <Input
          label="Coopérative"
          value={cooperative}
          onChangeText={setCooperative}
          placeholder="Sélectionnez votre coopérative"
          icon={<Ionicons name="people-outline" size={20} color="#666" />}
        />
        {/* Password field added for better-auth requirements although not in specific figma node provided but necessary for signUp.email */}
        <Input
          label="Mot de passe"
          value={password}
          onChangeText={setPassword}
          placeholder="********"
          secureTextEntry
          icon={<Ionicons name="lock-closed-outline" size={20} color="#666" />}
        />

        <Button title="S'inscrire" onPress={handleSignup} loading={loading} variant="primary" />

        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>OU</Text>
          <View style={styles.line} />
        </View>

        <Button
          title="Continuer avec Google"
          onPress={handleGoogleSignup}
          variant="tertiary"
          style={styles.googleButton}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Déjà inscrit ? </Text>
        <Text style={styles.link} onPress={() => router.push('/login')}>Se connecter</Text>
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
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 40,
  },
  logo: {
    width: 40,
    height: 40,
    marginBottom: 16,
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
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 32,
    width: '100%',
    boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.05)',
    elevation: 2,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  dividerText: {
    marginHorizontal: 12,
    color: '#3e4943',
    fontSize: 12,
    fontFamily: 'GoogleSansText-Regular',
    textTransform: 'uppercase',
  },
  googleButton: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
    marginBottom: 40,
  },
  footerText: {
    fontSize: 16,
    color: '#3e4943',
    fontFamily: 'GoogleSansText-Regular',
  },
  link: {
    fontSize: 16,
    color: '#2d936c',
    fontWeight: '600',
    fontFamily: 'GoogleSansText-Medium',
  },
});
