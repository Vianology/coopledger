import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Alert, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { authClient } from "@/utils/auth-client";
import { env } from "@/config/env";

WebBrowser.maybeCompleteAuthSession();

type Role = "FARMER" | "SELLER" | "FINANCIAL_INSTITUTION";

export default function SignupScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("FARMER");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!fullName || !phone || !password || (role !== "FARMER" && !email)) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs obligatoires");
      return;
    }

    setLoading(true);
    try {
      if (role === "FARMER") {
        // Flux OTP WhatsApp pour les agriculteurs
        const response = await fetch(`${env.API_BASE_URL}/api/auth/whatsapp/send-code`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: `+228${phone}` }),
        });

        if (!response.ok) {
           const data = await response.json();
           throw new Error(data.message || "Échec de l'envoi du code");
        }

        await SecureStore.setItemAsync("signup_name", fullName);
        await SecureStore.setItemAsync("signup_phone", phone);
        await SecureStore.setItemAsync("signup_password", password);
        await SecureStore.setItemAsync("signup_role", role);

        router.push("/verify-whatsapp");
      } else {
        // Flux classique pour les autres
        const result = await authClient.signUp.email({
          name: fullName,
          email: email,
          password,
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
            router.replace("/choose-cooperative");
        }
      }
    } catch (e: any) {
      Alert.alert("Échec de l'inscription", e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image
          source={{
            uri: "https://www.figma.com/api/mcp/asset/dafc4e55-49e7-4e36-bf9e-f6bc9f7cbbb3",
          }}
          style={styles.logo}
        />
        <Text style={styles.title}>Créer mon compte</Text>
        <Text style={styles.subtitle}>
          Rejoignez notre réseau coopératif transparent.
        </Text>
      </View>

      <View style={styles.roleSelector}>
        <TouchableOpacity
          style={[styles.roleButton, role === "FARMER" && styles.roleButtonActive]}
          onPress={() => setRole("FARMER")}
        >
          <Ionicons name="leaf-outline" size={20} color={role === "FARMER" ? "#fff" : "#2d936c"} />
          <Text style={[styles.roleText, role === "FARMER" && styles.roleTextActive]}>Agriculteur</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.roleButton, role === "SELLER" && styles.roleButtonActive]}
          onPress={() => setRole("SELLER")}
        >
          <Ionicons name="cart-outline" size={20} color={role === "SELLER" ? "#fff" : "#2d936c"} />
          <Text style={[styles.roleText, role === "SELLER" && styles.roleTextActive]}>Vendeur</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.roleButton, role === "FINANCIAL_INSTITUTION" && styles.roleButtonActive]}
          onPress={() => setRole("FINANCIAL_INSTITUTION")}
        >
          <Ionicons name="business-outline" size={20} color={role === "FINANCIAL_INSTITUTION" ? "#fff" : "#2d936c"} />
          <Text style={[styles.roleText, role === "FINANCIAL_INSTITUTION" && styles.roleTextActive]}>Institution</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Input
          label="Nom complet"
          value={fullName}
          onChangeText={setFullName}
          placeholder="Entrez votre nom et prénom"
          icon={<Ionicons name="person-outline" size={20} color="#666" />}
        />

        {role !== "FARMER" && (
            <Input
                label="Adresse Email"
                value={email}
                onChangeText={setEmail}
                placeholder="exemple@mail.com"
                icon={<Ionicons name="mail-outline" size={20} color="#666" />}
                keyboardType="email-address"
            />
        )}

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
          label="Mot de passe"
          value={password}
          onChangeText={setPassword}
          placeholder="********"
          secureTextEntry
          icon={<Ionicons name="lock-closed-outline" size={20} color="#666" />}
        />

        <Button
          title={role === "FARMER" ? "Suivant (Vérification)" : "S'inscrire"}
          onPress={handleSignup}
          loading={loading}
          variant="primary"
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Déjà inscrit ? </Text>
        <Text style={styles.link} onPress={() => router.push("/login")}>
          Se connecter
        </Text>
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
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
    marginTop: 40,
  },
  logo: {
    width: 40,
    height: 40,
    marginBottom: 16,
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
    paddingHorizontal: 20,
  },
  roleSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    gap: 8,
  },
  roleButton: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#2d936c",
    gap: 4,
  },
  roleButtonActive: {
    backgroundColor: "#2d936c",
  },
  roleText: {
    fontSize: 10,
    color: "#2d936c",
    fontFamily: "GoogleSansText-Medium",
  },
  roleTextActive: {
    color: "#fff",
  },
  card: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 32,
    width: "100%",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 32,
    marginBottom: 40,
  },
  footerText: {
    fontSize: 16,
    color: "#3e4943",
    fontFamily: "GoogleSansText-Regular",
  },
  link: {
    fontSize: 16,
    color: "#2d936c",
    fontWeight: "600",
    fontFamily: "GoogleSansText-Medium",
  },
});
