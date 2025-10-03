import React, { useCallback, useState } from 'react';
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
  KeyboardAvoidingView, Platform
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import {
  ArrowLeft,
  Users,
  IndianRupee,
  Calendar,
  Shield,
  Check,
  Plus,
  X,
  Phone,
  Mail,
  MessageSquare
} from 'lucide-react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import axios from "axios";
import auth from '@react-native-firebase/auth'
// import { API_BASE_URL } from "@env";
import CheckBox from '@react-native-community/checkbox';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';


export default function CreateGroupScreen() {
  const router = useNavigation();
  const [groupName, setGroupName] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [maxMembers, setMaxMembers] = useState('4');
  const [groupDescription, setGroupDescription] = useState('');
  const [memberContacts, setMemberContacts] = useState([{ type: 'email', value: '' }]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [skip, setSkip] = useState(false);
  const [platforms, setPlatforms] = useState([]);
  const [showAll, setShowAll] = useState(false);


  useFocusEffect(
    useCallback(() => {

      const OttfetchData = async () => {
        const currentUser = auth().currentUser;
        if (!currentUser) {
          Alert.alert("Error", "You must be logged in");
          return;
        }
        const idToken = await currentUser.getIdToken();
        const ottServicesRes = await axios.get(`https://api-s2onatgxwq-uc.a.run.app/api/ott-services`, {
          headers: { Authorization: `Bearer ${idToken}` }
        });
        setPlatforms(ottServicesRes.data);
        console.log(ottServicesRes.data);
      }
      OttfetchData();
    }, [])
  )

  const displayedPlatforms = showAll ? platforms : platforms.slice(0, 4);

  const getFAIconName = (iconClass: string) => {
    if (!iconClass) return null;
    const parts = iconClass.split(" ");
    return parts.length > 1 ? parts[1].replace("fa-", "") : null;
  };

  const contactTypes = [
    { id: 'email', label: 'Email', icon: Mail, placeholder: 'Enter email address' },
    { id: 'phone', label: 'Phone', icon: Phone, placeholder: 'Enter mobile number' },
    // { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare, placeholder: 'Enter WhatsApp number' },
  ];

  const addMemberContact = () => {
    setMemberContacts([...memberContacts, { type: 'email', value: '' }]);
  };

  const removeMemberContact = (index) => {
    if (memberContacts.length > 1) {
      const newContacts = memberContacts.filter((_, i) => i !== index);
      setMemberContacts(newContacts);
    }
  };

  const updateMemberContact = (index, field, value) => {
    const newContacts = [...memberContacts];
    newContacts[index] = { ...newContacts[index], [field]: value };
    setMemberContacts(newContacts);
  };

  const calculateCostPerMember = () => {
    if (!selectedPlatform || !selectedPlan) return 0;
    const platform = platforms.find(p => p.id === selectedPlatform);
    const plan = platform?.plans.find(p => p.id === selectedPlan);
    return plan ? Math.ceil(plan.price / parseInt(maxMembers)) : 0;
  };

  const handleCreateGroup = async () => {
    try {
      if (!groupName.trim()) {
        Alert.alert("Error", "Please enter a group name");
        return;
      }
      // if (!selectedPlatform || !selectedPlan) {
      //   Alert.alert("Error", "Please select a platform and plan");
      //   return;
      // }

      const currentUser = auth().currentUser;
      if (!currentUser) {
        Alert.alert("Error", "You must be logged in");
        return;
      }

      // 🔹 Get Firebase token
      const idToken = await currentUser.getIdToken();

      // 🔹 Build invite emails string
      const inviteEmails = memberContacts
        .filter(c => c.type === "email" && c.value.trim()) // only emails
        .map(c => c.value.trim())
        .join(",");

      // 🔹 Build request payload
      const payload = {
        name: groupName,
        description: groupDescription,
        maxMembers: parseInt(maxMembers),
        inviteEmails,
        isPrivate,
        ...(selectedPlatform && { platform: platforms.find(p => p.id === selectedPlatform)?.name }),
        ...(selectedPlan && { plan: selectedPlan }),
      };

      // 🔹 Send API request
      const res = await axios.post(`https://api-s2onatgxwq-uc.a.run.app/api/tribes`, payload, {
        headers: { Authorization: `Bearer ${idToken}` },
      });
      // console.log("Group created:", res.data);

      Alert.alert(
        "Success",
        res.data.message || "Group created successfully!",
        [{ text: "OK", onPress: () => router.goBack() }]
      );
    } catch (error) {
      console.error("Error creating group:", error);
      Alert.alert("Error", error.response?.data?.message || "Failed to create group");
    }
  };

  const getContactIcon = (type) => {
    const contactType = contactTypes.find(ct => ct.id === type);
    return contactType ? contactType.icon : Mail;
  };

  const getContactPlaceholder = (type) => {
    const contactType = contactTypes.find(ct => ct.id === type);
    return contactType ? contactType.placeholder : 'Enter contact';
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.goBack()}>
              <ArrowLeft size={24} color="#111827" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Create Group</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Step 1: Basic Info */}
          <View style={styles.section}>
            <Text style={styles.stepTitle}>Step 1: Basic Information</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Group Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Family Netflix, Friends Squad"
                value={groupName}
                onChangeText={setGroupName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Description (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe your group..."
                placeholderTextColor="#888"
                value={groupDescription}
                onChangeText={setGroupDescription}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Maximum Members</Text>
              <View style={styles.memberSelector}>
                {[2, 3, 4, 5, 6].map(num => (
                  <TouchableOpacity
                    key={num}
                    style={[
                      styles.memberButton,
                      maxMembers === num.toString() && styles.memberButtonSelected
                    ]}
                    onPress={() => setMaxMembers(num.toString())}
                  >
                    <Text style={[
                      styles.memberButtonText,
                      maxMembers === num.toString() && styles.memberButtonTextSelected
                    ]}>
                      {num}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* <TouchableOpacity
              style={styles.privacyToggle}
              onPress={() => setIsPrivate(!isPrivate)}
            >
              <View style={[styles.checkbox, isPrivate && styles.checkboxSelected]}>
                {isPrivate && <Check size={16} color="#FFFFFF" />}
              </View>
              <View style={styles.privacyInfo}>
                <Text style={styles.privacyTitle}>Private Group</Text>
                <Text style={styles.privacySubtitle}>Only invited members can join</Text>
              </View>
            </TouchableOpacity> */}
          </View>

          {/* Step 2: Platform Selection */}
          <View style={styles.section}>
            <Text style={styles.stepTitle}>Step 2: Select Platform (Optional)</Text>

            <View style={styles.platformGrid}>
              {displayedPlatforms.map(platform => {
                const faName = getFAIconName(platform.iconClass);
                return (
                  <TouchableOpacity
                    key={platform.id}
                    style={[
                      styles.platformCard,
                      selectedPlatform === platform.id && styles.platformCardSelected
                    ]}
                    onPress={() => {
                      setSelectedPlatform(platform.id);
                      setSelectedPlan(null);
                      setSkip(false);
                    }}
                  >
                    {faName && typeof faName === "string" ? (
                      <FontAwesome5
                        name={faName}
                        size={32}
                        color={platform.color}
                        style={styles.platformImage}
                      />
                    ) : (
                      <Text
                        style={[
                          styles.platformImage,
                          { color: platform.color, fontSize: 28, fontWeight: "bold" }
                        ]}
                      >
                        {platform.name?.charAt(0).toUpperCase()}
                      </Text>
                    )}
                    <Text style={styles.platformName}>{platform.name}</Text>
                    {selectedPlatform === platform.id && (
                      <View style={[styles.selectedIndicator, { backgroundColor: platform.color }]}>
                        <Check size={16} color="#FFFFFF" />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
              {platforms.length > 3 && (
                <TouchableOpacity onPress={() => setShowAll(!showAll)} style={styles.moreButton}>
                  <Text style={styles.moreButtonText}>
                    {showAll ? "Show Less" : "Show More"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Skip Button */}
            <View style={styles.checkboxContainer}>
              <CheckBox
                value={skip}
                onValueChange={(newValue) => {
                  setSkip(newValue);
                  if (newValue) {
                    // Clear selected platform/plan if checked
                    setSelectedPlatform(null);
                    setSelectedPlan(null);
                  }
                }}
                tintColors={{ true: '#8B5CF6', false: '#999' }} // customize color
              />
              <Text style={styles.skipText}>Skip for now</Text>
            </View>
          </View>

          {/* Step 3: Plan Selection */}
          {selectedPlatform && (
            <View style={styles.section}>
              <Text style={styles.stepTitle}>Step 3: Select Plan</Text>

              {platforms.find(p => p.id === selectedPlatform)?.plans.map(plan => (
                <TouchableOpacity
                  key={plan.planName}   // use API value
                  style={[
                    styles.planCard,
                    selectedPlan === plan.planName && styles.planCardSelected
                  ]}
                  onPress={() => setSelectedPlan(plan.planName)}
                >
                  <View style={styles.planInfo}>
                    <Text style={styles.planName}>{plan.planName}</Text>
                    <Text style={styles.planDetails}>
                      {plan.maxScreens} {typeof plan.maxScreens === 'number' ? 'Screen' : ''} • {plan.videoQuality}
                      {plan.duration && ` • ${plan.duration}`}
                    </Text>
                  </View>
                  <View style={styles.planPrice}>
                    <IndianRupee size={16} color="#111827" />
                    <Text style={styles.planPriceText}>{plan.price}</Text>
                    <Text style={styles.planPricePeriod}> /{plan.duration}</Text>
                  </View>
                  {selectedPlan === plan.planName && (
                    <View style={styles.planSelectedIndicator}>
                      <Check size={20} color="#8B5CF6" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Step 4: Invite Members */}
          <View style={styles.section}>
            <Text style={styles.stepTitle}>Step 4: Invite Members (Optional)</Text>
            <Text style={styles.stepSubtitle}>Invite via Email, Phone, or WhatsApp</Text>

            {memberContacts.map((contact, index) => (
              <View key={index} style={styles.contactInputContainer}>
                <View style={styles.contactTypeSelector}>
                  {contactTypes.map((type) => {
                    const IconComponent = type.icon;
                    return (
                      <TouchableOpacity
                        key={type.id}
                        style={[
                          styles.contactTypeButton,
                          contact.type === type.id && styles.contactTypeButtonSelected
                        ]}
                        onPress={() => updateMemberContact(index, 'type', type.id)}
                      >
                        <IconComponent
                          size={16}
                          color={contact.type === type.id ? "#FFFFFF" : "#6B7280"}
                        />
                      </TouchableOpacity>
                    );
                  })}
                </View>
                <TextInput
                  style={[styles.input, styles.contactInput]}
                  placeholder={getContactPlaceholder(contact.type)}
                  placeholderTextColor="#888"
                  value={contact.value}
                  onChangeText={(value) => updateMemberContact(index, 'value', value)}
                  keyboardType={contact.type === 'email' ? 'email-address' : 'phone-pad'}
                  autoCapitalize="none"
                />
                {memberContacts.length > 1 && (
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeMemberContact(index)}
                  >
                    <X size={20} color="#EF4444" />
                  </TouchableOpacity>
                )}
              </View>
            ))}

            <TouchableOpacity style={styles.addMemberButton} onPress={addMemberContact}>
              <Plus size={20} color="#8B5CF6" />
              <Text style={styles.addMemberText}>Add Another Member</Text>
            </TouchableOpacity>
          </View>

          {/* Cost Summary */}
          {/* Cost Summary */}
          {selectedPlatform && selectedPlan && (
            <View style={styles.section}>
              <View style={styles.costSummary}>
                <LinearGradient
                  colors={['#8B5CF6', '#A78BFA']}
                  style={styles.costSummaryGradient}
                >
                  <Text style={styles.costSummaryTitle}>Cost Summary</Text>

                  {(() => {
                    const platform = platforms.find(p => p.id === selectedPlatform);
                    const plan = platform?.plans.find(p => p.planName === selectedPlan);
                    if (!plan) return null;

                    // Base plan price
                    const basePrice = plan.price;
                    // Add 9% platform fee
                    const priceWithFee = Math.ceil(basePrice * 1.09);
                    // Cost per member
                    const perMember = Math.ceil(priceWithFee / parseInt(maxMembers));
                    // Savings compared to taking full plan alone
                    const savings = priceWithFee - perMember;

                    return (
                      <>
                        <View style={styles.costRow}>
                          <Text style={styles.costLabel}>Total Monthly Cost:</Text>
                          <View style={styles.costValue}>
                            <IndianRupee size={16} color="#FFFFFF" />
                            <Text style={styles.costAmount}>{basePrice}</Text>
                          </View>
                        </View>

                        <View style={styles.costRow}>
                          <Text style={styles.costLabel}>Total Monthly Cost (with 9% platform fee):</Text>
                          <View style={styles.costValue}>
                            <IndianRupee size={16} color="#FFFFFF" />
                            <Text style={styles.costAmount}>{priceWithFee}</Text>
                          </View>
                        </View>

                        <View style={styles.costRow}>
                          <Text style={styles.costLabel}>Cost per Member:</Text>
                          <View style={styles.costValue}>
                            <IndianRupee size={16} color="#FFFFFF" />
                            <Text style={styles.costAmount}>{perMember}</Text>
                          </View>
                        </View>

                        <View style={styles.costRow}>
                          <Text style={styles.costLabel}>Your Savings:</Text>
                          <View style={styles.costValue}>
                            <IndianRupee size={16} color="#FFFFFF" />
                            <Text style={styles.costAmount}>{savings}</Text>
                          </View>
                        </View>
                      </>
                    );
                  })()}
                </LinearGradient>
              </View>
            </View>
          )}


          {/* Create Group Button */}
          <View style={styles.section}>
            <TouchableOpacity style={styles.createButton} onPress={handleCreateGroup}>
              <LinearGradient
                colors={['#8B5CF6', '#A78BFA']}
                style={styles.createButtonGradient}
              >
                <Users size={20} color="#FFFFFF" />
                <Text style={styles.createButtonText}>Create Group</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView >
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
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  stepTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
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
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  memberSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  memberButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  memberButtonSelected: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  memberButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  memberButtonTextSelected: {
    color: '#FFFFFF',
  },
  privacyToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxSelected: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  privacyInfo: {
    flex: 1,
  },
  privacyTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#111827',
  },
  privacySubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  platformGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  platformCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    position: 'relative',
  },
  platformCardSelected: {
    borderColor: '#8B5CF6',
  },
  platformImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 8,
  },
  platformName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    textAlign: 'center',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreButton: {
    marginTop: 10,
    alignSelf: "center",
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#eee",
  },
  moreButtonText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 10,
  },
  skipText: {
    marginLeft: 8,
    fontSize: 16,
  },
  planCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    position: 'relative',
  },
  planCardSelected: {
    borderColor: '#8B5CF6',
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  planDetails: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 4,
  },
  planPrice: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  planPriceText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginLeft: 4,
  },
  planPricePeriod: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  planSelectedIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  contactInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactTypeSelector: {
    flexDirection: 'row',
    marginRight: 12,
  },
  contactTypeButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  contactTypeButtonSelected: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  contactInput: {
    flex: 1,
    marginRight: 12,
  },
  removeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addMemberButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#8B5CF6',
    borderStyle: 'dashed',
  },
  addMemberText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#8B5CF6',
    marginLeft: 8,
  },
  costSummary: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  costSummaryGradient: {
    padding: 20,
  },
  costSummaryTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  costLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
  },
  costValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  costAmount: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  createButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  createButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  createButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
});