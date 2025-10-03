// RefundPolicyScreen.tsx
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft } from "lucide-react-native";
import React from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";

const RefundPolicyScreen = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            {/* Header with back button */}
            <View style={{ flexDirection: "row", gap: 20, alignItems: "center" }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeft size={26} color="#111827" />
                </TouchableOpacity>
                <View style={{justifyContent:'center'}}>
                    <Text style={styles.title}>Cancellation & Refund Policy</Text>
                    <Text style={styles.subTitle}>
                        Sttribe - Ebirtts Technologies Private Limited
                    </Text>
                </View>
            </View>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.sectionText}>
                    This Cancellation and Refund Policy outlines the terms and conditions
                    for cancellations and refunds for services provided by Sttribe,
                    operated by Ebirtts Technologies Private Limited.
                </Text>

                {/* Sections */}
                <Text style={styles.sectionHeader}>1. General Policy</Text>
                <Text style={styles.sectionText}>
                    We strive to provide excellent service to all our users. However, we
                    understand that there may be circumstances where you need to cancel
                    your subscription or request a refund. This policy explains how we
                    handle such requests.
                </Text>

                <Text style={styles.sectionHeader}>2. Subscription Cancellation</Text>
                <Text style={styles.sectionText}>
                    • Users can cancel their subscription at any time through their
                    account dashboard{"\n"}
                    • Cancellation will be effective at the end of the current billing
                    cycle{"\n"}
                    • No partial refunds will be provided for unused portions of the
                    current billing period{"\n"}
                    • Access to shared subscriptions will continue until the end of the
                    paid period
                </Text>

                <Text style={styles.sectionHeader}>3. Refund Eligibility</Text>
                <Text style={styles.sectionText}>
                    Refunds may be considered in the following circumstances:{"\n"}
                    • Service Disruption: Significant service outages lasting more than 72
                    consecutive hours{"\n"}
                    • Technical Issues: Persistent technical problems that prevent normal
                    use of the service{"\n"}
                    • Billing Errors: Incorrect charges or duplicate payments{"\n"}
                    • Fraudulent Activity: Unauthorized charges to your account
                </Text>

                <Text style={styles.sectionHeader}>4. Non-Refundable Services</Text>
                <Text style={styles.sectionText}>
                    The following are generally non-refundable:{"\n"}
                    • Partial subscription periods{"\n"}
                    • Platform fees and transaction charges{"\n"}
                    • Third-party subscription costs that have already been processed{"\n"}
                    • Services used for more than 30 days without complaint
                </Text>

                <Text style={styles.sectionHeader}>5. Refund Request Process</Text>
                <Text style={styles.sectionText}>
                    To request a refund:{"\n"}
                    • Contact our support team at support@sttribe.com{"\n"}
                    • Provide your account details and reason for the refund request{"\n"}
                    • Include any relevant documentation or evidence{"\n"}
                    • Our team will review your request within 5-7 business days{"\n"}
                    • You will be notified of the decision via email
                </Text>

                <Text style={styles.sectionHeader}>6. Refund Processing Time</Text>
                <Text style={styles.sectionText}>
                    Once a refund is approved:{"\n"}
                    • Credit card refunds: 5-10 business days{"\n"}
                    • Bank transfer refunds: 7-14 business days{"\n"}
                    • Digital wallet refunds: 3-5 business days{"\n"}
                    • UPI refunds: 1-3 business days
                </Text>

                <Text style={styles.sectionHeader}>7. Dispute Resolution</Text>
                <Text style={styles.sectionText}>
                    If you are not satisfied with our refund decision, you may escalate
                    the matter by:{"\n"}
                    • Requesting a review from our senior management team{"\n"}
                    • Providing additional evidence or documentation{"\n"}
                    • Seeking mediation through consumer protection forums
                </Text>

                <Text style={styles.sectionHeader}>8. Chargebacks</Text>
                <Text style={styles.sectionText}>
                    Before initiating a chargeback with your bank or credit card company,
                    please contact us directly. Chargebacks may result in account
                    suspension and additional fees. We are committed to resolving issues
                    fairly and promptly.
                </Text>

                <Text style={styles.sectionHeader}>9. Modifications to Services</Text>
                <Text style={styles.sectionText}>
                    If we make significant changes to our service that materially affect
                    your experience, we will provide advance notice and may offer refunds
                    or service credits to affected users.
                </Text>

                <Text style={styles.sectionHeader}>10. Contact Information</Text>
                <Text style={styles.sectionText}>
                    Ebirtts Technologies Private Limited{"\n"}
                    Email: support@sttribe.com{"\n"}
                    Website: https://sttribe.com{"\n"}
                    Response Time: Within 24-48 hours
                </Text>

                <Text style={styles.sectionHeader}>11. Policy Updates</Text>
                <Text style={styles.sectionText}>
                    We may update this Refund Policy from time to time. Users will be
                    notified of significant changes via email or through the platform.
                    Continued use of the service after policy changes constitutes
                    acceptance of the updated terms.
                </Text>

                <Text style={styles.footer}>Last updated: June 14, 2025</Text>
            </ScrollView>
        </View>
    );
};

export default RefundPolicyScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
        color: "#1f2937",
        marginBottom: 2,
        textAlign:'center'
    },
    subTitle: {
        fontSize: 14,
        fontWeight: "500",
        color: "#6b7280",
        marginBottom: 12,
        textAlign:'center'
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
    footer: {
        fontSize: 13,
        color: "#6b7280",
        marginTop: 20,
        marginBottom: 40,
        textAlign: "center",
    },
});
