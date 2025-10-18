import React, { useCallback, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import axios from 'axios';

const TransactionsScreen = () => {
    const router = useNavigation();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);

    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                try {
                    setLoading(true); // start loading
                    const currentUser = auth().currentUser;
                    if (!currentUser) {
                        console.log("User not logged in");
                        Alert.alert('Error', 'User not logged in');
                        setLoading(false);
                        return;
                    }

                    const idToken = await currentUser.getIdToken();
                    const { data } = await axios.get(
                        "https://api-s2onatgxwq-uc.a.run.app/api/subscriptions",
                        { headers: { Authorization: `Bearer ${idToken}` } }
                    );

                    console.log("data: ", data);

                    const currentUserId = currentUser.uid;

                    // Flatten payments from all subscriptions for this user
                    const allUserPayments = data
                        .flatMap(sub => sub.payments || [])
                        .filter(payment => payment.userId === currentUserId);

                    setTransactions(allUserPayments);
                    setLoading(false); // stop loading

                } catch (error) {
                    console.error("Error fetching subscriptions:", error);
                    setLoading(false); // stop loading
                }
            };

            fetchData();
        }, [])
    );

    const sortedTransactions = transactions.sort((a, b) => {
        const dateA = a.createdAt?._seconds || 0;
        const dateB = b.createdAt?._seconds || 0;
        return dateB - dateA; // ascending
    });
    const renderItem = ({ item }) => (
        <View style={styles.transactionCard}>
            <View style={styles.rowBetween}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.transactionLabel} numberOfLines={2}>
                        Payment for Subscription
                    </Text>
                    <Text style={styles.transactionDate}>
                        {item.createdAt?._seconds
                            ? new Date(item.createdAt._seconds * 1000).toLocaleString()
                            : 'N/A'}
                    </Text>
                    <Text style={styles.fee}>
                        Status: {item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : 'N/A'}
                    </Text>
                </View>
                <Text style={[
                    styles.transactionAmount,
                    styles.debit
                ]}>
                    ₹{parseFloat(item.amount).toFixed(2)}
                </Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
            <View style={styles.header}>
                <TouchableOpacity style={{ marginRight: 10 }} onPress={() => router.goBack()}>
                    <ArrowLeft size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Transactions</Text>
            </View>

            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
                    <ActivityIndicator size="large" color="#2563EB" />
                    <Text style={{ marginTop: 10 }}>Loading transactions...</Text>
                </View>
            ) : (
                <FlatList
                    contentContainerStyle={styles.container}
                    data={sortedTransactions}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>No transactions found</Text>}
                />
            )}
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
    transactionDate: {
        color: '#6B7280',
        fontSize: 12,
        marginBottom: 4,
    },
    fee: {
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
