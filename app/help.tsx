import React from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Linking,
} from "react-native";
import { ArrowLeft, Mail, Phone, Globe, IndianRupee } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";

export default function HelpSupportScreen() {
    const openEmail = () => Linking.openURL("mailto:support@example.com");
    const openPhone = () => Linking.openURL("tel:+911234567890");
    const openWebsite = () => Linking.openURL("https://sttribe.com");
    const openPrivacypolicy = () => Linking.openURL("https://https://www.sttribe.com/privacy_policy");

    const router = useNavigation();
    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.goBack()} style={styles.menuItemIcon}>
                    <ArrowLeft color="#111827" size={20} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Help & Support</Text>
            </View>

            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: 40 }}
            >
                {/* FAQ Section */}
                {/* <View style={styles.menuSection}>
                    <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>

                    <View style={styles.menuItem}>
                        <View style={styles.menuItemLeft}>
                            <View style={styles.menuItemIcon}>
                                <Text>❓</Text>
                            </View>
                            <Text style={styles.menuItemText}>
                                How can I reset my password?
                            </Text>
                        </View>
                    </View>

                    <View style={styles.menuItem}>
                        <View style={styles.menuItemLeft}>
                            <View style={styles.menuItemIcon}>
                                <Text>📜</Text>
                            </View>
                            <Text style={styles.menuItemText}>
                                Where can I see my transaction history?
                            </Text>
                        </View>
                    </View>
                </View> */}

                {/* Contact Section */}
                <View style={styles.menuSection}>
                    <Text style={styles.sectionTitle}>Contact Support</Text>

                    <TouchableOpacity style={styles.menuItem} onPress={openEmail}>
                        <View style={styles.menuItemLeft}>
                            <View style={styles.menuItemIcon}>
                                <Mail color="#111827" size={20} />
                            </View>
                            <Text style={styles.menuItemText}>support@sttribe.com</Text>
                        </View>
                    </TouchableOpacity>

                    {/* <TouchableOpacity style={styles.menuItem} onPress={openPhone}>
                        <View style={styles.menuItemLeft}>
                            <View style={styles.menuItemIcon}>
                                <Phone color="#111827" size={20} />
                            </View>
                            <Text style={styles.menuItemText}>+91 1234567890</Text>
                        </View>
                    </TouchableOpacity> */}

                    <TouchableOpacity style={styles.menuItem} onPress={openWebsite}>
                        <View style={styles.menuItemLeft}>
                            <View style={styles.menuItemIcon}>
                                <Globe color="#111827" size={20} />
                            </View>
                            <Text style={styles.menuItemText}>www.sttribe.com</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Quick Links */}
                <View style={styles.menuSection}>
                    <Text style={styles.sectionTitle}>Quick Links</Text>

                    <TouchableOpacity style={styles.menuItem} onPress={openWebsite}>
                        <View style={styles.menuItemLeft}>
                            <View style={styles.menuItemIcon}>
                                <Text>📄</Text>
                            </View>
                            <Text style={styles.menuItemText}>Privacy Policy</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem} onPress={openWebsite}>
                        <View style={styles.menuItemLeft}>
                            <View style={styles.menuItemIcon}>
                                <IndianRupee color="#111827" size={20} />
                            </View>
                            <Text style={styles.menuItemText}>Refund Policy</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem} onPress={openWebsite}>
                        <View style={styles.menuItemLeft}>
                            <View style={styles.menuItemIcon}>
                                <Text>📄</Text>
                            </View>
                            <Text style={styles.menuItemText}>Terms & Conditions</Text>
                        </View>
                    </TouchableOpacity>
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
        // width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
    },
    menuItemText: {
        fontSize: 16,
        fontFamily: "Inter-Regular",
        color: "#111827",
        marginLeft: 10
    },
});
