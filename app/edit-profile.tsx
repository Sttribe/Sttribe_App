import React, { useCallback, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Image,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { User, Mail, Phone, Shield, ArrowLeft, CreditCard } from 'lucide-react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import auth from '@react-native-firebase/auth'
import axios from 'axios';

export default function EditProfile() {
    const [userProfile, setUserProfile] = useState<any>({});
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [upiId, setUpiId] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const router = useNavigation();

    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                try {
                    const currentUser = auth().currentUser;

                    if (!currentUser) {
                        console.error('No user is logged in');
                        return;
                    }

                    const idToken = await currentUser.getIdToken();

                    const res = await axios.get(
                        `https://api-s2onatgxwq-uc.a.run.app/api/auth/profile`,
                        { headers: { Authorization: `Bearer ${idToken}` } }
                    );
                    setUserProfile(res.data);
                    setFirstName(res.data.firstName || '');
                    setLastName(res.data.lastName || '');
                    setPhoneNumber(res.data.phoneNumber || '');
                    setUpiId(res.data.upiId || '');
                } catch (error) {
                    console.error('Error fetching profile:', error);
                }
            };
            fetchData();
        }, [])
    );

    const handleSave = async () => {
        try {
            const currentUser = auth().currentUser;
            if (!currentUser) return;

            // Get Firebase ID token
            const idToken = await currentUser.getIdToken();

            // Build payload (send only the fields user can edit)
            const payload = {
                firstName: firstName || "",
                lastName: lastName || "",
                phoneNumber: phoneNumber || "",
                upiId: upiId || "",
                address: "",
                pincode: "",
            };
            console.log("Payload sent:", payload);

            // Call your API
            await axios.put(
                "https://api-s2onatgxwq-uc.a.run.app/api/auth/profile",
                payload,
                { headers: { Authorization: `Bearer ${idToken}` } }
            );

            Alert.alert("Success", "Profile updated successfully");
            // console.log("Success", "Profile updated successfully");
            router.goBack();
        } catch (err) {
            console.error("Error updating profile:", err.response?.data || err.message);
            Alert.alert("Error", "Failed to update profile");
        }
    };


    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.headerButton} onPress={() => router.goBack()}>
                        <ArrowLeft size={24} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Edit Profile</Text>
                </View>

                {/* Profile Card */}
                <View style={styles.profileCard}>
                    <LinearGradient colors={['#8B5CF6', '#A78BFA']} style={styles.profileGradient}>
                        <Image
                            source={{ uri: userProfile.profileImageUrl }}
                            style={styles.profileImage}
                        />
                        <Text style={styles.profileName}>
                            {firstName} {lastName}
                        </Text>

                        <View style={styles.profileInfo}>
                            <View style={styles.profileInfoItem}>
                                <Mail size={18} color="#fff" />
                                <Text style={styles.profileInfoText}>{userProfile.email}</Text>
                            </View>
                            <View style={styles.profileInfoItem}>
                                <Phone size={18} color="#fff" />
                                <Text style={styles.profileInfoText}>
                                    {phoneNumber ? phoneNumber : 'Update Phone Number'}
                                </Text>
                            </View>
                        </View>
                    </LinearGradient>
                </View>

                {/* Sections */}
                <View style={styles.menuSection}>
                    <Text style={styles.sectionTitle}>Personal Information</Text>
                    <View style={styles.menuItem}>
                        <View style={styles.menuItemLeft}>
                            <View style={styles.menuItemIcon}>
                                <User size={20} color="#111827" />
                            </View>
                            <TextInput
                                style={styles.menuItemText}
                                placeholder="First Name"
                                value={firstName}
                                onChangeText={setFirstName}
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>
                    </View>
                    <View style={styles.menuItem}>
                        <View style={styles.menuItemLeft}>
                            <View style={styles.menuItemIcon}>
                                <User size={20} color="#111827" />
                            </View>
                            <TextInput
                                style={[styles.menuItemText, { flex: 1 }]}
                                placeholder="Last Name"
                                value={lastName}
                                onChangeText={setLastName}
                                underlineColorAndroid="transparent"
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>
                    </View>
                </View>

                <View style={styles.menuSection}>
                    <Text style={styles.sectionTitle}>Contact & Payment</Text>
                    <View style={styles.menuItem}>
                        <View style={styles.menuItemLeft}>
                            <View style={styles.menuItemIcon}>
                                <Phone size={20} color="#111827" />
                            </View>
                            <TextInput
                                style={styles.menuItemText}
                                placeholder="Phone Number"
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                                keyboardType="phone-pad"
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>
                    </View>
                    <View style={styles.menuItem}>
                        <View style={styles.menuItemLeft}>
                            {/* Icon */}
                            <View style={styles.menuItemIcon}>
                                <CreditCard size={20} color="#111827" />
                            </View>

                            {/* Label + Input */}
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <Text style={styles.menuItemTextUpi}>UPI ID: </Text>
                                <TextInput
                                    style={[styles.menuItemText, { flex: 1 }]}
                                    placeholder="Add Your UPI ID"
                                    value={upiId}
                                    onChangeText={setUpiId}
                                    placeholderTextColor="#999"
                                />
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.menuSection}>
                    <Text style={styles.sectionTitle}>Account Security</Text>
                    <View style={[styles.menuItem, styles.dangerItem]}>
                        <View style={styles.menuItemLeft}>
                            <View style={[styles.menuItemIcon, styles.dangerIcon]}>
                                <Shield size={20} color="#EF4444" />
                            </View>
                            <Text style={[styles.menuItemText, styles.dangerText]}>
                                Two-Factor Authentication
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Save Button */}
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>

                {/* Version */}
                <View style={styles.versionContainer}>
                    <Text style={styles.versionText}>App Version 1.0.0</Text>
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
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 16,
        flexDirection: 'row',
    },
    headerButton: {
        marginRight: 15,
        paddingTop: 5,
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
        shadowOffset: { width: 0, height: 4 },
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
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        // flex: 1,
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
        flex: 1,                // takes remaining space
        fontSize: 16,
        fontFamily: 'Inter-Regular',
        color: '#111827',
        paddingVertical: 8,     // gives proper height
        paddingHorizontal: 8
    },
    menuItemTextUpi: {
        fontSize: 16,
        fontFamily: 'Inter-Regular',
        color: '#111827',
        paddingVertical: 8,     // gives proper height
        paddingHorizontal: 8
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
    saveButton: {
        backgroundColor: '#8B5CF6',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginHorizontal: 20,
        marginBottom: 24,
    },
    saveButtonText: {
        fontSize: 16,
        fontFamily: 'Inter-SemiBold',
        color: '#fff',
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
