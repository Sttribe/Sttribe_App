import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    LayoutAnimation,
    Platform,
    UIManager,
    SafeAreaView
} from 'react-native';
import { ArrowLeft, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FAQ_DATA = [
    {
        question: "What is Sttribe?",
        answer: "Sttribe is a secure platform that lets you share OTT subscriptions (like Netflix, Prime Video, etc.) with friends or family and split the cost easily. Think of it as the smart way to save on streaming."
    },
    {
        question: "Is Sttribe compliant with OTT platforms?",
        answer: "Yes. Sttribe ensures compliance by working with OTT platforms directly or through mechanisms like coupon codes and partner agreements. We provide a structured, secure way of cost-sharing that benefits both users and platforms."
    },
    {
        question: "How does Sttribe work?",
        answer: "Sign up with your mobile or email.\nChoose OTT platforms you want to share.\nCreate a tribe by adding friends or family.\nPayments are collected from all members.\nOnce everyone pays, credentials are securely shared."
    },
    {
        question: "What OTT platforms does Sttribe support?",
        answer: "We currently support several major and regional OTTs like Zee5, Aha, Lionsgate Play, and more. We're adding new partners regularly."
    },
    {
        question: "What happens if someone in my tribe doesn’t pay?",
        answer: "If a beneficiary doesn’t complete payment, the tribe won’t go live. You can either replace the member or wait until the full amount is collected."
    },
    // Add more FAQs here...
];

export default function FAQScreen() {
    const [activeIndex, setActiveIndex] = useState(null);
    const navigation = useNavigation();

    const toggleExpand = (index) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <SafeAreaView style={styles.container} >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.header}>
                    <TouchableOpacity style={{ marginRight: 15, marginLeft: 5 }} onPress={() => navigation.goBack()}>
                        <ArrowLeft />
                    </TouchableOpacity>
                    <HelpCircle size={28} color="#4F46E5" />
                    <Text style={styles.title}> Frequently Asked Questions </Text>
                </View>

                {
                    FAQ_DATA.map((item, index) => (
                        <View key={index} style={styles.faqItem} >
                            <TouchableOpacity onPress={() => toggleExpand(index)} style={styles.questionContainer}>
                                <Text style={styles.questionText}>{item.question}</Text>
                                {activeIndex === index ? (
                                    <ChevronUp size={20} color="#4F46E5" />
                                ) : (
                                    <ChevronDown size={20} color="#4F46E5" />
                                )}
                            </TouchableOpacity>
                            {activeIndex === index && (
                                <View style={styles.answerContainer}>
                                    <Text style={styles.answerText}>{item.answer}</Text>
                                </View>
                            )}
                        </View>
                    ))}

                <View style={styles.footer}>
                    <Text style={styles.footerText}> Still have questions ? Contact support via email! </Text>
                </View>
            </ScrollView>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB' },
    scrollContainer: { padding: 16, marginTop: 20 },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    title: { fontSize: 22, fontWeight: 'bold', marginLeft: 8, color: '#111827' },
    faqItem: { marginBottom: 12, backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
    questionContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    questionText: { fontSize: 16, fontWeight: '600', color: '#111827', flex: 1 },
    toggleIcon: { fontSize: 22, fontWeight: '600', color: '#4F46E5', marginLeft: 12 },
    answerContainer: { marginTop: 8 },
    answerText: { fontSize: 14, color: '#4B5563', lineHeight: 20 },
    footer: { marginTop: 24, alignItems: 'center' },
    footerText: { color: '#6B7280', fontSize: 14, textAlign: 'center' },
});
