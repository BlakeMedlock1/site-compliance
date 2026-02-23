import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { useContractorTasks } from "../hooks/useContractorTasks";
import { COLORS } from "../theme";

import { QuickActions } from "../components/contractor/QuickActions";
import { WorkOrderList } from "../components/contractor/WorkOrderList";
import { SignOffModal } from "../components/contractor/SignOffModal";

export const ContractorWorkOrders = ({ navigation }: any) => {
  const { user } = useAuth();
  
  const {
    assignedTasks,
    selectedTask,
    modalVisible,
    loading,
    handleSignOffPress,
    handleModalClose,
    handleModalSuccess,
  } = useContractorTasks(user?.id, navigation);

  return (
    <SafeAreaView style={styles.container} testID="contractor-portal-view">
      <QuickActions navigation={navigation} />

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
            accessibilityLabel="Loading work orders"
          />
        </View>
      ) : (
        <WorkOrderList 
          tasks={assignedTasks} 
          onSignOff={handleSignOffPress} 
        />
      )}

      <SignOffModal
        visible={modalVisible}
        task={selectedTask}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});