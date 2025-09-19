import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    SafeAreaView,
    StatusBar,
    Platform,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const notifications = [
    {
        id: '1',
        title: 'Bonus Received',
        message: 'You received a bonus of ₹50 in your wallet.',
        date: '2025-08-08',
    },
    {
        id: '2',
        title: 'Spin Reward',
        message: 'You won ₹10 from the spin wheel.',
        date: '2025-08-07',
    },
    {
        id: '3',
        title: 'Deposit Successful',
        message: 'Your deposit of ₹500 has been credited.',
        date: '2025-08-06',
    },
];

export default function NotificationScreen() {
    const router = useNavigation();
    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <View style={styles.header}>
                <TouchableOpacity style={{ marginRight: 10 }} onPress={() => router.goBack()}>
                    <ArrowLeft size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                {notifications.map((item) => (
                    <View key={item.id} style={styles.notificationCard}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.message}>{item.message}</Text>
                        <Text style={styles.date}>{item.date}</Text>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 0,
    },
    container: {
        padding: 16,
    },
    notificationCard: {
        backgroundColor: '#F9FAFB',
        borderRadius: 10,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 6,
    },
    message: {
        fontSize: 14,
        color: '#4B5563',
        marginBottom: 4,
    },
    date: {
        fontSize: 12,
        color: '#6B7280',
    },
});