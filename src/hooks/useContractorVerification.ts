import { useState, useEffect, useCallback, useMemo } from "react";
import { Alert } from "react-native";
import { contractorService, Contractor } from "../services/contractorService";

export const useContractorVerification = (navigation: any) => {
  const [allContractors, setAllContractors] = useState<Contractor[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const loadContractors = useCallback(async () => {
    try {
      setLoading(true);
      const data = await contractorService.getAllContractors();
      setAllContractors(data);
    } catch (e: any) {
      Alert.alert("Sync Error", "Failed to load workforce data: " + e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadContractors);
    return unsubscribe;
  }, [navigation, loadContractors]);

  const filteredSections = useMemo(() => {
    const q = searchQuery.toLowerCase();
    
    const filtered = allContractors.filter(
      (c) =>
        c.name?.toLowerCase().includes(q) ||
        c.specialism?.toLowerCase().includes(q) ||
        c.company?.toLowerCase().includes(q)
    );

    const sections = [
      {
        title: "Awaiting Verification",
        data: filtered.filter(
          (c) => c.competence_status === "Pending" && c.competence_evidence_url
        ),
      },
      {
        title: "Approved Specialists",
        data: filtered.filter((c) => c.competence_status === "Approved"),
      },
      {
        title: "Suspended / Others",
        data: filtered.filter(
          (c) =>
            c.competence_status !== "Approved" &&
            c.competence_status !== "Pending"
        ),
      },
    ];

    return sections.filter((s) => s.data.length > 0);
  }, [allContractors, searchQuery]);

  return {
    filteredSections,
    searchQuery,
    setSearchQuery,
    loading,
    refresh: loadContractors,
  };
};