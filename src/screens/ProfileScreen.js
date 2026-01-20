// src\screens\ProfileScreen.js

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, SIZES } from '../utils/theme';
import { Header, Button, Input } from '../components';
import { useAuth } from '../context/AuthContext';
import { signOut, updateUserProfile } from '../services/authService';

const ProfileScreen = ({ navigation }) => {
  const { user, userProfile, isLoggedIn, refreshProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(userProfile?.name || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: async () => { await signOut(); navigation.replace('Login'); } },
    ]);
  };

  const handleSaveProfile = async () => {
    if (!name.trim()) { Alert.alert('Error', 'Please enter your name'); return; }
    setLoading(true);
    const result = await updateUserProfile(user.uid, { name: name.trim(), phone: phone.trim() });
    setLoading(false);
    if (result.success) { await refreshProfile(); setEditing(false); Alert.alert('Success', 'Profile updated successfully'); }
    else { Alert.alert('Error', result.error); }
  };

  const MenuItem = ({ icon, title, subtitle, onPress, danger }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={[styles.menuIcon, danger && styles.menuIconDanger]}>
        <Icon name={icon} size={22} color={danger ? COLORS.error : COLORS.primary} />
      </View>
      <View style={styles.menuContent}>
        <Text style={[styles.menuTitle, danger && styles.menuTitleDanger]}>{title}</Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
      <Icon name="chevron-right" size={20} color={COLORS.textLight} />
    </TouchableOpacity>
  );

  if (!isLoggedIn) {
    return (
      <View style={styles.container}>
        <Header title="Profile" showCart={false} navigation={navigation} />
        <View style={styles.notLoggedIn}>
          <View style={styles.avatarLarge}><Icon name="account-outline" size={60} color={COLORS.textLight} /></View>
          <Text style={styles.notLoggedInTitle}>Welcome to Growteq Flowers</Text>
          <Text style={styles.notLoggedInText}>Login to manage your profile and orders</Text>
          <Button title="Login" onPress={() => navigation.navigate('Login')} style={styles.loginBtn} />
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}><Text style={styles.signupLink}>Don't have an account? Sign Up</Text></TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Profile" showCart={false} navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}><Text style={styles.avatarText}>{userProfile?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}</Text></View>
          {editing ? (
            <View style={styles.editForm}>
              <Input label="Full Name" value={name} onChangeText={setName} placeholder="Enter your name" icon="account-outline" />
              <Input label="Phone Number" value={phone} onChangeText={setPhone} placeholder="Enter phone number" keyboardType="phone-pad" icon="phone-outline" />
              <View style={styles.editActions}>
                <Button title="Cancel" onPress={() => { setEditing(false); setName(userProfile?.name || ''); setPhone(userProfile?.phone || ''); }} variant="outline" size="small" style={styles.editBtn} />
                <Button title="Save" onPress={handleSaveProfile} loading={loading} size="small" style={styles.editBtn} />
              </View>
            </View>
          ) : (
            <>
              <Text style={styles.userName}>{userProfile?.name || 'User'}</Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
              {userProfile?.phone && <Text style={styles.userPhone}>{userProfile.phone}</Text>}
              <TouchableOpacity style={styles.editProfileBtn} onPress={() => setEditing(true)}>
                <Icon name="pencil" size={16} color={COLORS.primary} />
                <Text style={styles.editProfileText}>Edit Profile</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
        <View style={styles.menuSection}>
          <MenuItem icon="clipboard-list-outline" title="My Orders" subtitle="View your order history" onPress={() => navigation.navigate('Orders')} />
          <MenuItem icon="help-circle-outline" title="Help & Support" subtitle="Get help with your orders" onPress={() => Alert.alert('Contact Us', 'Email: support@growteq.com\nPhone: +91 98765 43210')} />
          <MenuItem icon="information-outline" title="About" subtitle="About Growteq Flowers" onPress={() => Alert.alert('Growteq Flowers', 'Version 1.0.0\n\nBy Growteq Agri Farms Pvt Ltd')} />
        </View>
        <View style={styles.menuSection}>
          <MenuItem icon="logout" title="Logout" danger onPress={handleLogout} />
        </View>
        <View style={styles.footer}><Text style={styles.footerText}>Growteq Flowers v1.0.0</Text><Text style={styles.footerText}>Made with 🌸 in India</Text></View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  profileHeader: { alignItems: 'center', padding: 24, backgroundColor: COLORS.white, marginBottom: 16 },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  avatarText: { fontSize: 40, fontWeight: '700', color: COLORS.textWhite },
  avatarLarge: { width: 120, height: 120, borderRadius: 60, backgroundColor: COLORS.cream, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  userName: { fontSize: 22, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  userEmail: { fontSize: SIZES.md, color: COLORS.textSecondary, marginBottom: 4 },
  userPhone: { fontSize: SIZES.md, color: COLORS.textSecondary },
  editProfileBtn: { flexDirection: 'row', alignItems: 'center', marginTop: 12, paddingVertical: 8, paddingHorizontal: 16, backgroundColor: COLORS.cream, borderRadius: 20 },
  editProfileText: { color: COLORS.primary, fontWeight: '500', marginLeft: 6 },
  editForm: { width: '100%', marginTop: 8 },
  editActions: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginTop: 8 },
  editBtn: { minWidth: 100 },
  menuSection: { backgroundColor: COLORS.white, marginBottom: 16 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  menuIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.cream, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  menuIconDanger: { backgroundColor: '#FFEBEE' },
  menuContent: { flex: 1 },
  menuTitle: { fontSize: SIZES.md, fontWeight: '600', color: COLORS.text },
  menuTitleDanger: { color: COLORS.error },
  menuSubtitle: { fontSize: SIZES.sm, color: COLORS.textSecondary, marginTop: 2 },
  notLoggedIn: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  notLoggedInTitle: { fontSize: SIZES.xl, fontWeight: '700', color: COLORS.text, marginBottom: 8 },
  notLoggedInText: { fontSize: SIZES.md, color: COLORS.textSecondary, textAlign: 'center', marginBottom: 24 },
  loginBtn: { paddingHorizontal: 48, marginBottom: 16 },
  signupLink: { fontSize: SIZES.md, color: COLORS.primary, fontWeight: '500' },
  footer: { alignItems: 'center', padding: 24 },
  footerText: { fontSize: SIZES.sm, color: COLORS.textLight, marginBottom: 4 },
});

export default ProfileScreen;