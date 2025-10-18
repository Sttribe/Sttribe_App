// PrivacyPolicyScreen.tsx
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft } from "lucide-react-native";
import React from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";

const PrivacyPolicyScreen = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', gap: 20 }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeft />
                </TouchableOpacity>
                <View>
                    <Text style={styles.title}>Privacy Policy</Text>
                    <Text style={styles.subTitle}>
                        Sttribe - Ebirtts Technologies Private Limited
                    </Text>
                </View>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <Text style={styles.sectionText}>
                    This Privacy Policy describes how Ebirtts Technologies Private
                    Limited ("we", "us", or "our") collects, uses, and protects your
                    personal information when you use Sttribe ("the Service").
                </Text>

                {/* Sections */}
                <Text style={styles.sectionHeader}>1. Information We Collect</Text>
                <Text style={styles.sectionText}>
                    <Text style={styles.bold}>Personal Information</Text>{"\n"}
                    We collect information you provide directly to us, including:{"\n"}
                    • Name, email address, and phone number{"\n"}
                    • Profile information and preferences{"\n"}
                    • Payment information (processed securely by third-party providers){"\n"}
                    • Communications with our support team
                </Text>
                <Text style={styles.sectionText}>
                    <Text style={styles.bold}>Usage Information</Text>{"\n"}
                    We automatically collect certain information about your use of our
                    Service:{"\n"}
                    • Device information (IP address, browser type, operating system){"\n"}
                    • Usage patterns and interactions with the Service{"\n"}
                    • Log files and analytics data{"\n"}
                    • Cookies and similar tracking technologies
                </Text>

                <Text style={styles.sectionHeader}>2. How We Use Your Information</Text>
                <Text style={styles.sectionText}>
                    We use your information to:{"\n"}
                    • Provide, maintain, and improve our Service{"\n"}
                    • Process transactions and manage subscriptions{"\n"}
                    • Send you important updates and notifications{"\n"}
                    • Provide customer support and respond to inquiries{"\n"}
                    • Detect and prevent fraud or security issues{"\n"}
                    • Comply with legal obligations{"\n"}
                    • Conduct research and analytics to improve our Service
                </Text>

                <Text style={styles.sectionHeader}>
                    3. Information Sharing and Disclosure
                </Text>
                <Text style={styles.sectionText}>
                    We do not sell your personal information. We may share your
                    information in the following circumstances:{"\n\n"}
                    <Text style={styles.bold}>With Your Consent</Text>{"\n"}
                    We may share information when you give us explicit consent to do
                    so.{"\n\n"}
                    <Text style={styles.bold}>Service Providers</Text>{"\n"}
                    We work with third-party service providers who help us operate our
                    Service, including:{"\n"}
                    • Payment processors (Razorpay){"\n"}
                    • Cloud hosting providers (Firebase){"\n"}
                    • Communication services (WhatsApp API, Email services){"\n"}
                    • Analytics providers{"\n\n"}
                    <Text style={styles.bold}>Legal Requirements</Text>{"\n"}
                    We may disclose information if required by law or in response to
                    valid legal requests.
                </Text>

                <Text style={styles.sectionHeader}>4. Data Security</Text>
                <Text style={styles.sectionText}>
                    We implement appropriate security measures to protect your personal
                    information:{"\n"}
                    • Encryption of data in transit and at rest{"\n"}
                    • Regular security assessments and updates{"\n"}
                    • Access controls and authentication measures{"\n"}
                    • Secure payment processing through certified providers
                </Text>

                <Text style={styles.sectionHeader}>5. Data Retention</Text>
                <Text style={styles.sectionText}>
                    We retain your personal information for as long as necessary to
                    provide our Service and fulfill the purposes outlined in this
                    Privacy Policy. We may retain certain information for longer periods
                    as required by law or for legitimate business purposes.
                </Text>

                <Text style={styles.sectionHeader}>6. Your Rights and Choices</Text>
                <Text style={styles.sectionText}>
                    You have the following rights regarding your personal information:{"\n"}
                    • Access{"\n"}
                    • Correction{"\n"}
                    • Deletion{"\n"}
                    • Portability{"\n"}
                    • Restriction{"\n"}
                    • Objection
                </Text>

                <Text style={styles.sectionHeader}>7. Cookies and Tracking</Text>
                <Text style={styles.sectionText}>
                    We use cookies and similar technologies to improve your experience,
                    analyze usage, and provide personalized content.
                </Text>

                <Text style={styles.sectionHeader}>8. Children's Privacy</Text>
                <Text style={styles.sectionText}>
                    Our Service is not intended for children under 18. We do not
                    knowingly collect personal information from children under 18.
                </Text>

                <Text style={styles.sectionHeader}>
                    9. International Data Transfers
                </Text>
                <Text style={styles.sectionText}>
                    Your information may be transferred to and processed in countries
                    other than your own. We ensure appropriate safeguards are in place to
                    protect your personal information.
                </Text>

                <Text style={styles.sectionHeader}>10. Third-Party Links</Text>
                <Text style={styles.sectionText}>
                    Our Service may contain links to third-party websites or services.
                    We are not responsible for the privacy practices of these third
                    parties.
                </Text>

                <Text style={styles.sectionHeader}>11. Changes to This Policy</Text>
                <Text style={styles.sectionText}>
                    We may update this Privacy Policy from time to time. We will notify
                    you of any material changes by posting the updated policy on our
                    website and sending an email notification.
                </Text>

                <Text style={styles.sectionHeader}>12. Contact Us</Text>
                <Text style={styles.sectionText}>
                    Ebirtts Technologies Private Limited{"\n"}
                    Email: privacy@sttribe.com{"\n"}
                    Support: support@sttribe.com{"\n"}
                    Website: https://sttribe.com
                </Text>

                <Text style={styles.sectionHeader}>13. Governing Law</Text>
                <Text style={styles.sectionText}>
                    This Privacy Policy is governed by the laws of India. Any disputes
                    shall be subject to the jurisdiction of courts in Bangalore,
                    Karnataka, India.
                </Text>

                <Text style={styles.footer}>Last updated: June 14, 2025</Text>
            </ScrollView>
        </View>
    );
};

export default PrivacyPolicyScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: "700",
        color: "#1f2937",
        marginBottom: 4,
        textAlign: "center",
    },
    subTitle: {
        fontSize: 16,
        fontWeight: "500",
        color: "#6b7280",
        marginBottom: 12,
        textAlign: "center",
    },
    scrollView: {
        marginTop: 10,
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: "600",
        color: "#111827",
        marginTop: 16,
        marginBottom: 6,
    },
    sectionText: {
        fontSize: 15,
        lineHeight: 22,
        color: "#374151",
        marginBottom: 10,
    },
    bold: {
        fontWeight: "600",
        color: "#111827",
    },
    footer: {
        fontSize: 13,
        color: "#6b7280",
        marginTop: 20,
        marginBottom: 40,
        textAlign: "center",
    },
});
