import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Switch,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { useAccidentLogging } from "../hooks/useAccidentLogging";
import { COLORS, TYPOGRAPHY, SHADOWS, SPACING, TOUCH_TARGETS } from "../theme";

export const LogAccident = ({ navigation }: any) => {
  const { user } = useAuth();
  const { form, updateField, loading, handleSubmit } = useAccidentLogging(user?.id, navigation);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title} accessibilityRole="header">
            Statutory Accident Book
          </Text>
          <Text style={styles.subtitle}>Official RIDDOR-Compliant Registry</Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.label}>NAME OF INJURED PERSON</Text>
          <TextInput
            testID="input-injured-name"
            style={styles.input}
            value={form.injured_person_name}
            onChangeText={(v) => updateField("injured_person_name", v)}
            placeholder="Full Name"
            placeholderTextColor={COLORS.textLight}
            accessibilityLabel="Injured person's full name"
          />

          <Text style={styles.label}>LOCATION OF ACCIDENT</Text>
          <TextInput
            testID="input-accident-location"
            style={styles.input}
            value={form.location}
            onChangeText={(v) => updateField("location", v)}
            placeholder="e.g. Workshop B"
            placeholderTextColor={COLORS.textLight}
            accessibilityLabel="Location of accident"
          />

          <Text style={styles.label}>DESCRIPTION OF INJURY & EVENT</Text>
          <TextInput
            testID="input-injury-description"
            style={[styles.input, styles.textArea]}
            multiline
            value={form.injury_description}
            onChangeText={(v) => updateField("injury_description", v)}
            textAlignVertical="top"
            placeholder="Detailed account of incident..."
            placeholderTextColor={COLORS.textLight}
            accessibilityLabel="Injury and event description"
          />

          <Text style={styles.label}>TREATMENT GIVEN (OPTIONAL)</Text>
          <TextInput
            testID="input-treatment-given"
            style={styles.input}
            value={form.treatment_given}
            onChangeText={(v) => updateField("treatment_given", v)}
            placeholder="e.g. First aid applied on site"
            placeholderTextColor={COLORS.textLight}
            accessibilityLabel="Treatment given"
          />

          <View style={styles.switchRow}>
            <View style={styles.switchTextContainer}>
              <Text style={styles.label}>RIDDOR REPORTABLE?</Text>
              <Text style={styles.hint}>Does this require HSE notification?</Text>
            </View>
            <Switch
              testID="switch-riddor"
              value={form.is_riddor_reportable}
              onValueChange={(v) => updateField("is_riddor_reportable", v)}
              trackColor={{ false: COLORS.lightGray, true: COLORS.secondary }}
              thumbColor={COLORS.white}
              accessibilityLabel="Is this RIDDOR reportable?"
            />
          </View>

          <TouchableOpacity
            testID="btn-submit-accident"
            style={[styles.btn, loading && styles.btnDisabled]}
            onPress={handleSubmit}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel="Submit official accident entry"
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} size="large" />
            ) : (
              <Text style={styles.btnText}>SUBMIT OFFICIAL ENTRY</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SPACING.m },
  header: { marginBottom: SPACING.l },
  title: { ...TYPOGRAPHY.header, fontSize: 24, color: COLORS.primary },
  subtitle: { ...TYPOGRAPHY.caption, color: COLORS.textLight, fontWeight: "800", marginTop: 4, letterSpacing: 1 },
  formCard: { backgroundColor: COLORS.white, padding: SPACING.m, borderRadius: 16, ...SHADOWS.light, borderWidth: 2, borderColor: COLORS.lightGray },
  label: { ...TYPOGRAPHY.caption, fontWeight: "900", color: COLORS.primary, marginBottom: 8, letterSpacing: 0.5 },
  hint: { ...TYPOGRAPHY.caption, color: COLORS.textLight, fontSize: 12, marginTop: -4, marginBottom: 8 },
  input: { backgroundColor: COLORS.background, borderWidth: 2, borderColor: COLORS.lightGray, padding: SPACING.m, borderRadius: 12, marginBottom: SPACING.m, fontSize: 16, color: COLORS.text, minHeight: TOUCH_TARGETS.min },
  textArea: { height: 120 },
  switchRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: SPACING.xl, padding: SPACING.m, backgroundColor: COLORS.background, borderRadius: 12, minHeight: TOUCH_TARGETS.min },
  switchTextContainer: { flex: 1, paddingRight: 10 },
  btn: { backgroundColor: COLORS.secondary, minHeight: 65, borderRadius: 12, alignItems: "center", justifyContent: "center", ...SHADOWS.light },
  btnDisabled: { opacity: 0.7 },
  btnText: { color: COLORS.white, fontWeight: "900", fontSize: 18, letterSpacing: 1 },
});