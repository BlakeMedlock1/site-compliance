import { useState, useEffect, useMemo } from "react";
import { Alert } from "react-native";
import { auditService } from "../services/auditService";

export const useAudit = () => {
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"Analytics" | "Incidents" | "Assets" | "Accidents">("Analytics");
  const [data, setData] = useState<{ incidents: any[]; assets: any[]; accidents: any[] }>({
    incidents: [],
    assets: [],
    accidents: [],
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [fromDate, setFromDate] = useState(new Date(new Date().setMonth(new Date().getMonth() - 1)));
  const [toDate, setToDate] = useState(new Date());

  const fetchAll = async () => {
    try {
      setLoading(true);
      const res = await auditService.getAuditData();
      setData(res);
    } catch (e: any) {
      Alert.alert("Sync Error", e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const filtered = useMemo(() => {
    const query = searchQuery.toLowerCase();
    
    return {
      incidents: data.incidents.filter(i => {
        const d = new Date(i.created_at);
        return d >= fromDate && d <= toDate && (i.description || "").toLowerCase().includes(query);
      }),
      accidents: data.accidents.filter(a => {
        const d = new Date(a.date_time);
        return d >= fromDate && d <= toDate && (a.injured_person_name || "").toLowerCase().includes(query);
      }),
      assets: data.assets.filter(as => 
        (as.asset_name || "").toLowerCase().includes(query) || (as.location || "").toLowerCase().includes(query)
      ),
    };
  }, [data, searchQuery, fromDate, toDate]);

  const charts = useMemo(() => ({
    incidents: auditService.getMonthlyTrend(filtered.incidents),
    accidents: auditService.getMonthlyTrend(filtered.accidents.map(a => ({ ...a, created_at: a.date_time })))
  }), [filtered]);

  const handleExport = () => {
    const exportData = viewMode === "Assets" ? filtered.assets : viewMode === "Accidents" ? filtered.accidents : filtered.incidents;
    auditService.generateAuditPDF(`${viewMode} Report`, exportData, viewMode === "Assets");
  };

  return {
    loading,
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    fromDate,
    toDate,
    setFromDate,
    setToDate,
    filtered,
    charts,
    handleExport
  };
};