import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { authClient } from "@/utils/auth-client";
import { env } from "@/config/env";

export default function VerifyWhatsAppScreen() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");

  useEffect(() => {
    loadPhone();
  }, []);

  const loadPhone = async () => {
      const p = await SecureStore.getItemAsync("signup_phone");
      if (p) setPhone(p);
  };

  const sendCode = async () => {
    try {
      const response = await fetch(
        `${env.API_BASE_URL}/api/auth/whatsapp/send-code`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: `+228${phone}` }),
        },
      );
      if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Failed to send code");
      }
      Alert.alert("Succès", "Code renvoyé !");
    } catch (e: any) {
      Alert.alert("Erreur", e.message);
    }
  };

  const handleVerify = async () => {
    if (!code) {
      Alert.alert("Erreur", "Veuillez entrer le code de vérification");
      return;
    }

    setLoading(true);
    try {
      // 1. Vérifier l'OTP
      const response = await fetch(
        `${env.API_BASE_URL}/api/auth/whatsapp/verify`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: `+228${phone}`, code }),
        },
      );
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Verification failed");

      // 2. Procéder à l'inscription réelle (email fictif)
      const name = await SecureStore.getItemAsync("signup_name");
      const password = await SecureStore.getItemAsync("signup_password");
      const role = await SecureStore.getItemAsync("signup_role");

      const result = await authClient.signUp.email({
        name: name!,
        email: `${phone}@coopledger.tg`,
        password: password!,
        fetchOptions: {
          body: {
            data: {
              role: role,
              phoneNumber: `+228${phone}`,
            }
          }
        }
      });

      if (result.data?.user) {
          // Nettoyage
          await SecureStore.deleteItemAsync("signup_name");
          await SecureStore.deleteItemAsync("signup_phone");
          await SecureStore.deleteItemAsync("signup_password");
          await SecureStore.deleteItemAsync("signup_role");

          Alert.alert("Succès", "Votre compte a été créé et vérifié !");
          router.replace("/choose-cooperative");
      }
    } catch (e: any) {
      Alert.alert("Erreur", e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <Ionicons name="logo-whatsapp" size={64} color="#25D366" />
        </View>
        <Text style={styles.title}>Vérification WhatsApp</Text>
        <Text style={styles.subtitle}>
          Nous avons envoyé un code de vérification au{"\n"}
          <Text style={styles.phone}>+228 {phone}</Text>
        </Text>
      </View>

      <View style={styles.card}>
        <Input
          label="Code de vérification"
          value={code}
          onChangeText={setCode}
          placeholder="123456"
          keyboardType="number-pad"
          icon={<Ionicons name="key-outline" size={20} color="#666" />}
        />

        <Button
          title="Vérifier et S'inscrire"
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
    backgroundColor: "#F9F9F9",
    justifyContent: "center",
    paddingTop: 60,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#eee",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  title: {
    fontSize: 28,
    color: "#1a1c1c",
    fontFamily: "GoogleSansText-Bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#3e4943",
    textAlign: "center",
    fontFamily: "GoogleSansText-Regular",
    lineHeight: 24,
  },
  phone: {
    fontSize: 16,
    color: "#1a1c1c",
    fontFamily: "GoogleSansText-Bold",
  },
  card: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: "#eee",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  divider: {
    marginTop: 24,
    alignItems: "center",
    gap: 8,
  },
  dividerText: {
    fontSize: 14,
    color: "#666",
    fontFamily: "GoogleSansText-Regular",
  },
  resendLink: {
    fontSize: 14,
    color: "#2d936c",
    fontFamily: "GoogleSansText-Medium",
    fontWeight: "600",
  },
});
