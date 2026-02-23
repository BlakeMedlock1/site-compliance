import { useState } from "react";
import { Alert } from "react-native";
import { contractorService } from "../services/contractorService";

export const useContractorVerify = (initialContractor: any) => {
  const [status, setStatus] = useState(initialContractor.competence_status);
  const [loading, setLoading] = useState(false);

  const handleUpdateStatus = async (newStatus: string) => {
    try {
      setLoading(true);
      await contractorService.updateContractorStatus(initialContractor.id, newStatus);
      setStatus(newStatus);
      Alert.alert("Success", `Status changed to ${newStatus}`);
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    status,
    loading,
    handleUpdateStatus,
  };
};