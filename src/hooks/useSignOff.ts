import { useState } from "react";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { workOrderService } from "../services/workOrderService";
import { notificationService } from "../services/notificationService";

export const useSignOff = (user: any, task: any, onSuccess: () => void) => {
  const [isUploading, setIsUploading] = useState(false);
  const [evidence, setEvidence] = useState<any | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [form, setForm] = useState({
    notes: "",
    remedial: "",
    signature: "",
    nextService: false,
    date: new Date(),
  });

  const updateField = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.4,
    });
    if (!result.canceled) {
      setEvidence({
        uri: result.assets[0].uri,
        name: "capture.jpg",
        isImage: true,
      });
    }
  };

  const pickFile = async () => {
    const res = await DocumentPicker.getDocumentAsync({
      type: ["image/*", "application/pdf"],
    });
    if (!res.canceled) {
      setEvidence({
        uri: res.assets[0].uri,
        name: res.assets[0].name,
        isImage: res.assets[0].mimeType?.includes("image"),
      });
    }
  };

  const handleResolution = async () => {
    if (!form.notes || !form.signature) {
      Alert.alert("Compliance Block", "Missing required notes or signature.");
      return;
    }
    try {
      setIsUploading(true);
      let finalIsoDate = null;
      if (form.nextService) {
        const dateObj = form.date instanceof Date ? form.date : new Date(form.date);
        finalIsoDate = !isNaN(dateObj.getTime()) ? dateObj.toISOString() : new Date().toISOString();
      }

      await workOrderService.resolveTask(user!.id, task, {
        evidenceFile: evidence,
        resolutionNotes: form.notes,
        remedialActions: form.remedial,
        signedByName: form.signature,
        requiresNextService: form.nextService,
        nextDueDate: finalIsoDate,
      });

      await notificationService.notifyManagers(
        "WORK ORDER COMPLETED",
        `Contractor ${user?.name} has submitted sign-off for: ${task.description}`,
        "WORK_ORDER"
      );

      Alert.alert("Success", "Regulatory record sealed.");
      onSuccess();
    } catch (e: any) {
      Alert.alert("Sync Error", e.message);
    } finally {
      setIsUploading(false);
    }
  };

  return {
    form,
    updateField,
    evidence,
    isUploading,
    showDatePicker,
    setShowDatePicker,
    takePhoto,
    pickFile,
    handleResolution,
  };
};