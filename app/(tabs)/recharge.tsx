import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Image,
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
  Wallet
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

export default function RechargeScreen() {
  const [selectedCategory, setSelectedCategory] = useState('Mobile');
  const [mobileNumber, setMobileNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const router = useNavigation();

  const categories = [
    { id: 'Mobile', label: 'Mobile', icon: Smartphone, color: '#3B82F6' },
    { id: 'DTH', label: 'DTH/TV', icon: Tv, color: '#8B5CF6' },
    { id: 'Electricity', label: 'Electricity', icon: Zap, color: '#F59E0B' },
    { id: 'OTT', label: 'OTT', icon: CreditCard, color: '#EF4444' },
    { id: 'FASTag', label: 'FASTag', icon: Car, color: '#10B981' },
    { id: 'Broadband', label: 'Broadband', icon: Wifi, color: '#6366F1' },
    { id: 'Water', label: 'Water', icon: Droplets, color: '#06B6D4' },
    { id: 'Gas', label: 'Gas', icon: Flame, color: '#F97316' },
    { id: 'Insurance', label: 'Insurance', icon: Building, color: '#84CC16' },
    { id: 'Gaming', label: 'Gaming', icon: Gamepad2, color: '#EC4899' },
    { id: 'Music', label: 'Music', icon: Music, color: '#8B5CF6' },
    { id: 'Education', label: 'Education', icon: BookOpen, color: '#059669' },
  ];

  const quickAmounts = [199, 299, 399, 499, 699, 999];

  const otterPlatforms = [
    {
      id: 1,
      name: 'Netflix',
      plans: [
        { name: 'Mobile', price: 149, duration: '1 Month', features: ['480p', '1 Screen', 'Mobile Only'] },
        { name: 'Basic', price: 199, duration: '1 Month', features: ['720p', '1 Screen', 'All Devices'] },
        { name: 'Standard', price: 499, duration: '1 Month', features: ['1080p', '2 Screens', 'All Devices'] },
        { name: 'Premium', price: 649, duration: '1 Month', features: ['4K+HDR', '4 Screens', 'All Devices'] },
      ],
      image: 'https://images.pexels.com/photos/4009402/pexels-photo-4009402.jpeg?auto=compress&cs=tinysrgb&w=200',
      color: '#E50914',
      offer: '30% OFF',
    },
    {
      id: 2,
      name: 'Disney+ Hotstar',
      plans: [
        { name: 'Mobile', price: 499, duration: '1 Year', features: ['HD', '1 Screen', 'Mobile Only'] },
        { name: 'Super', price: 899, duration: '1 Year', features: ['FHD', '2 Screens', 'All Devices'] },
        { name: 'Premium', price: 1499, duration: '1 Year', features: ['4K', '4 Screens', 'All Devices'] },
      ],
      image: 'https://images.pexels.com/photos/7991669/pexels-photo-7991669.jpeg?auto=compress&cs=tinysrgb&w=200',
      color: '#1E40AF',
      offer: 'Buy 1 Get 1',
    },
    {
      id: 3,
      name: 'Amazon Prime',
      plans: [
        { name: 'Monthly', price: 179, duration: '1 Month', features: ['FHD', 'Multiple Screens', 'Prime Benefits'] },
        { name: 'Quarterly', price: 459, duration: '3 Months', features: ['FHD', 'Multiple Screens', 'Prime Benefits'] },
        { name: 'Annual', price: 1499, duration: '1 Year', features: ['FHD', 'Multiple Screens', 'Prime Benefits'] },
      ],
      image: 'https://images.pexels.com/photos/3944091/pexels-photo-3944091.jpeg?auto=compress&cs=tinysrgb&w=200',
      color: '#00A8E1',
      offer: '20% Cashback',
    },
    {
      id: 4,
      name: 'Spotify',
      plans: [
        { name: 'Individual', price: 119, duration: '1 Month', features: ['Ad-free music', 'Offline downloads', 'Unlimited skips'] },
        { name: 'Duo', price: 149, duration: '1 Month', features: ['2 accounts', 'Ad-free music', 'Offline downloads'] },
        { name: 'Family', price: 179, duration: '1 Month', features: ['6 accounts', 'Ad-free music', 'Offline downloads'] },
      ],
      image: 'https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=200',
      color: '#1DB954',
      offer: '3 Months Free',
    },
  ];

  const recentRecharges = [
    { number: '9876543210', amount: 399, operator: 'Airtel', date: '2 days ago', type: 'Mobile' },
    { number: '8765432109', amount: 699, operator: 'Jio', date: '1 week ago', type: 'Mobile' },
    { number: 'DL01AB1234', amount: 500, operator: 'FASTag', date: '3 days ago', type: 'FASTag' },
    { number: '1234567890', amount: 1200, operator: 'BSES', date: '1 week ago', type: 'Electricity' },
  ];

  const offers = [
    { title: 'Flat ₹50 OFF', subtitle: 'On recharges above ₹500', code: 'SAVE50' },
    { title: '10% Cashback', subtitle: 'Up to ₹100 on OTT subscriptions', code: 'OTT10' },
    { title: 'FASTag Bonus', subtitle: '₹25 cashback on first FASTag recharge', code: 'FASTAG25' },
  ];

  const filteredCategories = categories.filter(category =>
    category.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderMobileRecharge = () => (
    <View style={styles.categoryContent}>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Mobile Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter mobile number"
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
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />
      </View>

      <TouchableOpacity style={styles.rechargeButton}>
        <LinearGradient
          colors={['#8B5CF6', '#A78BFA']}
          style={styles.rechargeButtonGradient}
        >
          <Text style={styles.rechargeButtonText}>Recharge Now</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const renderFASTagRecharge = () => (
    <View style={styles.categoryContent}>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Vehicle Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter vehicle number (e.g., DL01AB1234)"
          value={mobileNumber}
          onChangeText={setMobileNumber}
          autoCapitalize="characters"
        />
      </View>

      <View style={styles.quickAmounts}>
        <Text style={styles.sectionTitle}>Quick Amounts</Text>
        <View style={styles.amountGrid}>
          {[200, 500, 1000, 2000, 5000].map((amt) => (
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
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />
      </View>

      <TouchableOpacity style={styles.rechargeButton}>
        <LinearGradient
          colors={['#10B981', '#34D399']}
          style={styles.rechargeButtonGradient}
        >
          <Text style={styles.rechargeButtonText}>Recharge FASTag</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const renderUtilityBill = () => (
    <View style={styles.categoryContent}>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Consumer Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter consumer number"
          value={mobileNumber}
          onChangeText={setMobileNumber}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Amount</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter bill amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />
      </View>

      <TouchableOpacity style={styles.rechargeButton}>
        <LinearGradient
          colors={['#F59E0B', '#FBBF24']}
          style={styles.rechargeButtonGradient}
        >
          <Text style={styles.rechargeButtonText}>Pay Bill</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const renderOTTRecharge = () => (
    <View style={styles.categoryContent}>
      {otterPlatforms.map((platform) => (
        <View key={platform.id} style={styles.platformCard}>
          <View style={styles.platformHeader}>
            <Image source={{ uri: platform.image }} style={styles.platformImage} />
            <View style={styles.platformInfo}>
              <Text style={styles.platformName}>{platform.name}</Text>
              {platform.offer && (
                <View style={[styles.offerBadge, { backgroundColor: platform.color + '20' }]}>
                  <Text style={[styles.offerText, { color: platform.color }]}>{platform.offer}</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.plansContainer}>
            {platform.plans.map((plan, index) => (
              <TouchableOpacity key={index} style={styles.planCard}>
                <View style={styles.planHeader}>
                  <Text style={styles.planName}>{plan.name}</Text>
                  <View style={styles.planPrice}>
                    <IndianRupee size={16} color={platform.color} />
                    <Text style={[styles.planPriceText, { color: platform.color }]}>
                      {plan.price}
                    </Text>
                  </View>
                </View>
                <Text style={styles.planDuration}>{plan.duration}</Text>
                <View style={styles.planFeatures}>
                  {plan.features.map((feature, idx) => (
                    <Text key={idx} style={styles.planFeature}>• {feature}</Text>
                  ))}
                </View>
                <TouchableOpacity style={[styles.subscribeButton, { backgroundColor: platform.color }]}>
                  <Text style={styles.subscribeButtonText}>Subscribe</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
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
          <TouchableOpacity onPress={() => router.navigate('Wallet')} style={styles.searchButton}>
            <Wallet size={20} color="#6B7280" />
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
        <View style={styles.offersContainer}>
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
        </View>

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
        {selectedCategory === 'FASTag' && renderFASTagRecharge()}
        {(selectedCategory === 'Electricity' || selectedCategory === 'Water' || selectedCategory === 'Gas' || selectedCategory === 'Broadband' || selectedCategory === 'Insurance') && renderUtilityBill()}
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
    justifyContent: 'space-between',
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
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
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
    padding: 16,
    marginBottom: 12,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  planName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  planPrice: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  planPriceText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
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