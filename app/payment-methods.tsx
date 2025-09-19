import React, { useCallback, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Switch,
} from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import auth from '@react-native-firebase/auth'
import axios from "axios";

export default function PaymentMethodScreen() {
    const [autoPay, setAutoPay] = useState(false);
    const [upiId, setUpiId] = useState('');

    const toggleAutoPay = () => {
        setAutoPay((prev) => !prev);
        console.log('autopay: ', autoPay);
    };
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
                    setUpiId(res.data.upiId || '');
                } catch (error) {
                    console.error('Error fetching profile:', error);
                }
            };
            fetchData();
        }, [])
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.goBack()}>
                    <ArrowLeft size={28} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Payment Methods</Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 20 }}>
                {/* UPI Section */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>UPI Payment</Text>
                    <View style={styles.upiRow}>
                        <Text style={styles.upiId}>UPI ID: {upiId}</Text>
                        <View style={styles.primaryTag}>
                            <Text style={styles.primaryText}>Primary</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.updateButton} onPress={() => router.navigate('EditProfile')}>
                        <Text style={styles.updateButtonText}>Update UPI ID</Text>
                    </TouchableOpacity>
                </View>

                {/* Cards & Wallets */}
                <View style={styles.card}>
                    <View style={styles.rowBetween}>
                        <Text style={styles.sectionTitle}>Cards & Wallets</Text>
                        <Text style={styles.linkText}>Razorpay</Text>
                    </View>
                    <Text style={styles.subtitle}>
                        Secure payment processing for subscriptions and tribe contributions
                    </Text>

                    <View style={styles.paymentGrid}>
                        <View style={styles.paymentOption}>
                            <Text style={styles.paymentText}>💳 Cards</Text>
                        </View>
                        <View style={styles.paymentOption}>
                            <Text style={styles.paymentText}>📱 Wallets</Text>
                        </View>
                        <View style={styles.paymentOption}>
                            <Text style={styles.paymentText}>🏦 Net Banking</Text>
                        </View>
                        <View style={styles.paymentOption}>
                            <Text style={styles.paymentText}>💰 UPI</Text>
                        </View>
                    </View>
                </View>

                {/* Auto Pay */}
                <View style={styles.card}>
                    <View style={styles.rowBetween}>
                        <View>
                            <Text style={styles.sectionTitle}>Auto-Pay</Text>
                            <Text style={styles.subtitle}>
                                Automatically pay for tribe subscriptions when due
                            </Text>
                        </View>
                        <Switch
                            value={autoPay}
                            onValueChange={toggleAutoPay}
                            trackColor={{ false: '#E5E7EB', true: '#8B5CF6' }}
                            thumbColor={autoPay ? '#FFFFFF' : '#F3F4F6'}
                        />
                    </View>
                </View>

                {/* Close Button */}
                {/* <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
                    <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity> */}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FAFB",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: "Inter-Bold",
        color: "#111827",
        marginLeft: 10,
    },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: "Inter-SemiBold",
        color: "#111827",
        marginBottom: 8,
    },
    upiRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    upiId: {
        fontSize: 14,
        color: "#374151",
    },
    primaryTag: {
        backgroundColor: "#D1FAE5",
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
        marginLeft: 8,
    },
    primaryText: {
        fontSize: 12,
        color: "#059669",
        fontFamily: "Inter-SemiBold",
    },
    updateButton: {
        backgroundColor: "#E5E7EB",
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: "center",
    },
    updateButtonText: {
        color: "#111827",
        fontSize: 14,
        fontFamily: "Inter-SemiBold",
    },
    rowBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    linkText: {
        fontSize: 14,
        color: "#4F46E5",
        fontFamily: "Inter-SemiBold",
    },
    subtitle: {
        fontSize: 13,
        color: "#6B7280",
        marginBottom: 12,
    },
    paymentGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
    },
    paymentOption: {
        flex: 1,
        minWidth: "45%",
        backgroundColor: "#F3F4F6",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 10,
    },
    paymentText: {
        fontSize: 14,
        fontFamily: "Inter-SemiBold",
        color: "#111827",
    },
    closeButton: {
        backgroundColor: "#E5E7EB",
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: "center",
    },
    closeButtonText: {
        fontSize: 16,
        fontFamily: "Inter-SemiBold",
        color: "#111827",
    },
});
