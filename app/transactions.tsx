import React from 'react';
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

const TransactionsScreen = () => {
    const router = useNavigation();
    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="light-content" backgroundColor="#111827" />
            <View style={styles.header}>
                <TouchableOpacity style={{ marginRight: 10 }} onPress={() => router.goBack()}>
                    <ArrowLeft size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Transactions</Text>
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                <View>
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
                                    {/* <Text style={styles.fee}>Fee: ₹{item.fee.toFixed(2)}</Text> */}
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
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default TransactionsScreen;

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    header: {
        padding: 16,
        backgroundColor: '#FFF',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        flexDirection: 'row',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 0,
    },
    container: {
        padding: 16,
        backgroundColor: '#FFF',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 12,
    },
    transactionCard: {
        backgroundColor: '#F9FAFB',
        borderRadius: 10,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    transactionLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 6,
    },
    tag: {
        alignSelf: 'flex-start',
        backgroundColor: '#DBEAFE',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
        marginBottom: 6,
    },
    tagText: {
        color: '#2563EB',
        fontSize: 12,
    },
    transactionDate: {
        color: '#6B7280',
        fontSize: 12,
        marginBottom: 4,
    },
    fee: {
        color: '#EF4444',
        fontSize: 12,
    },
    transactionAmount: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    credit: {
        color: '#16A34A',
    },
    debit: {
        color: '#DC2626',
    },
});