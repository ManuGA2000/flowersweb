// Loading Component
// src\components\Loader.js
import React from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Text,
  Modal,
} from 'react-native';
import { COLORS, SIZES } from '../utils/theme';

// Simple inline loader
export const Loader = ({ size = 'large', color = COLORS.primary }) => (
  <View style={styles.loaderContainer}>
    <ActivityIndicator size={size} color={color} />
  </View>
);

// Full screen loader
export const FullScreenLoader = ({ visible = true, message = 'Loading...' }) => (
  <Modal transparent visible={visible} animationType="fade">
    <View style={styles.fullScreenContainer}>
      <View style={styles.loaderBox}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  </Modal>
);

// Empty state
export const EmptyState = ({ 
  title = 'No Data', 
  message = 'Nothing to display here.' 
}) => (
  <View style={styles.emptyContainer}>
    <View style={styles.emptyIcon}>
      <Text style={styles.emptyIconText}>🌸</Text>
    </View>
    <Text style={styles.emptyTitle}>{title}</Text>
    <Text style={styles.emptyMessage}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderBox: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    minWidth: 150,
  },
  message: {
    marginTop: 16,
    fontSize: SIZES.md,
    color: COLORS.text,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.cream,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyIconText: {
    fontSize: 36,
  },
  emptyTitle: {
    fontSize: SIZES.xl,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default Loader;