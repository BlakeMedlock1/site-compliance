import { useState, useEffect, useCallback } from "react";
import { Alert } from "react-native";
import { workOrderService } from "../services/workOrderService";

export const useContractorTasks = (userId: string | undefined, navigation: any) => {
  const [assignedTasks, setAssignedTasks] = useState<any[]>([]);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadTasks = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const tasks = await workOrderService.getAssignedTasks(userId);
      setAssignedTasks(tasks);
    } catch (e: any) {
      Alert.alert("System Error", e.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadTasks);
    return unsubscribe;
  }, [navigation, loadTasks]);

  const handleSignOffPress = (task: any) => {
    setSelectedTask(task);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedTask(null);
  };

  const handleModalSuccess = () => {
    setModalVisible(false);
    setSelectedTask(null);
    loadTasks();
  };

  return {
    assignedTasks,
    selectedTask,
    modalVisible,
    loading,
    handleSignOffPress,
    handleModalClose,
    handleModalSuccess,
  };
};