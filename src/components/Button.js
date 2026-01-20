// Enhanced Custom Button Component
// src/components/Button.js
import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, SIZES, SHADOWS } from '../utils/theme';

const Button = ({ 
  title, 
  onPress, 
  variant = 'primary',
  size = 'medium',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = true,
  style,
  textStyle,
}) => {
  const getVariantConfig = () => {
    switch (variant) {
      case 'secondary':
        return {
          colors: COLORS.gradientSecondary,
          textColor: COLORS.textWhite,
          iconColor: COLORS.textWhite,
          gradient: true,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: COLORS.primary,
          textColor: COLORS.primary,
          iconColor: COLORS.primary,
          gradient: false,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          textColor: COLORS.primary,
          iconColor: COLORS.primary,
          gradient: false,
        };
      case 'whatsapp':
        return {
          backgroundColor: COLORS.whatsapp,
          textColor: COLORS.textWhite,
          iconColor: COLORS.textWhite,
          gradient: false,
        };
      case 'danger':
        return {
          backgroundColor: COLORS.error,
          textColor: COLORS.textWhite,
          iconColor: COLORS.textWhite,
          gradient: false,
        };
      case 'success':
        return {
          backgroundColor: COLORS.success,
          textColor: COLORS.textWhite,
          iconColor: COLORS.textWhite,
          gradient: false,
        };
      case 'light':
        return {
          backgroundColor: COLORS.primaryMuted,
          textColor: COLORS.primary,
          iconColor: COLORS.primary,
          gradient: false,
        };
      default: // primary
        return {
          colors: COLORS.gradientPrimary,
          textColor: COLORS.textWhite,
          iconColor: COLORS.textWhite,
          gradient: true,
        };
    }
  };

  const getSizeConfig = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: 8,
          paddingHorizontal: 16,
          fontSize: SIZES.sm,
          iconSize: 16,
          borderRadius: SIZES.radiusSM,
        };
      case 'large':
        return {
          paddingVertical: 18,
          paddingHorizontal: 32,
          fontSize: SIZES.xl,
          iconSize: 24,
          borderRadius: SIZES.radiusLG,
        };
      default: // medium
        return {
          paddingVertical: 14,
          paddingHorizontal: 24,
          fontSize: SIZES.lg,
          iconSize: 20,
          borderRadius: SIZES.radius,
        };
    }
  };

  const variantConfig = getVariantConfig();
  const sizeConfig = getSizeConfig();

  const buttonContent = (
    <View style={styles.content}>
      {loading ? (
        <ActivityIndicator 
          color={variantConfig.textColor} 
          size={size === 'small' ? 'small' : 'small'} 
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <Icon 
              name={icon} 
              size={sizeConfig.iconSize} 
              color={variantConfig.iconColor}
              style={styles.iconLeft}
            />
          )}
          <Text style={[
            styles.text,
            { color: variantConfig.textColor, fontSize: sizeConfig.fontSize },
            textStyle,
          ]}>
            {title}
          </Text>
          {icon && iconPosition === 'right' && (
            <Icon 
              name={icon} 
              size={sizeConfig.iconSize} 
              color={variantConfig.iconColor}
              style={styles.iconRight}
            />
          )}
        </>
      )}
    </View>
  );

  const buttonStyle = [
    styles.button,
    {
      paddingVertical: sizeConfig.paddingVertical,
      paddingHorizontal: sizeConfig.paddingHorizontal,
      borderRadius: sizeConfig.borderRadius,
    },
    !variantConfig.gradient && { backgroundColor: variantConfig.backgroundColor },
    variant === 'outline' && { 
      borderWidth: 2, 
      borderColor: variantConfig.borderColor,
    },
    disabled && styles.disabled,
    fullWidth && styles.fullWidth,
    !variantConfig.gradient && SHADOWS.small,
    style,
  ];

  if (variantConfig.gradient && !disabled) {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={[fullWidth && styles.fullWidth, style]}
      >
        <LinearGradient
          colors={variantConfig.colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.button,
            {
              paddingVertical: sizeConfig.paddingVertical,
              paddingHorizontal: sizeConfig.paddingHorizontal,
              borderRadius: sizeConfig.borderRadius,
            },
            disabled && styles.disabled,
            SHADOWS.medium,
          ]}
        >
          {buttonContent}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {buttonContent}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});

export default Button;