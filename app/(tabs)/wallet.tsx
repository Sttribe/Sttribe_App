import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';

const WalletScreen = () => {
    const [showBalance, setShowBalance] = useState(true);
    const router = useNavigation();

    const toggleBalance = () => setShowBalance(!showBalance);

    const transactions = [
        {
            id: '1',
            type: 'Credit',
            label: 'Payment received from Netflix Family group',
            source: 'Netflix Family',
            amount: 162,
            fee: 14.58,
            date: '2024-01-15 2:30 PM',
        },
        {
            id: '2',
            type: 'Debit',
            label: 'Withdrawn to bank account',
            amount: 500,
            fee: 5.0,
            date: '2024-01-14 10:15 AM',
        },
        {
            id: '3',
            type: 'Credit',
            label: 'Payment received from Entertainment Bundle',
            source: 'Entertainment Bundle',
            amount: 458,
            fee: 41.22,
            date: '2024-01-14 3:45 PM',
        },
    ];

    const pendingPayments = [
        {
            id: '1',
            title: 'Entertainment Bundle',
            members: ['Raj Patel', 'Vikram Singh', 'Kiran Kumar'],
            due: '2024-01-20',
            amount: 458,
        },
        {
            id: '2',
            title: 'Sports Bundle',
            members: ['Amit Kumar'],
            due: '2024-01-22',
            amount: 333,
        },
    ];

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.headerButton} onPress={() => router.goBack()}>
                    <ArrowLeft size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.heading}>Wallet</Text>
            </View>

            {/* Wallet Balance */}
            <View style={styles.walletCard}>
                <View style={styles.rowBetween}>
                    <Text style={styles.label}>Wallet Balance</Text>
                    <TouchableOpacity onPress={toggleBalance}>
                        <Ionicons
                            name={showBalance ? 'eye' : 'eye-off'}
                            size={24}
                            color="black"
                        />
                    </TouchableOpacity>
                </View>
                <Text style={styles.balance}>{showBalance ? '₹23.00' : '••••••'}</Text>
            </View>

            {/* Deposit / Withdraw Buttons */}
            <View style={styles.actionRow}>
                <TouchableOpacity style={styles.actionButton}>
                    <MaterialCommunityIcons
                        name="arrow-up-bold-circle"
                        size={24}
                        color="#FF4500"
                    />
                    <Text style={styles.actionText}>Withdraw</Text>
                </TouchableOpacity>
            </View>

            {/* Recent Transactions */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Recent Transactions</Text>
                {transactions.map((item) => (
                    <View key={item.id} style={styles.transactionCard}>
                        <View style={styles.rowBetween}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.transactionLabel} numberOfLines={2}>
                                    {item.label}
                                </Text>
                                {item.source && (
                                    <View style={styles.tag}>
                                        <Text style={styles.tagText}>{item.source}</Text>
                                    </View>
                                )}
                                <Text style={styles.transactionDate}>{item.date}</Text>
                                <Text style={styles.fee}>Fee: ₹{item.fee.toFixed(2)}</Text>
                            </View>
                            <Text
                                style={[
                                    styles.transactionAmount,
                                    item.type === 'Credit' ? styles.credit : styles.debit,
                                ]}
                            >
                                {item.type === 'Credit' ? '+' : '-'}₹{item.amount.toFixed(2)}
                            </Text>
                        </View>
                    </View>
                ))}

                {/* View All Button */}
                <TouchableOpacity onPress={() => { router.navigate('Transactions') }} style={styles.viewAllButton}>
                    <Text style={styles.viewAllText}>View All Transactions</Text>
                </TouchableOpacity>
            </View>

            {/* Pending Payments */}
            {/* <View style={styles.section}>
                <Text style={styles.sectionTitle}>Pending Payments</Text>
                {pendingPayments.map((item) => (
                    <View key={item.id} style={styles.pendingCard}>
                        <View style={styles.rowBetween}>
                            <Text style={styles.pendingTitle}>{item.title}</Text>
                            <Text style={styles.dueTag}>Due {item.due}</Text>
                        </View>
                        <Text style={styles.pendingLabel}>Pending from:</Text>
                        <View style={styles.tagList}>
                            {item.members.map((name, index) => (
                                <View key={index} style={styles.memberTag}>
                                    <Text style={styles.tagText}>{name}</Text>
                                </View>
                            ))}
                        </View>
                        <View style={styles.rowBetween}>
                            <Text style={styles.pendingAmount}>₹{item.amount.toFixed(2)}</Text>
                            <TouchableOpacity style={styles.reminderButton}>
                                <Text style={styles.reminderText}>Send Reminder</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </View> */}
        </ScrollView>
    );
};

export default WalletScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        paddingTop: 40,
    },
    headerButton: {
        marginRight: 15,
        paddingTop: 5,
    },
    heading: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    walletCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        elevation: 2,
        marginBottom: 20,
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
    },
    balance: {
        fontSize: 32,
        fontWeight: 'bold',
        marginTop: 10,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 30,
    },
    actionButton: {
        flex: 0.90,
        backgroundColor: '#fff',
        paddingVertical: 16,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        flexDirection: 'row',
        gap: 10,
    },
    actionText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    section: {
        marginTop: 10,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 15,
    },
    transactionCard: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 12,
        elevation: 1,
    },
    transactionLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    transactionAmount: {
        fontSize: 16,
        fontWeight: '700',
        alignSelf: 'flex-start',
    },
    credit: {
        color: '#4CAF50',
    },
    debit: {
        color: '#FF3B30',
    },
    transactionDate: {
        fontSize: 13,
        color: '#777',
        marginTop: 4,
    },
    fee: {
        fontSize: 13,
        color: '#999',
        marginTop: 2,
    },
    tag: {
        backgroundColor: '#eee',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 20,
        alignSelf: 'flex-start',
        marginTop: 4,
    },
    tagText: {
        fontSize: 12,
        color: '#444',
    },
    viewAllButton: {
        alignSelf: 'center',
        marginTop: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: "#fff",
        borderRadius: 6,
        marginBottom: 15,
    },
    viewAllText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#007AFF',
    },
    pendingCard: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        elevation: 1,
    },
    pendingTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    dueTag: {
        backgroundColor: '#2ecc71',
        color: '#fff',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        fontSize: 12,
    },
    pendingLabel: {
        fontSize: 14,
        color: '#777',
        marginTop: 8,
    },
    tagList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        marginVertical: 8,
    },
    memberTag: {
        backgroundColor: '#eee',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
    },
    pendingAmount: {
        fontSize: 18,
        fontWeight: '600',
    },
    reminderButton: {
        borderWidth: 1,
        borderColor: '#ccc',
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 6,
    },
    reminderText: {
        fontSize: 13,
        fontWeight: '500',
    },
});
