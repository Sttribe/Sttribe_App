import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  Smartphone,
  Tv,
  Zap,
  CreditCard,
  Search,
  Clock,
  Star,
  Percent,
  Gift,
  IndianRupee,
  Car,
  Wifi,
  Droplets,
  Flame,
  Building,
  Gamepad2,
  Music,
  BookOpen,
  Wallet,
  User
} from 'lucide-react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import RazorpayCheckout from 'react-native-razorpay';
import auth from '@react-native-firebase/auth';

export default function RechargeScreen() {
  const [selectedCategory, setSelectedCategory] = useState('Mobile');
  const [mobileNumber, setMobileNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const router = useNavigation();
  const [selectedOperator, setSelectedOperator] = useState(null);
  const [circle, setCircle] = useState(null);
  const [operators, setOperators] = useState([]);
  const [circles, setCircles] = useState([]);
  const [ottPlatforms, setOttPlatforms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOTTPlan, setSelectedOTTPlan] = useState(null);
  const [ottSubscriberId, setOttSubscriberId] = useState("");

  const categories = [
    { id: 'Mobile', label: 'Mobile', icon: Smartphone, color: '#3B82F6' },
    { id: 'OTT', label: 'OTT', icon: CreditCard, color: '#EF4444' },
  ];

  const quickAmounts = [199, 299, 399, 499, 699, 999];

  const recentRecharges = [
    { number: '9876543210', amount: 399, operator: 'Airtel', date: '2 days ago', type: 'Mobile' },
    { number: '8765432109', amount: 699, operator: 'Jio', date: '1 week ago', type: 'Mobile' },
    { number: 'DL01AB1234', amount: 500, operator: 'FASTag', date: '3 days ago', type: 'FASTag' },
    { number: '1234567890', amount: 1200, operator: 'BSES', date: '1 week ago', type: 'Electricity' },
  ];

  const fetchData = async () => {
    try {
      setLoading(true);

      const operatorsRes = await axios.get("https://api-s2onatgxwq-uc.a.run.app/api/recharge/operators/mobile");
      const circlesRes = await axios.get("https://api-s2onatgxwq-uc.a.run.app/api/recharge/circles/mobile");
      const rechargeRes = await axios.get("https://api-s2onatgxwq-uc.a.run.app/api/recharge-plans");

      console.log("rechargeRes: ", rechargeRes.data);
      setOttPlatforms(rechargeRes.data.plans || []);

      const formattedOperators = operatorsRes.data.operators.map(item => ({
        label: item.OperatorName,
        value: item.OperatorCode,
      }));

      const formattedCircles = circlesRes.data.circles.map(item => ({
        label: item.circlename,
        value: item.circlecode,
      }));

      setOperators(formattedOperators);
      console.log("Formatted Operators: ", formattedOperators);
      setCircles(formattedCircles);
      console.log("formatted Circle: ", formattedCircles);
    } catch (error) {
      console.error("Failed to fetch operators:", error?.message || error);
      Alert.alert("Error", "Unable to fetch operators. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleOTTSubscribe = (plan) => {
    setSelectedOTTPlan(plan);
    setAmount(plan.amount?.toString());
    setSelectedCategory("OTT");

    Alert.alert(
      "Confirm Subscription",
      `Proceed with ₹${plan.amount} plan?`,
      [{ text: "Pay", onPress: handleSubmit }]
    );
  };

  const handleSubmit = async () => {
    console.log("🚀 handleSubmit started");
    console.log("📂 Selected Category:", selectedCategory);

    // ✅ Mobile Validation
    if (selectedCategory === "Mobile") {
      if (!mobileNumber || !selectedOperator || !circle || !amount) {
        console.log("❌ Validation failed - mobile fields missing");
        return Alert.alert("Error", "Please fill all mobile recharge fields");
      }
    }

    // ✅ OTT Validation
    if (selectedCategory === "OTT") {
      if (!ottSubscriberId || !selectedOTTPlan || !selectedOperator || !amount) {
        console.log("❌ Validation failed - OTT fields missing");
        return Alert.alert("Error", "Please fill all OTT recharge fields");
      }
    }

    const currentUser = auth().currentUser;
    if (!currentUser) {
      console.log("❌ No firebase user");
      return Alert.alert("Error", "You must be logged in");
    }

    const token = await currentUser.getIdToken();
    const userId = currentUser.uid;
    const serviceType = selectedCategory.toLowerCase();
    const subscriberId = selectedCategory === "OTT" ? ottSubscriberId : mobileNumber;
    const planId = selectedOTTPlan?.id || selectedOTTPlan?._id;

    console.log("🪪 Firebase Token:", token);
    console.log("👤 User:", userId);
    console.log("📞 Subscriber:", subscriberId);
    console.log("🧾 Plan ID:", planId);

    const payload = {
      memberId: userId,
      amount,
      serviceType,
      operator: selectedOperator,
      circle,
      number: subscriberId,
      accountNumber: subscriberId,
      planId,
    };

    try {
      console.log("📡 Creating Order...", payload);

      const orderRes = await axios.post(
        "https://api-s2onatgxwq-uc.a.run.app/api/recharge-payment",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("✅ Order Response:", orderRes.data);

      const order = orderRes.data;
      if (!order.orderId) {
        console.log("❌ Order creation failed");
        return Alert.alert("Error", "Order creation failed");
      }

      const options = {
        key: "rzp_live_RPrSOy1pADkWRe",
        amount: order.amount,
        currency: order.currency,
        name: "Sttribe - Ebirtts Technologies Pvt Ltd",
        description: `Recharge: ${serviceType}`,
        order_id: order.orderId,
        prefill: {
          email: currentUser.email || "",
          contact: mobileNumber || "",
        },
        theme: { color: "#6366f1" },
      };

      console.log("⚡ Opening Razorpay Checkout...", options);

      RazorpayCheckout.open(options)
        .then(async (paymentData) => {
          console.log("✅ Razorpay success:", paymentData);
          Alert.alert("✅ Payment Success", "Verifying payment...");

          try {
            console.log("📡 Verifying Payment...");
            const verifyRes = await axios.post(
              "https://api-s2onatgxwq-uc.a.run.app/api/recharge/razorpay/verify-payment",
              {
                razorpay_order_id: order.orderId,
                razorpay_payment_id: paymentData.razorpay_payment_id,
                razorpay_signature: paymentData.razorpay_signature,
                amount: (order.amount / 100).toFixed(2),
                userId,
                number: subscriberId,
                subscriptionId: subscriberId,
                planId,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log("✅ Payment Verified:", verifyRes.data);

            const rechargeEndpoint =
              serviceType === "mobile"
                ? "https://api-s2onatgxwq-uc.a.run.app/api/mobile-recharge"
                : "https://api-s2onatgxwq-uc.a.run.app/api/recharge";

            const rechargeBody =
              serviceType === "mobile"
                ? { userId, number: subscriberId, circle, operator: selectedOperator, amount, paymentId: verifyRes.data.paymentId }
                : { userId, amount, account: subscriberId, number: subscriberId, operator: selectedOperator, otherValue: serviceType, planId, paymentId: verifyRes.data.paymentId };

            console.log("📡 Processing Recharge...", rechargeBody);

            const rechargeRes = await axios.post(rechargeEndpoint, rechargeBody, {
              headers: { Authorization: `Bearer ${token}` }
            });

            console.log("✅ Recharge Response:", rechargeRes.data);

            if (rechargeRes.data.success) {
              console.log("🎉 Recharge Successful");
              Alert.alert("✅ Success", "Recharge Successful!");
            } else {
              console.log("⚠️ Recharge Failed:", rechargeRes.data);
              Alert.alert("❌ Failed", rechargeRes.data.message || "Recharge Failed");
            }
          } catch (verifyErr) {
            console.log("🚨 Payment Verify Error:", verifyErr.response?.data || verifyErr);
            Alert.alert("❌ Error", "Payment Verification Failed");
          }
        })
        .catch((fail) => {
          console.log("🚨 Razorpay Cancel/Error:", fail);
          Alert.alert("❌ Payment Cancelled", fail.description || "Payment Cancelled");
        });

    } catch (err) {
      console.log("🚨 MAIN CATCH ERROR:", err.response?.data || err);
      Alert.alert("Error", err.response?.data?.message || "Something went wrong");
    }
  };



  // const offers = [
  //   { title: 'Flat ₹50 OFF', subtitle: 'On recharges above ₹500', code: 'SAVE50' },
  //   { title: '10% Cashback', subtitle: 'Up to ₹100 on OTT subscriptions', code: 'OTT10' },
  //   { title: 'FASTag Bonus', subtitle: '₹25 cashback on first FASTag recharge', code: 'FASTAG25' },
  // ];

  const filteredCategories = categories.filter(category =>
    category.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderMobileRecharge = () => (
    <View style={styles.categoryContent}>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Select Operator</Text>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={operators}
          labelField="label"
          valueField="value"
          placeholder="Choose your operator"
          value={selectedOperator}
          onChange={item => setSelectedOperator(item.value)}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Select Circle</Text>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={circles}
          labelField="label"
          valueField="value"
          placeholder="Choose your circle"
          value={circle}
          onChange={item => setCircle(item.value)}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Mobile Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter mobile number"
          placeholderTextColor="#8A8A8A"   // subtle professional grey
          value={mobileNumber}
          onChangeText={setMobileNumber}
          keyboardType="phone-pad"
          maxLength={10}
        />
      </View>

      <View style={styles.quickAmounts}>
        <Text style={styles.sectionTitle}>Quick Amounts</Text>
        <View style={styles.amountGrid}>
          {quickAmounts.map((amt) => (
            <TouchableOpacity
              key={amt}
              style={[styles.amountButton, amount === amt.toString() && styles.amountButtonSelected]}
              onPress={() => setAmount(amt.toString())}
            >
              <IndianRupee size={14} color={amount === amt.toString() ? '#FFFFFF' : '#6B7280'} />
              <Text style={[styles.amountText, amount === amt.toString() && styles.amountTextSelected]}>
                {amt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Custom Amount</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter amount"
          placeholderTextColor="#8A8A8A"   // subtle professional grey
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />
      </View>

      <TouchableOpacity style={styles.rechargeButton} onPress={handleSubmit}>
        <LinearGradient
          colors={['#8B5CF6', '#A78BFA']}
          style={styles.rechargeButtonGradient}
        >
          <Text style={styles.rechargeButtonText}>Recharge Now</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const renderOTTRecharge = () => (
    <View style={styles.categoryContent}>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Subscriber ID / Registered Mobile</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter subscriber ID"
          placeholderTextColor="#8A8A8A"
          value={ottSubscriberId}
          onChangeText={setOttSubscriberId}
        />
      </View>
      {ottPlatforms?.map((platform) => (
        <View key={platform.id} style={styles.platformCard}>

          {/* Header */}
          <View style={styles.platformHeader}>
            <Image source={{ uri: platform.logo }} style={styles.platformImage} />
            <View style={styles.platformInfo}>
              <Text style={styles.platformName}>{platform.service_plan}</Text>
            </View>
          </View>

          {/* Plan card */}
          <TouchableOpacity style={styles.planCard}>
            <View style={styles.planHeader}>
              <View style={{ flex: 1 }}>
                {platform.othervalue?.split("|").map((item, index) => (
                  <Text key={index} style={styles.planName}>
                    {item.trim()}
                  </Text>
                ))}
              </View>

              <View style={styles.planPrice}>
                <Text style={[styles.planPriceText, { color: "rgb(37, 99, 235)" }]}>
                  ₹{platform.amount}
                </Text>
              </View>
            </View>

            <Text style={styles.planDuration}>{platform.duration}</Text>

            <TouchableOpacity
              style={[styles.subscribeButton, { backgroundColor: "#3B82F6" }]}
              onPress={() => handleOTTSubscribe(platform)}
            >
              {/* { backgroundColor: '#8B5CF6' } */}
              <Text style={styles.subscribeButtonText}>Subscribe</Text>
            </TouchableOpacity>
          </TouchableOpacity>

        </View>
      ))}
    </View>
  );

  const getRechargeIcon = (type) => {
    switch (type) {
      case 'Mobile': return Smartphone;
      case 'FASTag': return Car;
      case 'Electricity': return Zap;
      default: return CreditCard;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Recharge & Bills</Text>
          <TouchableOpacity onPress={() => router.navigate('Profile')} style={styles.searchButton}>
            <User size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search recharge categories..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Offers Banner */}
        {/* <View style={styles.offersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {offers.map((offer, index) => (
              <TouchableOpacity key={index} style={styles.offerCard}>
                <LinearGradient
                  colors={['#8B5CF6', '#A78BFA']}
                  style={styles.offerGradient}
                >
                  <Gift size={20} color="#FFFFFF" />
                  <Text style={styles.offerTitle}>{offer.title}</Text>
                  <Text style={styles.offerSubtitle}>{offer.subtitle}</Text>
                  <Text style={styles.offerCode}>Code: {offer.code}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View> */}

        {/* Categories */}
        <View style={styles.categoriesContainer}>
          <Text style={styles.sectionTitle}>All Categories</Text>
          <View style={styles.categoriesGrid}>
            {filteredCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryCard,
                  selectedCategory === category.id && styles.categoryCardActive,
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <View style={[
                  styles.categoryIcon,
                  { backgroundColor: selectedCategory === category.id ? category.color : category.color + '20' }
                ]}>
                  <category.icon
                    size={20}
                    color={selectedCategory === category.id ? '#FFFFFF' : category.color}
                  />
                </View>
                <Text
                  style={[
                    styles.categoryLabel,
                    selectedCategory === category.id && styles.categoryLabelActive,
                  ]}
                >
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Category Content */}
        {(selectedCategory === 'Mobile' || selectedCategory === 'DTH') && renderMobileRecharge()}
        {(selectedCategory === 'OTT' || selectedCategory === 'Gaming' || selectedCategory === 'Music' || selectedCategory === 'Education') && renderOTTRecharge()}

        {/* Recent Recharges */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Recharges</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          {recentRecharges.map((recharge, index) => {
            const IconComponent = getRechargeIcon(recharge.type);
            return (
              <TouchableOpacity key={index} style={styles.recentCard}>
                <View style={styles.recentIcon}>
                  <IconComponent size={20} color="#8B5CF6" />
                </View>
                <View style={styles.recentInfo}>
                  <Text style={styles.recentNumber}>{recharge.number}</Text>
                  <Text style={styles.recentOperator}>{recharge.operator} • {recharge.type}</Text>
                </View>
                <View style={styles.recentDetails}>
                  <Text style={styles.recentAmount}>₹{recharge.amount}</Text>
                  <Text style={styles.recentDate}>{recharge.date}</Text>
                </View>
                <Clock size={16} color="#9CA3AF" />
              </TouchableOpacity>
            );
          })}
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
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  searchButton: {
    padding: 8,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
  },
  offersContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  offerCard: {
    width: 280,
    marginRight: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  offerGradient: {
    padding: 16,
    alignItems: 'center',
  },
  offerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginTop: 8,
  },
  offerSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    marginTop: 4,
    textAlign: 'center',
  },
  offerCode: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginTop: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    marginVertical: 20,
  },
  categoryCard: {
    width: '23%',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  categoryCardActive: {
    backgroundColor: '#F3F4F6',
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textAlign: 'center',
  },
  categoryLabelActive: {
    color: '#111827',
  },
  categoryContent: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    marginBottom: 8,
  },
  dropdown: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  placeholderStyle: {
    fontSize: 14,
    color: '#8A8A8A',
  },
  selectedTextStyle: {
    fontSize: 14,
    fontWeight: '500',
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
  quickAmounts: {
    marginBottom: 20,
  },
  amountGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  amountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginRight: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  amountButtonSelected: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  amountText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginLeft: 4,
  },
  amountTextSelected: {
    color: '#FFFFFF',
  },
  rechargeButton: {
    marginTop: 20,
  },
  rechargeButtonGradient: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  rechargeButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  platformCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  platformHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  platformImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  platformInfo: {
    flex: 1,
  },
  platformName: {
    fontSize: 20,
    fontWeight: "600",
    color: '#111827',
  },
  offerBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  offerText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  plansContainer: {
    padding: 16,
  },
  planCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  planName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#111827',
  },
  planPrice: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  planPriceText: {
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 4,
  },
  planDuration: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 12,
  },
  planFeatures: {
    marginBottom: 16,
  },
  planFeature: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 4,
  },
  subscribeButton: {
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  subscribeButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  seeAll: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#8B5CF6',
  },
  recentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  recentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8B5CF6' + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  recentInfo: {
    flex: 1,
  },
  recentNumber: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  recentOperator: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  recentDetails: {
    alignItems: 'flex-end',
    marginRight: 12,
  },
  recentAmount: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#059669',
  },
  recentDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
});