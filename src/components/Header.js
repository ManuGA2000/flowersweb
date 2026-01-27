// Enhanced Header Component with SVG Logo (with fallback)
// src/components/Header.js

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, SIZES } from '../utils/theme';
import { useCart } from '../context/CartContext';

// Try to import SVG logo - will use fallback if not configured
let GrowteqLogo = null;
try {
  // This requires react-native-svg and react-native-svg-transformer to be configured
  GrowteqLogo = require('../assets/Growteq_Fevicon.svg').default;
} catch (e) {
  console.log('SVG import not available, using fallback icon');
}

const Header = ({ 
  title, 
  subtitle,
  showBack = false, 
  showCart = true,
  showSearch = false,
  onBackPress,
  onSearchPress,
  navigation,
  rightComponent,
  transparent = false,
  light = false,
}) => {
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  const textColor = light || transparent ? COLORS.text : COLORS.textWhite;
  const iconColor = light || transparent ? COLORS.text : COLORS.textWhite;

  // Render logo - SVG if available, otherwise fallback to icon
  const renderLogo = () => {
    // Check if GrowteqLogo is a valid React component
    if (GrowteqLogo && typeof GrowteqLogo === 'function') {
      return <GrowteqLogo width={32} height={32} />;
    }
    
    // Fallback to MaterialCommunityIcons
    return <Icon name="flower-tulip" size={28} color={COLORS.primary} />;
  };

  const HeaderContent = () => (
    <View style={styles.content}>
      {/* Left - Back button or Logo */}
      <View style={styles.left}>
        {showBack ? (
          <TouchableOpacity 
            style={[
              styles.iconBtn,
              (light || transparent) && styles.iconBtnLight,
            ]}
            onPress={onBackPress || (() => navigation?.goBack())}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.7}
          >
            <Icon name="arrow-left" size={22} color={iconColor} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.logoContainer}
            onPress={() => navigation?.navigate('Home')}
            activeOpacity={0.8}
          >
            <View style={styles.logoImageWrapper}>
              {renderLogo()}
            </View>
            <View style={styles.logoTextContainer}>
              <Text style={[styles.logoTitle, { color: textColor }]}>Growteq</Text>
              <Text style={[styles.logoSubtitle, { color: textColor }]}>FLOWERS</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* Center - Title (always show if provided) */}
      {title && (
        <View style={[styles.center, showBack && styles.centerWithBack]}>
          <Text 
            style={[
              styles.title, 
              { color: textColor },
              !showBack && styles.titleWithLogo,
            ]} 
            numberOfLines={1}
          >
            {title}
          </Text>
          {subtitle && (
            <Text 
              style={[
                styles.subtitle, 
                { color: textColor },
                !showBack && styles.subtitleWithLogo,
              ]} 
              numberOfLines={1}
            >
              {subtitle}
            </Text>
          )}
        </View>
      )}

      {/* Right - Actions */}
      <View style={styles.right}>
        {rightComponent ? rightComponent : (
          <View style={styles.rightActions}>
            {showSearch && (
              <TouchableOpacity 
                style={[
                  styles.iconBtn,
                  (light || transparent) && styles.iconBtnLight,
                  { marginRight: 8 },
                ]}
                onPress={onSearchPress}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                activeOpacity={0.7}
              >
                <Icon name="magnify" size={22} color={iconColor} />
              </TouchableOpacity>
            )}
            {showCart && (
              <TouchableOpacity 
                style={[
                  styles.iconBtn,
                  (light || transparent) && styles.iconBtnLight,
                ]}
                onPress={() => {
                  if (navigation && navigation.navigate) {
                    navigation.navigate('Cart');
                  }
                }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                activeOpacity={0.7}
              >
                <Icon name="cart-outline" size={22} color={iconColor} />
                {cartCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {cartCount > 99 ? '99+' : cartCount}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </View>
  );

  if (transparent) {
    return (
      <View style={[styles.container, styles.containerTransparent]}>
        <StatusBar 
          translucent 
          backgroundColor="transparent" 
          barStyle={light ? "dark-content" : "light-content"} 
        />
        <HeaderContent />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={COLORS.gradientPrimary || [COLORS.primary, COLORS.primaryDark || '#388E3C']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}
    >
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      <HeaderContent />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  containerTransparent: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    shadowColor: 'transparent',
    elevation: 0,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
    paddingHorizontal: 16,
  },
  left: {
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'flex-start',
    paddingHorizontal: 12,
  },
  centerWithBack: {
    alignItems: 'center',
  },
  right: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImageWrapper: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: COLORS.white || '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  logoTextContainer: {
    marginLeft: 10,
    justifyContent: 'center',
  },
  logoTitle: {
    fontSize: SIZES?.lg || 18,
    fontWeight: '800',
    letterSpacing: 0.3,
    lineHeight: 22,
  },
  logoSubtitle: {
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 3,
    opacity: 0.85,
    marginTop: -1,
  },
  title: {
    fontSize: SIZES?.md || 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  titleWithLogo: {
    fontSize: SIZES?.sm || 14,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: SIZES?.xs || 12,
    opacity: 0.85,
    marginTop: 2,
  },
  subtitleWithLogo: {
    fontSize: 11,
  },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  iconBtnLight: {
    backgroundColor: COLORS.white || '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: COLORS.accent || '#FF5722',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    borderWidth: 2,
    borderColor: COLORS.white || '#FFFFFF',
  },
  badgeText: {
    color: COLORS.textWhite || '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
});

export default Header;