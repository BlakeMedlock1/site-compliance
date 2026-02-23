import { useState } from "react";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { incidentService } from "../services/incidentService";
import { notificationService } from "../services/notificationService";
import { InputValidator } from "../utils/InputValidator";

export const useFaultReporting = (user: any, navigation: any) => {
  const [fault, setFault] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Camera access is required for digital evidence.");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const submitFault = async () => {
    const cleanFault = InputValidator.sanitize(fault);
    const cleanLocation = InputValidator.sanitize(location);

    const validation = InputValidator.validateIncident(cleanFault, cleanLocation);

    if (!validation.isValid) {
      Alert.alert(
        "Validation Failed",
        validation.errors.join("\n"),
        [{ text: "Fix Errors" }]
      );
      return;
    }

    try {
      setLoading(true);
      
      await incidentService.createIncident(
        `FAULT REPORT: ${cleanFault}`,
        cleanLocation,
        image || undefined,
        user?.id,
      );

      await notificationService.notifyManagers(
        "NEW HAZARD REPORTED",
        `A new hazard was logged at ${cleanLocation} by ${user?.name}`,
        "HAZARD",
      );

      Alert.alert(
        "Compliance Logged",
        "The report is now live in the central audit vault.",
        [{ text: "OK", onPress: () => navigation.goBack() }],
      );
    } catch (error: any) {
      Alert.alert("Submission Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    form: { fault, location, image },
    setters: { setFault, setLocation, setImage },
    loading,
    takePhoto,
    submitFault,
  };
};