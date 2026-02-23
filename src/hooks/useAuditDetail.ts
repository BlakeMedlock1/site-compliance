import { useState, useEffect, useCallback } from "react";
import { Linking } from "react-native";
import { supabase } from "../lib/supabase";

export const useAuditDetail = (item: any, viewMode: string) => {
  const [evidenceUri, setEvidenceUri] = useState<string | null>(null);
  const [loadingImg, setLoadingImg] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const fetchAssetHistory = useCallback(async (assetId: string) => {
    try {
      setLoadingHistory(true);
      const { data } = await supabase
        .from("maintenance_logs")
        .select("*")
        .eq("asset_id", assetId)
        .order("service_date", { ascending: false });
      setHistory(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  const resolveEvidence = useCallback((itemData: any) => {
    setLoadingImg(true);
    const rawPath =
      itemData.image_url ||
      itemData.evidence_url ||
      itemData.resolved_image_url ||
      itemData.certificate_url;

    if (rawPath && !rawPath.startsWith("file://")) {
      if (rawPath.startsWith("http")) {
        setEvidenceUri(rawPath);
        setLoadingImg(false);
      } else {
        const { data } = supabase.storage
          .from("incident-evidence")
          .getPublicUrl(rawPath);
        if (data?.publicUrl)
          setEvidenceUri(`${data.publicUrl}?t=${new Date().getTime()}`);
        setLoadingImg(false);
      }
    } else {
      setEvidenceUri(null);
      setLoadingImg(false);
    }
  }, []);

  useEffect(() => {
    if (item) {
      resolveEvidence(item);
      if (viewMode === "Assets") fetchAssetHistory(item.id);
    } else {
      setEvidenceUri(null);
      setHistory([]);
    }
  }, [item, viewMode, resolveEvidence, fetchAssetHistory]);

  const openEvidence = (url?: string) => {
    const targetUrl = url || evidenceUri;
    if (targetUrl) Linking.openURL(targetUrl).catch(() => {});
  };

  return {
    evidenceUri,
    loadingImg,
    history,
    loadingHistory,
    openEvidence,
  };
};