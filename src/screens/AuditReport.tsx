import React, { useState } from "react";
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { useAudit } from "../hooks/useAudit";
import { COLORS, SHADOWS, SPACING, TOUCH_TARGETS } from "../theme";
import { AuditFilters } from "../components/audit/AuditFilters";
import { AuditCharts } from "../components/audit/AuditCharts";
import { AuditList } from "../components/audit/AuditList";
import { AuditDetailModal } from "../components/audit/AuditDetailModal";

export const AuditReport = ({ navigation }: any) => {
  const {
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
  } = useAudit();

  const [selectedItem, setSelectedItem] = useState<any>(null);

  return (
    <SafeAreaView style={styles.container}>
      <AuditFilters
        viewMode={viewMode}
        setViewMode={setViewMode}
        fromDate={fromDate}
        toDate={toDate}
        onDateChange={(type, date) =>
          type === "from" ? setFromDate(date) : setToDate(date)
        }
      />

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator 
            size="large" 
            color={COLORS.primary} 
            accessibilityLabel="Loading audit data"
          />
        </View>
      ) : (
        <View style={styles.content}>
          {viewMode === "Analytics" ? (
            <AuditCharts
              incidentData={charts.incidents}
              accidentData={charts.accidents}
            />
          ) : (
            <AuditList
              viewMode={viewMode}
              data={
                viewMode === "Assets"
                  ? filtered.assets
                  : viewMode === "Accidents"
                    ? filtered.accidents
                    : filtered.incidents
              }
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSelectItem={setSelectedItem}
            />
          )}
        </View>
      )}

      {viewMode !== "Analytics" && (
        <TouchableOpacity
          testID="btn-export-audit-pdf"
          style={styles.exportBtn}
          onPress={handleExport}
          accessibilityRole="button"
          accessibilityLabel={`Generate ${viewMode} PDF report`}
          accessibilityHint={`Creates a shareable PDF document of the current ${viewMode} list`}
        >
          <Text style={styles.exportTxt}>
            GENERATE {viewMode.toUpperCase()} PDF
          </Text>
        </TouchableOpacity>
      )}

      <AuditDetailModal
        visible={!!selectedItem}
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        viewMode={viewMode}
        navigation={navigation}
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
  content: {
    flex: 1,
  },
  exportBtn: {
    margin: SPACING.l,
    backgroundColor: COLORS.success,
    minHeight: TOUCH_TARGETS.min,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOWS.light,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  exportTxt: {
    color: COLORS.white,
    fontWeight: "800",
    fontSize: 16,
    letterSpacing: 1.2,
  },
});