import React, { useCallback, useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import axios from 'axios';
import auth from '@react-native-firebase/auth';

const WalletScreen = () => {
    const [showBalance, setShowBalance] = useState(true);
    const [noOfSubs, setNoOfSubs] = useState([]);
    const router = useNavigation();
    const [loading, setLoading] = useState(false);
    const toggleBalance = () => setShowBalance(!showBalance);
    const [userStats, setUserStats] = useState([]);
    const [tribeData, setTribeData] = useState([]);
    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                try {
                    const currentUser = auth().currentUser;
                    if (!currentUser) {
                        console.error("No user is logged in");
                        return;
                    }

                    const idToken = await currentUser.getIdToken();

                    const [statsRes] = await Promise.all([
                        axios.get(`https://api-s2onatgxwq-uc.a.run.app/api/dashboard/stats`, {
                            headers: { Authorization: `Bearer ${idToken}` }
                        }),
                    ])
                    setUserStats(statsRes.data);

                    // const response = await axios.get(
                    //     "https://api-s2onatgxwq-uc.a.run.app/api/subscriptions",
                    //     { headers: { Authorization: `Bearer ${idToken}` } }
                    // );

                    // // Extract tribe and payments only
                    // const filteredData = response.data.map(item => ({
                    //     tribe: item.tribe,
                    //     payments: item.payments,
                    // }));

                    // setTribeData(filteredData);

                    // console.log("Filtered tribeData:", filteredData);
                } catch (error) {
                    console.error("Error fetching ProfileScreen data:", error);
                }
            };
            fetchData();
        }, []));


    useEffect(() => {
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


                const currentUserId = currentUser.uid;

                // Flatten payments from all subscriptions for this user
                const allUserPayments = data
                    .flatMap(sub => sub.payments || [])
                    .filter(payment => payment.userId === currentUserId);

                setNoOfSubs(allUserPayments);
                console.log("data: ", allUserPayments);
                setLoading(false); // stop loading

            } catch (error) {
                console.error("Error fetching subscriptions:", error);
                setLoading(false); // stop loading
            }
        };

        fetchData();
    }, [])

    const sortedTransactions = noOfSubs.sort((a, b) => {
        const dateA = a.createdAt?._seconds || 0;
        const dateB = b.createdAt?._seconds || 0;
        return dateB - dateA; // ascending
    });
    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.heading}>Wallet</Text>
            </View>

            {/* Wallet Balance */}
            <View style={styles.walletCard}>
                {/* <View style={styles.rowBetween}> */}
                {/* <Text style={styles.label}>Your Yearly Savings with Sttribe</Text> */}
                {/* <TouchableOpacity onPress={toggleBalance}>
                        <Ionicons
                            name={showBalance ? 'eye' : 'eye-off'}
                            size={24}
                            color="black"
                        />
                    </TouchableOpacity> */}
                {/* <Text style={styles.balance}>₹{(userStats?.monthlySavings ?? 0) * 12}</Text> */}
                {/* </View> */}
                <Text style={{ textAlign: 'center', color: 'rgb(21 128 61)' }}>Save up to 60% by sharing subscriptions</Text>

                <View style={styles.rowBetween}>
                    <View>
                        <Text style={[styles.label, {}]}>Total Monthly Spend</Text>
                        <Text style={{ fontSize: 10, color:'#6B7280' }}>   *Amount shown excludes the platform fee.</Text>
                    </View>
                    {/* <TouchableOpacity onPress={toggleBalance}>
                        <Ionicons
                            name={showBalance ? 'eye' : 'eye-off'}
                            size={24}
                            color="black"
                        />
                    </TouchableOpacity> */}
                    <Text style={styles.balance}>₹{userStats?.monthlySpend}</Text>
                </View>
            </View>

            {/* Deposit / Withdraw Buttons */}
            {/* <View style={styles.actionRow}>
                <TouchableOpacity style={styles.actionButton}>
                    <MaterialCommunityIcons
                        name="arrow-up-bold-circle"
                        size={24}
                        color="#FF4500"
                    />
                    <Text style={styles.actionText}>Withdraw</Text>
                </TouchableOpacity>
            </View> */}

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Recent Transactions</Text>

                {loading ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
                        <ActivityIndicator size="large" color="#2563EB" />
                        <Text style={{ marginTop: 10 }}>Loading transactions...</Text>
                    </View>
                ) : noOfSubs.length === 0 ? (
                    <Text style={{ textAlign: 'center', marginVertical: 16 }}>No payments yet. Once you start sharing, your transactions will appear here</Text>
                ) : (
                    sortedTransactions.slice(0, 5).map((item) => (
                        <View key={item.id} style={styles.transactionCard}>
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
                                        Status: {item.status
                                            ? item.status.charAt(0).toUpperCase() + item.status.slice(1)
                                            : 'N/A'}
                                    </Text>
                                </View>
                                <Text style={[styles.transactionAmount, styles.debit]}>
                                    {'\u20B9'}{parseFloat(item.amount).toFixed(2)}
                                </Text>
                            </View>
                        </View>
                    ))
                )}
                {noOfSubs.length > 5 && (
                    <TouchableOpacity
                        onPress={() => router.navigate('Transactions')}
                        style={styles.viewAllButton}
                    >
                        <Text style={styles.viewAllText}>View All Transactions</Text>
                    </TouchableOpacity>
                )}
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
        // paddingTop: 40,
    },
    headerButton: {
        marginRight: 15,
        paddingTop: 5,
    },
    heading: {
        fontSize: 28,
        marginBottom: 20,
    },
    walletCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        paddingVertical: 40,
        elevation: 2,
        marginBottom: 20,
        gap: 20
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    label: {
        fontSize: 22,
        fontWeight: '500',
    },
    balance: {
        fontSize: 26,
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
        marginBottom: 40,
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
