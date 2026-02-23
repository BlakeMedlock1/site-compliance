import { useState } from "react";
import { Alert } from "react-native";
import { accidentService } from "../services/accidentService";

export const useAccidentLogging = (userId: string | undefined, navigation: any) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    injured_person_name: "",
    location: "",
    injury_description: "",
    treatment_given: "",
    is_riddor_reportable: false,
    date_time: new Date(),
  });

  const updateField = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!form.injured_person_name || !form.injury_description || !form.location) {
      return Alert.alert(
        "Required Fields",
        "Please provide the name, location, and a description of the injury."
      );
    }

    if (!userId) {
      return Alert.alert("Error", "Authentication required. Please log in again.");
    }

    try {
      setLoading(true);

      const result = await accidentService.logAccident({
        user_id: userId,
        date_time: form.date_time.toISOString(),
        location: form.location,
        injured_person_name: form.injured_person_name,
        injury_description: form.injury_description,
        treatment_given: form.treatment_given,
        is_riddor_reportable: form.is_riddor_reportable,
        status: "Reported",
      });

      if (!result.success) {
        throw new Error(result.error || "Submission failed");
      }

      Alert.alert(
        "Entry Sealed",
        "Accident logged in the statutory book. Site management has been alerted.",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } catch (e: any) {
      Alert.alert(
        "Registry Error",
        e.message || "An unexpected error occurred during submission."
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    updateField,
    loading,
    handleSubmit,
  };
};