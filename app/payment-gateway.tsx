import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ArrowLeft, CreditCard, Smartphone, Building, Shield, CircleCheck as CheckCircle, IndianRupee, Wallet } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function PaymentGatewayScreen() {
  const router = useNavigation();
  const route = useRoute();
  const { amount, type, groupId, description } = (route.params);
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [processing, setProcessing] = useState(false);

  const paymentMethods = [
    {
      id: 'upi',
      name: 'UPI',
      icon: Smartphone,
      description: 'Pay using UPI ID or QR code',
      color: '#10B981',
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'Visa, Mastercard, RuPay',
      color: '#3B82F6',
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: Building,
      description: 'All major banks supported',
      color: '#8B5CF6',
    },
    {
      id: 'wallet',
      name: 'Digital Wallet',
      icon: Wallet,
      description: 'Paytm, PhonePe, Google Pay',
      color: '#F59E0B',
    },
  ];

  const handlePayment = async () => {
    if (selectedMethod === 'upi' && !upiId.trim()) {
      Alert.alert('Error', 'Please enter your UPI ID');
      return;
    }

    if (selectedMethod === 'card') {
      if (!cardNumber.trim() || !expiryDate.trim() || !cvv.trim() || !cardName.trim()) {
        Alert.alert('Error', 'Please fill all card details');
        return;
      }
    }

    setProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      Alert.alert(
        'Payment Successful!',
        `₹${amount} has been paid successfully.`,
        [
          {
            text: 'OK',
            onPress: () => {
              if (groupId) {
                router.navigate(`GroupDetails?id=${groupId}`);
              } else {
                router.goBack();
              }
            }
          }
        ]
      );
    }, 3000);
  };

  const renderUPIForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>Enter UPI Details</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>UPI ID</Text>
        <TextInput
          style={styles.input}
          placeholder="yourname@upi"
          value={upiId}
          onChangeText={setUpiId}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
    </View>
  );

  const renderCardForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>Enter Card Details</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Card Number</Text>
        <TextInput
          style={styles.input}
          placeholder="1234 5678 9012 3456"
          value={cardNumber}
          onChangeText={setCardNumber}
          keyboardType="numeric"
          maxLength={19}
        />
      </View>
      <View style={styles.rowContainer}>
        <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.inputLabel}>Expiry Date</Text>
          <TextInput
            style={styles.input}
            placeholder="MM/YY"
            value={expiryDate}
            onChangeText={setExpiryDate}
            keyboardType="numeric"
            maxLength={5}
          />
        </View>
        <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
          <Text style={styles.inputLabel}>CVV</Text>
          <TextInput
            style={styles.input}
            placeholder="123"
            value={cvv}
            onChangeText={setCvv}
            keyboardType="numeric"
            maxLength={3}
            secureTextEntry
          />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Cardholder Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Name on card"
          value={cardName}
          onChangeText={setCardName}
          autoCapitalize="words"
        />
      </View>
    </View>
  );

  const renderNetBankingForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>Select Your Bank</Text>
      <View style={styles.bankGrid}>
        {['SBI', 'HDFC', 'ICICI', 'Axis', 'Kotak', 'PNB'].map((bank) => (
          <TouchableOpacity key={bank} style={styles.bankButton}>
            <Text style={styles.bankButtonText}>{bank}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderWalletForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>Select Wallet</Text>
      <View style={styles.walletGrid}>
        {['Paytm', 'PhonePe', 'Google Pay', 'Amazon Pay'].map((wallet) => (
          <TouchableOpacity key={wallet} style={styles.walletButton}>
            <Text style={styles.walletButtonText}>{wallet}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Payment</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Payment Summary */}
        <View style={styles.summaryCard}>
          <LinearGradient
            colors={['#8B5CF6', '#A78BFA']}
            style={styles.summaryGradient}
          >
            <Text style={styles.summaryTitle}>Payment Summary</Text>
            <View style={styles.summaryAmount}>
              <IndianRupee size={24} color="#FFFFFF" />
              <Text style={styles.summaryAmountText}>₹{amount}</Text>
            </View>
            <Text style={styles.summaryDescription}>
              {description || `Payment for ${type || 'service'}`}
            </Text>
          </LinearGradient>
        </View>

        {/* Payment Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Payment Method</Text>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.methodCard,
                selectedMethod === method.id && styles.methodCardSelected
              ]}
              onPress={() => setSelectedMethod(method.id)}
            >
              <View style={styles.methodLeft}>
                <View style={[styles.methodIcon, { backgroundColor: method.color + '20' }]}>
                  <method.icon size={24} color={method.color} />
                </View>
                <View style={styles.methodInfo}>
                  <Text style={styles.methodName}>{method.name}</Text>
                  <Text style={styles.methodDescription}>{method.description}</Text>
                </View>
              </View>
              {selectedMethod === method.id && (
                <CheckCircle size={24} color="#10B981" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Payment Form */}
        {selectedMethod === 'upi' && renderUPIForm()}
        {selectedMethod === 'card' && renderCardForm()}
        {selectedMethod === 'netbanking' && renderNetBankingForm()}
        {selectedMethod === 'wallet' && renderWalletForm()}

        {/* Security Notice */}
        <View style={styles.securityNotice}>
          <Shield size={20} color="#10B981" />
          <Text style={styles.securityText}>
            Your payment is secured with 256-bit SSL encryption
          </Text>
        </View>

        {/* Pay Button */}
        <View style={styles.payButtonContainer}>
          <TouchableOpacity
            style={[styles.payButton, processing && styles.payButtonDisabled]}
            onPress={handlePayment}
            disabled={processing}
          >
            <LinearGradient
              colors={processing ? ['#9CA3AF', '#9CA3AF'] : ['#10B981', '#34D399']}
              style={styles.payButtonGradient}
            >
              <Text style={styles.payButtonText}>
                {processing ? 'Processing...' : `Pay ₹${amount}`}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  summaryCard: {
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  summaryGradient: {
    padding: 24,
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  summaryAmount: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryAmountText: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  summaryDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 16,
  },
  methodCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  methodCardSelected: {
    borderColor: '#10B981',
  },
  methodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  methodIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  methodInfo: {
    flex: 1,
  },
  methodName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  methodDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  formContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  rowContainer: {
    flexDirection: 'row',
  },
  bankGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  bankButton: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  bankButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  walletGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  walletButton: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  walletButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  securityText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginLeft: 8,
  },
  payButtonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  payButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  payButtonDisabled: {
    opacity: 0.7,
  },
  payButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  payButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
});