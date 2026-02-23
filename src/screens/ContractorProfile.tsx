import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, SafeAreaView, ScrollView } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useContractorProfile } from "../hooks/useContractorProfile";
import { privacyService } from "../services/privacyService";
import { COLORS, SHADOWS, TYPOGRAPHY, SPACING, TOUCH_TARGETS } from "../theme";

const SPECIALISMS = ["Electrical", "Plumbing", "HVAC", "Fire Safety", "Gas", "General", "Caretaker"];

export const ContractorProfile = () => {
  const { user } = useAuth();
  const { profile, loading, uploading, updateSpecialism, uploadCompetence, viewCertificate } = useContractorProfile(user);

  if (loading) return (
    <View style={styles.centerLoader}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <Text style={styles.label} accessibilityRole="header">OPERATIVE NAME</Text>
          <Text style={styles.val}>{profile?.name}</Text>

          <Text style={styles.label}>MY SPECIALISM (TRADE)</Text>
          <View style={styles.chipRow} accessibilityRole="radiogroup">
            {SPECIALISMS.map((s) => (
              <TouchableOpacity
                key={s}
                style={[styles.chip, profile?.specialism === s && styles.chipActive]}
                onPress={() => updateSpecialism(s)}
                accessibilityRole="radio"
                accessibilityState={{ checked: profile?.specialism === s }}
                accessibilityLabel={`${s} specialism`}
              >
                <Text style={[styles.chipText, profile?.specialism === s && styles.chipTextActive]}>
                  {s.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>VERIFICATION STATUS</Text>
          <View style={[styles.statusBadge, {
            backgroundColor: profile?.competence_status === "Approved" ? COLORS.success 
            : profile?.competence_status === "Rejected" ? COLORS.secondary : COLORS.warning,
          }]} accessibilityLabel={`Verification status: ${profile?.competence_status || "Unverified"}`}>
            <Text style={styles.statusText}>{profile?.competence_status?.toUpperCase() || "UNVERIFIED"}</Text>
          </View>

          {profile?.rejection_reason && (
            <View style={styles.rejectBox} accessibilityRole="alert">
              <Text style={styles.rejectTitle}>FEEDBACK</Text>
              <Text style={styles.rejectText}>{profile.rejection_reason}</Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.uploadBtn}
            onPress={uploadCompetence}
            disabled={uploading}
            accessibilityRole="button"
            accessibilityLabel="Replace competence proof"
          >
            <Text style={styles.uploadBtnText}>
              {uploading ? "UPLOADING..." : "REPLACE COMPETENCY PROOF"}
            </Text>
          </TouchableOpacity>

          {profile?.competence_evidence_url && (
            <TouchableOpacity onPress={viewCertificate} style={styles.viewBtn} accessibilityRole="link">
              <Text style={styles.viewBtnText}>View Current Certificate →</Text>
            </TouchableOpacity>
          )}

          <View style={styles.governanceBox}>
            <Text style={styles.label} accessibilityRole="header">PRIVACY & DATA RIGHTS</Text>
            <Text style={styles.infoText}>Stored securely in an encrypted vault. You may export your record.</Text>
            <TouchableOpacity
              style={styles.exportBtn}
              onPress={() => user?.id && privacyService.downloadMyData(user.id)}
              accessibilityRole="button"
            >
              <Text style={styles.exportBtnText}>EXPORT MY DATA (JSON)</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  centerLoader: { flex: 1, justifyContent: "center", alignItems: "center" },
  scroll: { padding: SPACING.m },
  card: { backgroundColor: COLORS.white, padding: SPACING.l, borderRadius: 15, ...SHADOWS.light, borderWidth: 1, borderColor: COLORS.lightGray },
  label: { ...TYPOGRAPHY.caption, fontWeight: "800", color: COLORS.text, marginBottom: SPACING.s, letterSpacing: 1.2 },
  val: { ...TYPOGRAPHY.header, color: COLORS.primary, marginBottom: SPACING.l },
  chipRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: SPACING.l, gap: 8 },
  chip: { paddingHorizontal: 16, minHeight: 44, justifyContent: "center", borderRadius: 22, borderWidth: 2, borderColor: COLORS.lightGray },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { ...TYPOGRAPHY.body, fontSize: 14, fontWeight: "700", color: COLORS.textLight },
  chipTextActive: { color: COLORS.white, fontWeight: "800" },
  statusBadge: { alignSelf: "flex-start", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, marginBottom: SPACING.l },
  statusText: { color: COLORS.white, fontWeight: "900", fontSize: 12, letterSpacing: 1 },
  rejectBox: { backgroundColor: "#FFF5F5", padding: SPACING.m, borderRadius: 8, marginBottom: SPACING.l, borderLeftWidth: 6, borderLeftColor: COLORS.secondary },
  rejectTitle: { ...TYPOGRAPHY.caption, fontWeight: "900", color: COLORS.secondary, marginBottom: 4 },
  rejectText: { ...TYPOGRAPHY.body, color: COLORS.text, lineHeight: 22 },
  uploadBtn: { backgroundColor: COLORS.primary, minHeight: TOUCH_TARGETS.min, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  uploadBtnText: { color: COLORS.white, fontWeight: "800", fontSize: 16, letterSpacing: 1 },
  viewBtn: { marginTop: SPACING.l, minHeight: TOUCH_TARGETS.min, alignItems: "center", justifyContent: "center" },
  viewBtnText: { ...TYPOGRAPHY.body, color: COLORS.primary, fontWeight: "800", textDecorationLine: "underline" },
  governanceBox: { marginTop: SPACING.xl, padding: SPACING.m, backgroundColor: COLORS.background, borderRadius: 12, borderStyle: "dashed", borderWidth: 2, borderColor: COLORS.gray },
  infoText: { ...TYPOGRAPHY.body, fontSize: 14, color: COLORS.textLight, marginBottom: SPACING.m, lineHeight: 22 },
  exportBtn: { backgroundColor: COLORS.white, minHeight: TOUCH_TARGETS.min, borderRadius: 10, borderWidth: 2, borderColor: COLORS.primary, alignItems: "center", justifyContent: "center" },
  exportBtnText: { color: COLORS.primary, fontWeight: "800", fontSize: 14 },
});
