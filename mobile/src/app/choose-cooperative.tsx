import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { authClient, getAuthToken } from "@/utils/auth-client";
import { env } from "@/config/env";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";

interface FileAsset {
  uri: string;
  name: string;
  type: string;
}

export default function ChooseCooperativeScreen() {
  const router = useRouter();
  const [cooperatives, setCooperatives] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [founders, setFounders] = useState("");
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  // Documents
  const [logo, setLogo] = useState<FileAsset | null>(null);
  const [statusDoc, setStatusDoc] = useState<FileAsset | null>(null);
  const [proofDoc, setProofDoc] = useState<FileAsset | null>(null);
  const [identityDoc, setIdentityDoc] = useState<FileAsset | null>(null);
  const [businessPlanDoc, setBusinessPlanDoc] = useState<FileAsset | null>(null);

  useEffect(() => {
    fetchCooperatives();
  }, []);

  const fetchCooperatives = async () => {
    try {
      const token = await getAuthToken();
      const response = await fetch(`${env.API_BASE_URL}/api/cooperatives`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const data = await response.json();
      setCooperatives(Array.isArray(data) ? data : []);
    } catch (e: any) {
      console.error("Echec de la récupération des coopératives", e);
    }
  };

  const pickDocument = async (type: "logo" | "status" | "proof" | "identity" | "business") => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: type === "logo" ? "image/*" : "application/pdf",
      });

      if (!result.canceled) {
        const asset = {
          uri: result.assets[0].uri,
          name: result.assets[0].name,
          type: result.assets[0].mimeType || (type === "logo" ? "image/jpeg" : "application/pdf"),
        };

        if (type === "logo") setLogo(asset);
        if (type === "status") setStatusDoc(asset);
        if (type === "proof") setProofDoc(asset);
        if (type === "identity") setIdentityDoc(asset);
        if (type === "business") setBusinessPlanDoc(asset);
      }
    } catch (err) {
      console.error("Error picking document", err);
    }
  };

  const handleCreate = async () => {
    if (!name || !description || !statusDoc || !proofDoc || !identityDoc || !founders) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs obligatoires et ajouter les documents requis.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      const token = await getAuthToken();
      formData.append("name", name);
      formData.append("description", description);

      const foundersArray = founders.split(",").map(f => f.trim());
      foundersArray.forEach(f => formData.append("founders[]", f));

      if (logo) {
        formData.append("logo", {
          uri: logo.uri,
          name: logo.name,
          type: logo.type,
        } as any);
      }

      formData.append("status_document", {
        uri: statusDoc.uri,
        name: statusDoc.name,
        type: statusDoc.type,
      } as any);

      formData.append("proof_document", {
        uri: proofDoc.uri,
        name: proofDoc.name,
        type: proofDoc.type,
      } as any);

      formData.append("identity_document", {
        uri: identityDoc.uri,
        name: identityDoc.name,
        type: identityDoc.type,
      } as any);

      if (businessPlanDoc) {
        formData.append("business_plan_document", {
          uri: businessPlanDoc.uri,
          name: businessPlanDoc.name,
          type: businessPlanDoc.type,
        } as any);
      }

      const response = await fetch(`${env.API_BASE_URL}/api/cooperatives/create`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.message || "Failed to create cooperative");
      }

      Alert.alert("Succès", "Coopérative créée avec succès ! Elle est en attente de validation.");
      router.replace("/(tabs)");
    } catch (e: any) {
      Alert.alert("Erreur", e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (cooperativeId: string) => {
    setLoading(true);
    try {
      const token = await getAuthToken();
      const response = await fetch(`${env.API_BASE_URL}/api/cooperatives/join`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ cooperativeId }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Failed to join cooperative");
      }

      Alert.alert("Succès", "Votre demande d'adhésion a été envoyée !");
      router.replace("/(tabs)");
    } catch (e: any) {
      Alert.alert("Erreur", e.message);
    } finally {
      setLoading(false);
    }
  };

  const renderDocStatus = (doc: FileAsset | null) => (
    <View style={styles.docStatus}>
        {doc ? (
            <Ionicons name="checkmark-circle" size={20} color="#2d936c" />
        ) : (
            <Ionicons name="ellipse-outline" size={20} color="#ccc" />
        )}
        <Text style={[styles.docText, doc && styles.docTextActive]}>
            {doc ? doc.name : "Aucun fichier"}
        </Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ma Coopérative</Text>
        <Text style={styles.subtitle}>
          Créez votre propre coopérative ou rejoignez-en une existante pour
          commencer.
        </Text>
      </View>

      {!creating ? (
        <View style={styles.selectionSection}>
          <Text style={styles.sectionTitle}>Rejoindre une coopérative</Text>
          <FlatList
            data={cooperatives}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.coopItem}>
                <View style={styles.coopInfo}>
                  <Text style={styles.coopName}>{item.name}</Text>
                  <Text style={styles.coopDesc}>{item.description}</Text>
                </View>
                <Button
                  title="Rejoindre"
                  onPress={() => handleJoin(item.id)}
                  variant="primary"
                  style={styles.joinButton}
                />
              </View>
            )}
            scrollEnabled={false}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                Aucune coopérative disponible pour le moment.
              </Text>
            }
          />

          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>OU</Text>
            <View style={styles.line} />
          </View>

          <Button
            title="Créer une coopérative"
            onPress={() => setCreating(true)}
            variant="secondary"
          />
        </View>
      ) : (
        <View style={styles.creationSection}>
          <Text style={styles.sectionTitle}>
            Créer une nouvelle coopérative
          </Text>
          <Input
            label="Nom de la coopérative"
            value={name}
            onChangeText={setName}
            placeholder="ex: Coop-Café Togo"
          />
          <Input
            label="Description"
            value={description}
            onChangeText={setDescription}
            placeholder="Décrivez vos objectifs..."
            multiline
          />
          <Input
            label="Fondateurs (séparés par des virgules)"
            value={founders}
            onChangeText={setFounders}
            placeholder="Nom 1, Nom 2..."
          />

          <Text style={styles.docLabel}>Documents obligatoires (PDF)</Text>

          <TouchableOpacity style={styles.uploadBtn} onPress={() => pickDocument("logo")}>
              <Ionicons name="image-outline" size={24} color="#2d936c" />
              <Text style={styles.uploadBtnText}>Logo de la coopérative</Text>
          </TouchableOpacity>
          {renderDocStatus(logo)}

          <TouchableOpacity style={styles.uploadBtn} onPress={() => pickDocument("status")}>
              <Ionicons name="document-text-outline" size={24} color="#2d936c" />
              <Text style={styles.uploadBtnText}>Statuts de la coopérative</Text>
          </TouchableOpacity>
          {renderDocStatus(statusDoc)}

          <TouchableOpacity style={styles.uploadBtn} onPress={() => pickDocument("proof")}>
              <Ionicons name="ribbon-outline" size={24} color="#2d936c" />
              <Text style={styles.uploadBtnText}>Preuve d'existence</Text>
          </TouchableOpacity>
          {renderDocStatus(proofDoc)}

          <TouchableOpacity style={styles.uploadBtn} onPress={() => pickDocument("identity")}>
              <Ionicons name="card-outline" size={24} color="#2d936c" />
              <Text style={styles.uploadBtnText}>Pièce d'identité (Représentant)</Text>
          </TouchableOpacity>
          {renderDocStatus(identityDoc)}

          <TouchableOpacity style={styles.uploadBtn} onPress={() => pickDocument("business")}>
              <Ionicons name="stats-chart-outline" size={24} color="#2d936c" />
              <Text style={styles.uploadBtnText}>Business Plan (Optionnel)</Text>
          </TouchableOpacity>
          {renderDocStatus(businessPlanDoc)}

          <View style={styles.buttonGroup}>
            <Button
              title="Annuler"
              onPress={() => setCreating(false)}
              variant="tertiary"
              style={{flex: 1}}
            />
            <Button
              title="Créer"
              onPress={handleCreate}
              loading={loading}
              variant="primary"
              style={{flex: 1}}
            />
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: "#F9F9F9",
    paddingTop: 60,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
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
  selectionSection: {
    gap: 20,
  },
  sectionTitle: {
    fontSize: 20,
    color: "#1a1c1c",
    fontFamily: "GoogleSansText-Bold",
    marginBottom: 12,
  },
  coopItem: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e2e2e2",
  },
  coopInfo: {
    flex: 1,
    marginRight: 12,
  },
  coopName: {
    fontSize: 18,
    color: "#1a1c1c",
    fontFamily: "GoogleSansText-Bold",
  },
  coopDesc: {
    fontSize: 14,
    color: "#666",
    fontFamily: "GoogleSansText-Regular",
  },
  joinButton: {
    paddingHorizontal: 16,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },
  dividerText: {
    marginHorizontal: 12,
    color: "#3e4943",
    fontSize: 12,
    fontFamily: "GoogleSansText-Regular",
    textTransform: "uppercase",
  },
  creationSection: {
    gap: 16,
    paddingBottom: 40,
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
    fontFamily: "GoogleSansText-Regular",
    marginVertical: 20,
  },
  uploadBtn: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#fff",
      padding: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: "#2d936c",
      borderStyle: "dashed",
      gap: 12,
  },
  uploadBtnText: {
      fontSize: 14,
      color: "#2d936c",
      fontFamily: "GoogleSansText-Medium",
  },
  docStatus: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingLeft: 4,
      marginTop: -8,
      marginBottom: 8,
  },
  docText: {
      fontSize: 12,
      color: "#999",
      fontFamily: "GoogleSansText-Regular",
  },
  docTextActive: {
      color: "#2d936c",
  },
  docLabel: {
      fontSize: 16,
      color: "#1a1c1c",
      fontFamily: "GoogleSansText-Bold",
      marginTop: 12,
  }
});
