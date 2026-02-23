import { useState, useEffect, useCallback } from "react";
import { Alert, Linking } from "react-native";
import { supabase } from "../lib/supabase";

export const useIncidentDetail = (incident: any, user: any, navigation: any) => {
  const [contractor, setContractor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [evidenceUri, setEvidenceUri] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);

  const fetchDetails = useCallback(async () => {
    try {
      if (user?.role !== "Manager") {
        Alert.alert("Security Block", "Only Site Managers may access statutory evidence.");
        navigation.goBack();
        return;
      }

      if (incident.assigned_contractor_id) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", incident.assigned_contractor_id)
          .single();
        setContractor(data);
      }

      const rawPath = incident.image_url || incident.evidence_url;
      if (rawPath && !rawPath.startsWith("file://")) {
        if (rawPath.startsWith("http")) {
          setEvidenceUri(rawPath);
        } else {
          const { data } = supabase.storage
            .from("incident-evidence")
            .getPublicUrl(rawPath);

          if (data?.publicUrl) {
            setEvidenceUri(`${data.publicUrl}?t=${new Date().getTime()}`);
          }
        }
      } else {
        setImgError(true);
      }
    } catch (e) {
      setImgError(true);
    } finally {
      setLoading(false);
    }
  }, [incident, user, navigation]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const openEvidence = () => {
    if (evidenceUri) {
      Linking.openURL(evidenceUri).catch(() => {
        Alert.alert("Error", "Unable to open evidence file.");
      });
    }
  };

  return { contractor, loading, evidenceUri, imgError, openEvidence };
};