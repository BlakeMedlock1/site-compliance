import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Incident } from "../services/incidentService";

export const useDashboard = () => {
  const [feed, setFeed] = useState<Incident[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [feedRes, countRes] = await Promise.all([
        supabase
          .from("incidents")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(8),
        supabase
          .from("incidents")
          .select("*", { count: "exact", head: true })
          .eq("status", "Pending"),
      ]);
      setFeed(feedRes.data || []);
      setPendingCount(countRes.count || 0);
    } catch (error) {
      console.warn("Dashboard sync failed - showing cached data if available");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const channel = supabase
      .channel("realtime_incidents")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "incidents" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setFeed((prev) => [payload.new as Incident, ...prev].slice(0, 8));
            if (payload.new.status === "Pending") setPendingCount((c) => c + 1);
          } else if (payload.eventType === "UPDATE") {
            setFeed((prev) =>
              prev.map((item) =>
                item.id === payload.new.id ? (payload.new as Incident) : item
              )
            );
            fetchData();
          } else if (payload.eventType === "DELETE") {
            setFeed((prev) =>
              prev.filter((item) => item.id !== payload.old.id)
            );
            fetchData();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { feed, pendingCount, loading, refresh: fetchData };
};