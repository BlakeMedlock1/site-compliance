import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { useIncidentDetail } from "../hooks/useIncidentDetail";
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS, TOUCH_TARGETS } from "../theme";

export const IncidentDetail = ({ route, navigation }: any) => {
  const { user } = useAuth();
  const { incident } = route.params;

  const { 
    contractor, 
    loading, 
    evidenceUri, 
    imgError, 
    openEvidence 
  } = useIncidentDetail(incident, user, navigation);

  const isResolved = incident.status === "Resolved";
  const isPdf = evidenceUri?.toLowerCase().includes(".pdf");

  const formatDate = (dateString: string) => {
    if (!dateString) return "PENDING";
    return new Date(dateString).toLocaleString("en-GB", {
      day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
    });
  };

  if (user?.role !== "Manager") return null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.statusHeader}>
          <View style={[styles.badge, { backgroundColor: isResolved ? COLORS.success : COLORS.warning }]}>
            <Text style={styles.badgeText}>{incident.status.toUpperCase()}</Text>
          </View>
          <Text style={styles.timestamp}>REF: {incident.id.slice(0, 8)}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label} accessibilityRole="header">STATUTORY AUDIT TIMELINE</Text>
          <View style={styles.timelineItem}>
            <Ionicons name="radio-button-on" size={18} color={COLORS.secondary} />
            <View style={styles.timeInfo}>
              <Text style={styles.timeLabel}>LOGGED BY STAFF</Text>
              <Text style={styles.timeValue}>{formatDate(incident.created_at)}</Text>
            </View>
          </View>
          {isResolved && (
            <View style={[styles.timelineItem, { marginTop: SPACING.m }]}>
              <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
              <View style={styles.timeInfo}>
                <Text style={styles.timeLabel}>RESOLVED & SIGNED OFF</Text>
                <Text style={styles.timeValue}>{formatDate(incident.resolved_at)}</Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.label} accessibilityRole="header">HAZARD DESCRIPTION</Text>
          <Text style={styles.value}>{incident.description}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location" size={18} color={COLORS.textLight} />
            <Text style={styles.locationText}>{incident.location}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label} accessibilityRole="header">DIGITAL EVIDENCE</Text>
          {loading ? (
            <ActivityIndicator color={COLORS.primary} size="large" />
          ) : evidenceUri && !imgError ? (
            isPdf ? (
              <TouchableOpacity style={styles.pdfCard} onPress={openEvidence} accessibilityRole="link">
                <Ionicons name="document-text" size={40} color={COLORS.secondary} />
                <View style={styles.pdfContent}>
                  <Text style={styles.pdfText}>View Statutory PDF</Text>
                  <Text style={styles.pdfSub}>Touch to Open Document</Text>
                </View>
                <Ionicons name="open-outline" size={24} color={COLORS.textLight} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={openEvidence} style={styles.imageContainer} accessibilityRole="imagebutton">
                <Image source={{ uri: evidenceUri }} style={styles.evidenceImage} resizeMode="cover" />
                <View style={styles.expandOverlay}>
                  <Ionicons name="expand" size={18} color={COLORS.white} />
                  <Text style={styles.expandText}>Tap to Verify</Text>
                </View>
              </TouchableOpacity>
            )
          ) : (
            <View style={styles.noEvidence}><Text>No valid evidence found.</Text></View>
          )}
        </View>

        {!isResolved && (
          <View style={styles.section}>
            <Text style={styles.label} accessibilityRole="header">MANAGEMENT CONTROLS</Text>
            <TouchableOpacity 
              style={styles.assignBtn} 
              onPress={() => navigation.navigate("ContractorAssignment", { incidentId: incident.id })}
            >
              <Text style={styles.assignBtnText}>
                {contractor ? `REASSIGN (${contractor.name})` : "ASSIGN SPECIALIST"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.m },
  statusHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.m,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    minHeight: 32,
    justifyContent: "center",
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  timestamp: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textLight,
    fontWeight: "800",
  },
  section: {
    backgroundColor: COLORS.white,
    padding: SPACING.m,
    borderRadius: 16,
    marginBottom: SPACING.m,
    ...SHADOWS.light,
    borderWidth: 1.5,
    borderColor: COLORS.lightGray,
  },
  label: {
    ...TYPOGRAPHY.caption,
    fontWeight: "900",
    color: COLORS.secondary,
    marginBottom: SPACING.s,
    letterSpacing: 1.2,
  },
  subLabel: {
    ...TYPOGRAPHY.caption,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 6,
    textTransform: "uppercase",
  },
  timelineItem: { flexDirection: "row", alignItems: "center" },
  timeInfo: { marginLeft: SPACING.s },
  timeLabel: {
    ...TYPOGRAPHY.caption,
    fontWeight: "800",
    color: COLORS.textLight,
  },
  timeValue: { ...TYPOGRAPHY.body, color: COLORS.primary, fontWeight: "800" },
  value: {
    ...TYPOGRAPHY.body,
    fontSize: 17,
    color: COLORS.primary,
    fontWeight: "700",
    lineHeight: 26,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: SPACING.s,
  },
  locationText: { ...TYPOGRAPHY.body, color: COLORS.textLight, marginLeft: 6 },
  imageContainer: {
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
    marginTop: 8,
    backgroundColor: COLORS.lightGray,
    minHeight: 220,
  },
  evidenceImage: { width: "100%", height: 250 },
  expandOverlay: {
    position: "absolute",
    bottom: 12,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  expandText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "900",
    marginLeft: 6,
  },
  pdfCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.m,
    backgroundColor: "#FFF1F0",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.secondary,
    minHeight: TOUCH_TARGETS.min * 1.5,
  },
  pdfContent: { flex: 1, marginLeft: SPACING.m },
  pdfText: { ...TYPOGRAPHY.body, fontWeight: "800", color: COLORS.secondary },
  pdfSub: { ...TYPOGRAPHY.caption, color: COLORS.secondary, opacity: 0.8 },
  noEvidence: {
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderRadius: 12,
    borderStyle: "dashed",
    borderWidth: 2,
    borderColor: COLORS.gray,
  },
  noEvidenceText: { ...TYPOGRAPHY.body, color: COLORS.gray, marginTop: 8 },
  loaderBox: { height: 120, justifyContent: "center", alignItems: "center" },
  assignBtn: {
    backgroundColor: COLORS.primary,
    minHeight: TOUCH_TARGETS.min,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOWS.light,
  },
  assignBtnText: {
    color: COLORS.white,
    fontWeight: "900",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  notesText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    lineHeight: 24,
    backgroundColor: COLORS.background,
    padding: SPACING.m,
    borderRadius: 10,
    marginBottom: SPACING.s,
  },
  divider: {
    height: 2,
    backgroundColor: COLORS.lightGray,
    marginVertical: SPACING.m,
  },
  auditMeta: {
    ...TYPOGRAPHY.body,
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.secondary,
  },
});
