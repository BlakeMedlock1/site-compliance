import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { notificationService } from "../services/notificationService";

export const useNotifications = (user: any) => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const data = await notificationService.getNotificationLog(user.id);
      setNotifications(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const channel = supabase
      .channel("notif_screen_sync")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "site_notifications" },
        () => fetchNotifications()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const handlePress = async (item: any) => {
    if (!item.is_read) {
      try {
        setNotifications((prev) =>
          prev.map((n) => (n.id === item.id ? { ...n, is_read: true } : n))
        );
        await notificationService.markAsRead(item.id);
      } catch (e) {
        fetchNotifications();
      }
    }
  };

  return { notifications, loading, handlePress, refresh: fetchNotifications };
};