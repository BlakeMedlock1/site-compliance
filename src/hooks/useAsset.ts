import { useState } from "react";
import { Alert } from "react-native";
import { assetService, Asset } from "../services/assetService";

export const useAsset = (editingAsset: any, navigation: any) => {
  const isEditing = !!editingAsset;

  const [name, setName] = useState(editingAsset?.asset_name || "");
  const [type, setType] = useState(editingAsset?.type || "");
  const [regulation, setRegulation] = useState(editingAsset?.regulation || "");
  const [location, setLocation] = useState(editingAsset?.location || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name || !type || !regulation) {
      Alert.alert("Error", "Required fields missing.");
      return;
    }

    try {
      setLoading(true);
      const assetData: Asset = {
        asset_name: name,
        type: type.toUpperCase(),
        regulation: regulation,
        location: location,
      };

      if (isEditing) {
        await assetService.updateAsset(editingAsset.id, assetData);
      } else {
        await assetService.createAsset(assetData);
      }

      navigation.goBack();
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert("Confirm Delete", "Remove this asset permanently?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            setLoading(true);
            await assetService.deleteAsset(editingAsset.id);
            navigation.goBack();
          } catch (e: any) {
            Alert.alert("Error", e.message);
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  return {
    form: { name, type, regulation, location },
    setters: { setName, setType, setRegulation, setLocation },
    loading,
    isEditing,
    handleSave,
    handleDelete,
  };
};