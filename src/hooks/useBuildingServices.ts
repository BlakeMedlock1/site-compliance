import { useState, useEffect, useCallback } from "react";
import { Alert } from "react-native";
import { buildingService } from "../services/buildingService";
import { assetService } from "../services/assetService";

export const useBuildingServices = (navigation: any, user: any) => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBuildingData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await buildingService.getServiceReports();
      setServices(data);
    } catch (error: any) {
      Alert.alert("Sync Error", error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDuplicate = async (item: any) => {
    try {
      setLoading(true);
      await assetService.duplicateAsset(item);
      await loadBuildingData();
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadBuildingData);
    return unsubscribe;
  }, [navigation, loadBuildingData]);

  return {
    services,
    loading,
    handleDuplicate,
    loadBuildingData,
  };
};