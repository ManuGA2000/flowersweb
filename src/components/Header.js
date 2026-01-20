// Enhanced Header Component - Optimized for better appearance
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

  const textColor = light || transparent ? COLORS.text :  COLORS.textWhite;
  const iconColor = light || transparent ? COLORS.text : COLORS.textWhite;

  const HeaderContent = () => (
    <View style={styles.content}>
      {/* Left - Back button or Logo */}
      <View style={styles.left}>
        {showBack ?  (
          <TouchableOpacity 
            style={[
              styles.iconBtn,
              (light || transparent) && styles.iconBtnLight,
            ]}
            onPress={onBackPress || (() => navigation?.goBack())}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon name="arrow-left" size={24} color={iconColor} />
          </TouchableOpacity>
        ) : (
          <View style={styles.logoContainer}>
            <View style={styles.logoIcon}>
              <Icon name="flower-tulip" size={22} color={COLORS.primary} />
            </View>
            <View style={styles.logoText}>
              <Text style={[styles. logoTitle, { color: textColor }]}>Growteq</Text>
              <Text style={[styles.logoSubtitle, { color: textColor }]}>FLOWERS</Text>
            </View>
          </View>
        )}
      </View>

      {/* Center - Title */}
      {(title || showBack) && (
        <View style={styles.center}>
          <Text style={[styles.title, { color: textColor }]} numberOfLines={1}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.subtitle, { color: textColor }]} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>
      )}

      {/* Right - Actions */}
      <View style={styles.right}>
        {rightComponent ?  rightComponent : (
          <View style={styles.rightActions}>
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
                hitSlop={{ top: 10, bottom:  10, left: 10, right: 10 }}
              >
                <Icon name="cart-outline" size={24} color={iconColor} />
                {cartCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {cartCount > 9 ? '9+' : cartCount}
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
        <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
        <HeaderContent />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={COLORS.gradientPrimary}
      start={{ x: 0, y:  0 }}
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
  },
  containerTransparent:  {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  content:  {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: 12,
  },
  left: {
    minWidth: 48,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  right:  {
    minWidth: 48,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  rightActions: {
    flexDirection:  'row',
    alignItems: 'center',
    gap: 4,
  },
  logoContainer: {
    flexDirection:  'row',
    alignItems: 'center',
    gap: 8,
  },
  logoIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems:  'center',
  },
  logoText: {
    justifyContent: 'center',
  },
  logoTitle: {
    fontSize:  SIZES.md,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  logoSubtitle: {
    fontSize: 7,
    fontWeight: '600',
    letterSpacing: 2,
    opacity: 0.8,
    marginTop: -2,
  },
  title: {
    fontSize: SIZES.md,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: SIZES.xs,
    opacity: 0.8,
    marginTop: 2,
    textAlign: 'center',
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  iconBtnLight:  {
    backgroundColor: COLORS.white,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity:  1,
    shadowRadius: 4,
    elevation: 3,
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: COLORS.accent,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  badgeText: {
    color: COLORS.textWhite,
    fontSize: 10,
    fontWeight: '700',
  },
});

export default Header;