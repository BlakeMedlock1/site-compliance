import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { useFaultReporting } from "../hooks/useFaultReporting";
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS, TOUCH_TARGETS } from "../theme";

export const FaultReporting = ({ navigation }: any) => {
  const { user } = useAuth();
  
  const { 
    form, 
    setters, 
    loading, 
    takePhoto, 
    submitFault 
  } = useFaultReporting(user, navigation);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} accessibilityRole="header">
            Report a Fault or Hazard
          </Text>
          <Text style={styles.subtitle}>Statutory Evidence Capture</Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.label}>Where is the issue?</Text>
          <TextInput
            testID="input-fault-location"
            style={styles.input}
            placeholder="e.g. Mens Toilets, 2nd Floor"
            value={form.location}
            onChangeText={setters.setLocation}
            placeholderTextColor={COLORS.textLight}
            accessibilityLabel="Location of the issue"
            accessibilityHint="Minimum 3 characters required"
          />

          <Text style={styles.label}>Describe the fault</Text>
          <TextInput
            testID="input-fault-description"
            style={[styles.input, styles.textArea]}
            placeholder="e.g. Lights not working (Min 10 characters)..."
            multiline
            value={form.fault}
            onChangeText={setters.setFault}
            textAlignVertical="top"
            placeholderTextColor={COLORS.textLight}
            accessibilityLabel="Fault description"
            accessibilityHint="Describe the issue in at least 10 characters"
          />

          <TouchableOpacity
            testID="btn-fault-camera"
            style={styles.photoBtn}
            onPress={takePhoto}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel={form.image ? "Photo evidence attached. Tap to retake." : "Attach photo evidence"}
          >
            <Ionicons name="camera" size={32} color={COLORS.primary} style={{ marginBottom: 8 }} />
            <Text style={styles.photoBtnText}>
              {form.image ? "PHOTO EVIDENCE ATTACHED" : "ATTACH PHOTO EVIDENCE"}
            </Text>
          </TouchableOpacity>

          {form.image && (
            <View style={styles.previewContainer} testID="photo-preview-box">
              <Image source={{ uri: form.image }} style={styles.preview} accessibilityRole="image" />
              <TouchableOpacity
                testID="btn-remove-photo"
                onPress={() => setters.setImage(null)}
                disabled={loading}
                style={styles.removeBtn}
                accessibilityRole="button"
              >
                <Ionicons name="trash-outline" size={20} color={COLORS.secondary} />
                <Text style={styles.removePhoto}>Remove Photo</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            testID="btn-submit-fault"
            style={[styles.submitBtn, loading && styles.disabledBtn]}
            onPress={submitFault}
            disabled={loading}
            accessibilityRole="button"
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} size="large" />
            ) : (
              <Text style={styles.btnText}>Submit Report to Live Vault</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.m },
  header: { marginBottom: SPACING.l },
  title: { ...TYPOGRAPHY.header, color: COLORS.primary, fontSize: 24 },
  subtitle: { ...TYPOGRAPHY.caption, color: COLORS.textLight, fontWeight: "800", marginTop: 4, letterSpacing: 1 },
  formCard: { backgroundColor: COLORS.white, padding: SPACING.m, borderRadius: 16, ...SHADOWS.light, borderWidth: 2, borderColor: COLORS.lightGray },
  label: { ...TYPOGRAPHY.body, fontWeight: "800", marginBottom: SPACING.s, color: COLORS.primary, letterSpacing: 0.5 },
  input: { backgroundColor: COLORS.background, borderWidth: 2, borderColor: COLORS.lightGray, borderRadius: 12, padding: SPACING.m, marginBottom: SPACING.m, color: COLORS.text, ...TYPOGRAPHY.body, minHeight: TOUCH_TARGETS.min },
  textArea: { height: 120 },
  photoBtn: { backgroundColor: COLORS.background, minHeight: 120, borderRadius: 12, borderStyle: "dashed", borderWidth: 2, borderColor: COLORS.primary, alignItems: "center", justifyContent: "center", marginBottom: SPACING.m },
  photoBtnText: { color: COLORS.primary, fontWeight: "900", fontSize: 14, letterSpacing: 0.5 },
  previewContainer: { alignItems: "center", marginBottom: SPACING.m },
  preview: { width: "100%", height: 250, borderRadius: 12, backgroundColor: COLORS.lightGray },
  removeBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: SPACING.s, minHeight: TOUCH_TARGETS.min, gap: 8 },
  removePhoto: { color: COLORS.secondary, fontWeight: "800", fontSize: 16, textDecorationLine: "underline" },
  submitBtn: { backgroundColor: COLORS.primary, minHeight: 65, borderRadius: 12, alignItems: "center", justifyContent: "center", marginTop: SPACING.s },
  disabledBtn: { backgroundColor: COLORS.gray },
  btnText: { color: COLORS.white, fontWeight: "900", fontSize: 18, letterSpacing: 1 },
});