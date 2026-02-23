import { useState, useEffect, useCallback } from "react";
import { Alert, Linking } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { supabase } from "../lib/supabase";
import { contractorService, Contractor } from "../services/contractorService";
import { fileService } from "../services/fileService";

export const useContractorProfile = (user: any) => {
  const [profile, setProfile] = useState<Contractor | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const loadProfile = useCallback(async () => {
    if (!user?.id) return;
    try {
      const data = await contractorService.getProfile(user.id);
      setProfile(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const updateSpecialism = async (val: string) => {
    if (!user?.id) return;
    try {
      await contractorService.updateSpecialism(user.id, val);
      await loadProfile();
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  const uploadCompetence = async () => {
    if (!user?.id) return;
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/*"],
        copyToCacheDirectory: true,
      });

      if (res.canceled) return;

      setUploading(true);
      const file = res.assets[0];

      const result = await fileService.uploadCompetenceDocument(
        user.id,
        file.uri,
        file.name,
      );

      const finalPath = typeof result === "object" ? result.path : result;
      await contractorService.submitCompetence(user.id, finalPath);

      if (typeof result === "object" && result.offline) {
        Alert.alert("Offline", "Saved locally. Will sync when online.");
      } else {
        Alert.alert("Success", "Certification updated.");
      }

      await loadProfile();
    } catch (e: any) {
      Alert.alert("Upload Error", e.message);
    } finally {
      setUploading(false);
    }
  };

  const viewCertificate = () => {
    if (!profile?.competence_evidence_url) return;
    const path = profile.competence_evidence_url;

    if (path.startsWith("http")) {
      Linking.openURL(path);
    } else {
      const { data } = supabase.storage.from("evidence").getPublicUrl(path);
      if (data?.publicUrl) Linking.openURL(data.publicUrl);
    }
  };

  return {
    profile,
    loading,
    uploading,
    updateSpecialism,
    uploadCompetence,
    viewCertificate
  };
};