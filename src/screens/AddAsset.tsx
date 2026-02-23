import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useAsset } from "../hooks/useAsset";
import { COLORS, SPACING, TYPOGRAPHY, TOUCH_TARGETS } from "../theme";

export const AddAsset = ({ route, navigation }: any) => {
  const {
    form,
    setters,
    loading,
    isEditing,
    handleSave,
    handleDelete,
  } = useAsset(route.params?.asset, navigation);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title} accessibilityRole="header">
          {isEditing ? "Update Asset" : "New Asset"}
        </Text>

        <Text style={styles.label}>ASSET NAME</Text>
        <TextInput
          testID="input-asset-name"
          style={styles.input}
          value={form.name}
          onChangeText={setters.setName}
          placeholder="Name"
          placeholderTextColor={COLORS.textLight}
          accessibilityLabel="Asset Name"
          accessibilityHint="Enter the name of the statutory asset"
        />

        <Text style={styles.label}>CATEGORY</Text>
        <TextInput
          testID="input-asset-category"
          style={styles.input}
          value={form.type}
          onChangeText={setters.setType}
          placeholder="Type"
          placeholderTextColor={COLORS.textLight}
          accessibilityLabel="Category"
          accessibilityHint="Enter the asset category"
        />

        <Text style={styles.label}>REGULATION</Text>
        <TextInput
          testID="input-asset-regulation"
          style={styles.input}
          value={form.regulation}
          onChangeText={setters.setRegulation}
          placeholder="Regulation"
          placeholderTextColor={COLORS.textLight}
          accessibilityLabel="Regulation"
          accessibilityHint="Enter the applicable health and safety regulation"
        />

        <Text style={styles.label}>LOCATION</Text>
        <TextInput
          testID="input-asset-location"
          style={styles.input}
          value={form.location}
          onChangeText={setters.setLocation}
          placeholder="Location"
          placeholderTextColor={COLORS.textLight}
          accessibilityLabel="Location"
          accessibilityHint="Enter the physical location of the asset"
        />

        <TouchableOpacity
          testID="btn-save-asset"
          style={styles.saveBtn}
          onPress={handleSave}
          disabled={loading}
          accessibilityRole="button"
          accessibilityLabel="Save Record"
          accessibilityHint="Finalizes and saves the asset details to the registry"
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.saveBtnText}>SAVE RECORD</Text>
          )}
        </TouchableOpacity>

        {isEditing && (
          <TouchableOpacity
            testID="btn-delete-asset"
            style={styles.deleteBtn}
            onPress={handleDelete}
            accessibilityRole="button"
            accessibilityLabel="Delete Asset"
            accessibilityHint="Permanently removes this asset from the database"
          >
            <Text style={styles.deleteBtnText}>DELETE ASSET</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  scroll: { padding: SPACING.l },
  title: {
    ...TYPOGRAPHY.header,
    color: COLORS.primary,
    marginBottom: SPACING.xl,
  },
  label: {
    ...TYPOGRAPHY.caption,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: SPACING.xs,
    letterSpacing: 1,
  },
  input: {
    backgroundColor: COLORS.background,
    padding: SPACING.m,
    borderRadius: 12,
    marginBottom: SPACING.l,
    borderWidth: 2,
    borderColor: COLORS.lightGray,
    minHeight: TOUCH_TARGETS.min,
    ...TYPOGRAPHY.body,
    color: COLORS.text,
  },
  saveBtn: {
    backgroundColor: COLORS.success,
    minHeight: TOUCH_TARGETS.min,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: SPACING.m,
  },
  saveBtnText: {
    ...TYPOGRAPHY.body,
    color: COLORS.white,
    fontWeight: "800",
    letterSpacing: 1,
  },
  deleteBtn: {
    marginTop: SPACING.xl,
    alignItems: "center",
    minHeight: TOUCH_TARGETS.min,
    justifyContent: "center",
  },
  deleteBtnText: {
    ...TYPOGRAPHY.body,
    color: COLORS.secondary,
    fontWeight: "800",
    textDecorationLine: "underline",
  },
});
