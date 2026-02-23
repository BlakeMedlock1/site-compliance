import { useState, useEffect, useMemo } from "react";
import { Alert } from "react-native";
import { contractorService, Contractor } from "../services/contractorService";

export const useContractorAssign = (incidentId: string, isAsset: boolean, navigation: any) => {
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchContractors = async () => {
    try {
      setLoading(true);
      const data = await contractorService.getApprovedContractors();
      setContractors(data);
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContractors();
  }, []);

  const filteredContractors = useMemo(() => {
    const q = search.toLowerCase();
    return contractors.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.specialism?.toLowerCase().includes(q)
    );
  }, [search, contractors]);

  const handleAssign = async (contractor: Contractor) => {
    try {
      setLoading(true);
      await contractorService.assignToJob(incidentId, contractor.id, isAsset);
      Alert.alert("Assigned", `Job dispatched to ${contractor.name}`);
      navigation.goBack();
    } catch (e: any) {
      Alert.alert("Assignment Error", e.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    contractors: filteredContractors,
    search,
    setSearch,
    loading,
    handleAssign,
  };
};