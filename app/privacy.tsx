import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { ArrowLeft, Lock, Key, Eye, Shield } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";

export default function PrivacySecurityScreen() {
    const menuItems = [
        { id: "1", title: "Change Password", icon: <Key size={20} color="#111827" /> },
        { id: "2", title: "Two-Factor Authentication", icon: <Shield size={20} color="#111827" /> },
        { id: "3", title: "Manage App Permissions", icon: <Eye size={20} color="#111827" /> },
        { id: "4", title: "Privacy Settings", icon: <Lock size={20} color="#111827" /> },
    ];
    const router = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.goBack()}>
                    <ArrowLeft size={24} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Privacy & Security</Text>
            </View>

            {/* Content */}
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.menuSection}>
                    <Text style={styles.sectionTitle}>Security Options</Text>
                    {menuItems.map((item) => (
                        <TouchableOpacity key={item.id} style={styles.menuItem}>
                            <View style={styles.menuItemLeft}>
                                <View style={styles.menuItemIcon}>{item.icon}</View>
                                <Text style={styles.menuItemText}>{item.title}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
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
        fontSize: 24,
        fontFamily: "Inter-Bold",
        color: "#111827",
        marginLeft: 10,
    },
    menuSection: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: "Inter-SemiBold",
        color: "#111827",
        marginBottom: 12,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    menuItemLeft: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    menuItemIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#F3F4F6",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    menuItemText: {
        fontSize: 16,
        fontFamily: "Inter-Regular",
        color: "#111827",
    },
});
