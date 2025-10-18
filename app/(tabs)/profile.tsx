import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Switch,
  Alert,
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import { User, Settings, Bell, Shield, CreditCard, CircleHelp as HelpCircle, LogOut, Edit, Star, Gift, Users, IndianRupee, ChevronRight, Phone, Mail, MapPin, Calendar, Wallet, Paperclip } from 'lucide-react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { signOut } from "../../firebaseConfig";
import auth from "@react-native-firebase/auth";
import axios from 'axios';
import { GoogleSignin } from '@react-native-google-signin/google-signin';


export default function ProfileScreen() {
  const router = useNavigation();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [whatsappNotifications, setWhatsappNotifications] = useState(true);
  const [userProfile, setUserProfile] = useState([]);
  const [userStats, setUserStats] = useState([]);

  console.log("userStats.monthlySpend : ", userStats.monthlySpend);
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const currentUser = auth().currentUser;
          if (!currentUser) {
            console.error("No user is logged in");
            return;
          }

          const idToken = await currentUser.getIdToken();

          const [profileRes, statsRes] = await Promise.all([
            axios.get(`https://api-s2onatgxwq-uc.a.run.app/api/auth/profile`, {
              headers: { Authorization: `Bearer ${idToken}` }
            }),
            axios.get(`https://api-s2onatgxwq-uc.a.run.app/api/dashboard/stats`, {
              headers: { Authorization: `Bearer ${idToken}` }
            }),
          ])
          setUserProfile(profileRes.data);
          setUserStats(statsRes.data);
        } catch (error) {
          console.error("Error fetching ProfileScreen data:", error);
        }
      };
      fetchData();
    }, []));

  const stats = [
    { label: 'Monthly Savings', value: `₹${userStats?.monthlySavings}`, icon: IndianRupee, color: '#10B981' },
    { label: 'Active Tribes', value: userStats?.activeTribes, icon: Users, color: '#8B5CF6' },
    { label: 'Subscriptions', value: userStats?.totalSubscriptions, icon: Gift, color: '#F59E0B' },
    { label: 'Monthly Spend', value: `₹${userStats?.monthlySpend}`, icon: IndianRupee, color: '#10B981' },
  ];

  const menuItems = [
    {
      section: 'Account',
      items: [
        { id: 'edit-profile', label: 'Edit Profile', icon: Edit, action: () => router.navigate('EditProfile') },
        { id: 'payment-methods', label: 'Payment Methods', icon: CreditCard, action: () => router.navigate('PaymentMethods') },
        // { id: 'referrals', label: 'Refer Friends', icon: Gift, action: () => handleReferral() },
      ]
    },
    {
      section: 'Preferences',
      items: [
        { id: 'notifications', label: 'Notifications', icon: Bell, hasSwitch: true, value: notificationsEnabled, onToggle: setNotificationsEnabled },
        { id: 'whatsapp', label: 'WhatsApp Notifications', icon: Phone, hasSwitch: true, value: whatsappNotifications, onToggle: setWhatsappNotifications },
        // { id: 'privacy', label: 'Privacy & Security', icon: Shield, action: () => router.push('/privacy') },
      ]
    },
    {
      section: 'Policys',
      items: [
        { id: 'PrivacyPolicy', label: 'Privacy Policy', icon: Paperclip, action: () => router.navigate('PrivacyPolicy') },
        { id: 'Refund', label: 'Refund Policy', icon: IndianRupee, action: () => router.navigate('RefundPolicy') },
        { id: 'Terms&Conditions', label: 'Terms of Service', icon: Paperclip, action: () => router.navigate('TermsConditions') },
        // { id: 'privacy', label: 'Privacy & Security', icon: Shield, action: () => router.push('/privacy') },
      ]
    },
    {
      section: 'Support',
      items: [
        { id: 'help', label: 'Help & Support', icon: HelpCircle, action: () => router.navigate('Help') },
        // { id: 'rate', label: 'Rate App', icon: Star, action: () => handleRateApp() },
      ]
    },
    {
      section: 'Account Actions',
      items: [
        { id: 'logout', label: 'Logout', icon: LogOut, action: () => handleLogout(), danger: true },
      ]
    }
  ];

  const handleReferral = () => {
    Alert.alert(
      'Refer Friends',
      `Share your referral code: ${userProfile.referralCode}\n\nBoth you and your friend will get ₹50 when they join their first group!`,
      [
        { text: 'Copy Code', onPress: () => Alert.alert('Copied!', 'Referral code copied to clipboard') },
        { text: 'Share', onPress: () => Alert.alert('Share', 'Opening share options...') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleRateApp = () => {
    Alert.alert('Rate App', 'Thank you for using our app! Redirecting to app store...');
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",

      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              // Sign out from Firebase
              await auth().signOut();

              // Clear Google Sign-In session
              await GoogleSignin.signOut();

              // Revoke access to force account chooser on next login
              await GoogleSignin.revokeAccess();

              // Navigate back to login screen
              router.navigate("Login");

              console.log("✅ User fully logged out and access revoked");
            } catch (err: any) {
              console.error("❌ Logout error:", err);
              Alert.alert("Error", err.message || "Something went wrong during logout.");
            }
          },
        },
      ]
    );
  };


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity onPress={() => router.navigate('Wallet')}>
            <Wallet size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <LinearGradient
            colors={['#8B5CF6', '#A78BFA']}
            style={styles.profileGradient}
          >
            {userProfile.profileImageUrl ? (
              <Image
                source={{ uri: userProfile.profileImageUrl }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.profilePlaceholder}>
                <Text style={styles.profileInitials}>
                  {`${userProfile.firstName?.[0] ?? ''}${userProfile.lastName?.[0] ?? ''}`.toUpperCase()}
                </Text>
              </View>
            )}
            <Text style={styles.profileName}>{userProfile.firstName} {userProfile.lastName}</Text>
            <View style={styles.profileInfo}>
              <View style={styles.profileInfoItem}>
                <Mail size={14} color="#FFFFFF" />
                <Text style={styles.profileInfoText}>{userProfile.email}</Text>
              </View>
              <View style={styles.profileInfoItem}>
                <Phone size={14} color="#FFFFFF" />
                <Text style={styles.profileInfoText}>{userProfile.phoneNumber}</Text>
              </View>
              {/* <View style={styles.profileInfoItem}>
                <MapPin size={14} color="#FFFFFF" />
                <Text style={styles.profileInfoText}>{userProfile.location}</Text>
              </View> */}
              <View style={styles.profileInfoItem}>
                <Calendar size={14} color="#FFFFFF" />
                <Text style={styles.profileInfoText}>
                  Member since{" "}
                  {userProfile?.createdAt?.["_seconds"]
                    ? new Date(userProfile.createdAt._seconds * 1000).toLocaleDateString(
                      "en-US",
                      { month: "long", year: "numeric" }
                    )
                    : ""}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
                <stat.icon size={20} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Menu Sections */}
        {menuItems.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.menuSection}>
            <Text style={styles.sectionTitle}>{section.section}</Text>
            {section.items.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.menuItem, item.danger && styles.dangerItem]}
                onPress={item.action}
                disabled={item.hasSwitch}
              >
                <View style={styles.menuItemLeft}>
                  <View style={[styles.menuItemIcon, item.danger && styles.dangerIcon]}>
                    <item.icon size={20} color={item.danger ? '#EF4444' : '#6B7280'} />
                  </View>
                  <Text style={[styles.menuItemText, item.danger && styles.dangerText]}>
                    {item.label}
                  </Text>
                </View>
                {item.hasSwitch ? (
                  <Switch
                    value={item.value}
                    onValueChange={item.onToggle}
                    trackColor={{ false: '#E5E7EB', true: '#8B5CF6' }}
                    thumbColor={item.value ? '#FFFFFF' : '#F3F4F6'}
                  />
                ) : (
                  <ChevronRight size={20} color="#9CA3AF" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  profileCard: {
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
  },
  profileGradient: {
    padding: 24,
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  profilePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 6,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },

  profileInitials: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 1,
  },
  profileName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  profileInfoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    marginLeft: 8,
    opacity: 0.9,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',   // allow wrapping to next line
    paddingHorizontal: 20,
    marginBottom: 24,
  },

  statCard: {
    width: '48%',        // take about half of the row
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,    // space between rows
    marginHorizontal: '1%', // small side spacing
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
  },
  menuSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
  },
  dangerItem: {
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  dangerIcon: {
    backgroundColor: '#FEE2E2',
  },
  dangerText: {
    color: '#EF4444',
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  versionText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
});