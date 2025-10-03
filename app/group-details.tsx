import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
  Modal,
  TextInput,
  Linking,
  Button,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ArrowLeft, Users, IndianRupee, Calendar, Settings, MessageCircle, Crown, UserPlus, Copy, Share, Bell, CreditCard, Shield, CircleCheck as CheckCircle, Clock, CircleAlert as AlertCircle, Wallet, Download, XCircle, Star, Check, Eye, MessageSquare, History, ArrowDownCircle } from 'lucide-react-native';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import axios from 'axios';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import RazorpayCheckout from 'react-native-razorpay';
import RazorpayCheckout from 'react-native-razorpay';

export default function GroupDetailsScreen() {
  const router = useNavigation();
  const route = useRoute();
  const { id } = route.params;
  const [activeTab, setActiveTab] = useState('overview');
  // console.log("id from the parant : ", id)
  const [groupData, setGroupData] = useState({});
  const [tribe, setTribe] = useState({});
  const [membersData, setMembersData] = useState([]);
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitePhone, setInvitePhone] = useState("");
  const [billing, setBilling] = useState([]);
  const [subscription, setSubscription] = useState([]);
  const [credentials, setCredentials] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [noOfSubs, setNoOfSubs] = useState([]);
  const [isAddPlatformModalVisible, setAddPlatformModalVisible] = useState(false);
  const [viewCredentialsModalVisible, setViewCredentialsModalVisible] = useState(false);
  const [modalStep, setModalStep] = useState("select");
  const [removeModalVisible, setRemoveModalVisible] = useState(false);
  const [perMemberCost, setPerMemberCost] = useState(0);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [profileName, setProfileName] = useState("");
  const [notes, setNotes] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [platforms, setPlatforms] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [amount, setAmount] = useState("");
  const [upiId, setUpiId] = useState("");


  console.log("hii :", id);

  const selectedPlatformObj = platforms.find(p => p.id === selectedPlatform);
  const selectedPlanObj = selectedPlatformObj?.plans.find(pl => pl.planName === selectedPlan);

  const settings = {
    credentials: {
      email: "example@email.com",
      password: "********", // keep masked for display
    },
    isOwner: true, // toggle to false to hide "Owner Actions"
    settings: {
      groupInfo: "Study Group - React Native",
      notifications: true,
      payment: "UPI / Card linked",
    },
  };

  // useEffect(() => {
  //   const fetchUserProfile = async () => {
  //     try {
  //       const currentUser = auth().currentUser; // use auth() from @react-native-firebase/auth
  //       if (currentUser) {
  //         const idToken = await currentUser.getIdToken();
  //         const profileResponse = await axios.get(
  //           'https://api-s2onatgxwq-uc.a.run.app/api/user/profile',
  //           { headers: { Authorization: `Bearer ${idToken}` } }
  //         );
  //         setUserProfile(profileResponse.data);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching user profile:', error);
  //     }
  //   };

  //   fetchUserProfile();
  // }, []);

  const handlePayment = async (perMemberCost: number, tribeId: string) => {
    console.log("=== Payment process started ===");
    console.log("Tribe ID:", tribeId);
    console.log("Per member cost:", perMemberCost);

    try {
      const currentUser = auth().currentUser;
      if (!currentUser) {
        console.log("User not logged in");
        Alert.alert('Error', 'User not logged in');
        return;
      }

      const idToken = await currentUser.getIdToken();
      console.log("Firebase ID token obtained");
      const amountInPaise = Math.round(perMemberCost * 100);
      // 1️⃣ Create Razorpay order via backend
      console.log("Creating Razorpay order via backend...", perMemberCost);
      const orderResponse = await axios.post(
        'https://api-s2onatgxwq-uc.a.run.app/api/razorpay/create-order',
        {
          amount: amountInPaise, // Convert to paise
          currency: 'INR',
          receipt: `tribe_${tribeId}_${Date.now()}`
        },
        { headers: { Authorization: `Bearer ${idToken}` } }
      );

      const orderData = orderResponse.data;
      console.log("Razorpay order created:", orderData);

      // 2️⃣ Configure Razorpay checkout
      const options = {
        key: "rzp_test_fra3RAroBWpMqJ",
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Sttribe - Ebirtts Technologies Pvt Ltd",
        description: `Member payment for ${selectedPlatformObj?.name || "Platform"}`,
        order_id: orderData.id,
        prefill: {
          name: currentUser.displayName || currentUser.email?.split('@')[0] || "User",
          email: currentUser.email || "test@example.com",
          contact: currentUser.phoneNumber || "9999999999",
        },
        theme: { color: "#6366f1" }
      };

      console.log("Opening Razorpay checkout with options:", options);

      // 3️⃣ Open Razorpay checkout
      RazorpayCheckout.open(options)
        .then(async (response) => {
          console.log("Razorpay checkout completed, response:",
            response.razorpay_order_id,
            response.razorpay_payment_id,
            response.razorpay_signature,
          );

          const paymentResult = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          };

          try {
            // 4️⃣ Verify payment on backend
            console.log("Verifying payment on backend...");
            const verifyResp = await axios.post(
              "https://api-s2onatgxwq-uc.a.run.app/api/razorpay/verify-payment",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                paymentIds: [/* array of payment IDs, or leave empty if not applicable */],
                subscriptionId: 'nextflix123',
                userId: currentUser.uid,
                amount: orderData.amount,
              },
              { headers: { Authorization: `Bearer ${idToken}` } }
            );

            console.log("Payment verification response from backend:", verifyResp.data);

            if (verifyResp.data.success) {
              console.log("Payment verified successfully, processing purchase...");
              await processPurchase(paymentResult);

              console.log("Purchase processed successfully");
              Alert.alert('Success', 'Payment completed successfully!',
                [
                  {
                    text: "OK",
                    onPress: () => {
                      router.navigate("Tabs", { screen: "Groups" });
                    },
                  },
                ]
              );
            } else {
              console.log("Payment verification failed:", verifyResp.data);
              Alert.alert('Verification Failed', 'Payment verification failed. Please contact support.');
            }

          } catch (verErr) {
            console.error('Verification error:', verErr);
            Alert.alert('Error', 'Payment verification error. Please try again.');
          }
        })
        .catch((error) => {
          console.error("Razorpay checkout error:", error);
          Alert.alert('Payment Failed', 'Payment process was cancelled or failed.');
        });

    } catch (err) {
      console.error('Payment error:', err);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  const handleMemberPayment = async (
    memberId: string,
    tribeId: string,
    subscriptionId: string,
    amount: number, // this is in INR
    memberName?: string,
    memberEmail?: string
  ) => {
    try {
      const currentUser = auth().currentUser;
      if (!currentUser) {
        Alert.alert("Error", "User not logged in");
        return;
      }

      // 🔑 Get Firebase ID Token
      const idToken = await currentUser.getIdToken();
      const safeAmount = Number(amount);

      if (isNaN(safeAmount)) {
        console.error("❌ Invalid amount received:", amount);
        Alert.alert("Payment Error", "Invalid amount. Please try again.");
        return;
      }

      const amountRuppe = parseFloat(safeAmount.toFixed(2));
      console.log("amountRuppe:", amountRuppe);

      // 1️⃣ Create member payment order via backend
      const orderResponse = await axios.post(
        "https://api-s2onatgxwq-uc.a.run.app/api/member-payment",
        {
          subscriptionId,
          tribeId,
          memberId,
          amount: amountRuppe / 100,
        },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      const orderData = orderResponse.data;
      console.log("orderData: ", orderData);

      if (!orderData?.orderId) {
        throw new Error("Failed to create payment order");
      }

      // 2️⃣ Configure Razorpay checkout
      const options = {
        key: "rzp_test_fra3RAroBWpMqJ", // replace in prod
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Sttribe - Ebirtts Technologies Pvt Ltd",
        description: `Member payment for subscription`,
        order_id: orderData.orderId,
        prefill: {
          name: memberName || memberEmail?.split("@")[0] || "Member",
          email: memberEmail || "test@example.com",
          contact: "9999999999",
        },
        theme: { color: "#6366f1" },
      };

      RazorpayCheckout.open(options)
        .then(async (response) => {
          try {
            // 4️⃣ Verify payment via backend
            await axios.post(
              "https://api-s2onatgxwq-uc.a.run.app/api/razorpay/verify-payment",
              {
                razorpay_order_id: orderData.orderId,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                paymentIds: [],
                subscriptionId,
                userId: memberId,
                amount: orderData.amount / 100, // keep in paise
              },
              {
                headers: {
                  Authorization: `Bearer ${idToken}`,
                },
              }
            );

            Alert.alert(
              "Payment Successful!",
              "Member payment completed. You can now view subscription credentials.",
              [
                {
                  text: "OK",
                  onPress: () => {
                    router.navigate("Tabs", { screen: "Groups" });
                  },
                },
              ]
            );
          } catch (verifyError: any) {
            console.error("Payment verification error:", verifyError);
            Alert.alert(
              "Payment verification failed",
              verifyError.message || "Please contact support"
            );
          }
        })
        .catch((error) => {
          console.error("Razorpay Checkout Error:", error);
          Alert.alert("Payment Failed", "Payment was cancelled or failed.");
        });
    } catch (error: any) {
      console.error("Payment Error:", error);
      Alert.alert(
        "Payment Error",
        error.message || "Failed to initiate payment. Please try again."
      );
    }
  };



  const processPurchase = async (paymentResult) => {
    try {
      console.log("paymentResult : ", paymentResult);
      let idToken;
      const currentUser = auth().currentUser;
      if (currentUser) {
        idToken = await currentUser.getIdToken();
      }

      const purchaseResponse = await axios.post(
        'https://api-s2onatgxwq-uc.a.run.app/api/purchase',
        {
          tribeId: id,
          selectedPlans: [{
            platformName: selectedPlatformObj?.name,
            planName: selectedPlanObj?.planName,
            duration: selectedPlanObj?.duration,
            price: selectedPlanObj?.price,
            credentials: {
              email: username,
              password: password,
              profileName: profileName,
              notes: notes,
            },
          }],
          totalAmount: selectedPlanObj?.price,
          splitAmount: perMemberCost,
          paymentDetails: {
            razorpay_order_id: paymentResult.razorpay_order_id,
            razorpay_payment_id: paymentResult.razorpay_payment_id,
            razorpay_signature: paymentResult.razorpay_signature,
          }
        },
        {
          headers: { Authorization: `Bearer ${idToken}` }
        }
      );

      Alert.alert('Success!', 'Subscription purchased successfully!', [{
        text: 'OK', onPress: () => {
          setAddPlatformModalVisible(false);
          resetModalState();
          router.navigate('Groups');
          // Refresh subscriptions
          // fetchSubscriptions(); // Add this function
        }
      }
      ]
      );

    } catch (error) {
      console.error('Purchase error:', error.response?.data || error.message);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to process purchase. Please contact support.'
      );
    } finally {
      setProcessing(false);
    }
  };

  const resetModalState = () => {
    setSelectedPlatform(null);
    setSelectedPlan(null);
    setUsername("");
    setPassword("");
    setProfileName("");
    setNotes("");
    setModalStep("select");
  };


  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const currentUser = auth().currentUser;
          setCurrentUserId(currentUser.uid);
          console.log("uid: ", currentUser?.uid);

          if (!currentUser) {
            console.error("No user is logged in");
            return;
          }

          const idToken = await currentUser.getIdToken();

          // ✅ Fetch a single tribe by ID
          const tribesRes = await axios.get(
            `https://api-s2onatgxwq-uc.a.run.app/api/tribes/${id}`,
            { headers: { Authorization: `Bearer ${idToken}` } }
          );

          const platformImages = {
            Netflix: "https://images.pexels.com/photos/4009402/pexels-photo-4009402.jpeg?auto=compress&cs=tinysrgb&w=400",
            "Amazon Prime": "https://images.pexels.com/photos/3944091/pexels-photo-3944091.jpeg?auto=compress&cs=tinysrgb&w=400",
            "Disney+ Hotstar": "https://images.pexels.com/photos/7991669/pexels-photo-7991669.jpeg?auto=compress&cs=tinysrgb&w=400",
          };

          const platformColors = {
            Netflix: "#E50914",
            "Amazon Prime": "#00A8E1",
            "Disney+ Hotstar": "#113CCF",
            Default: "#8B5CF6",
          };

          const tribe = tribesRes.data; // ✅ single object, not array
          console.log("tribe response : ", tribe);
          setTribe(tribe);
          setMembersData(tribe.members);
          const platform = tribe.platform || "";

          const createdAt = tribe.createdAt?._seconds
            ? new Date(tribe.createdAt._seconds * 1000)
            : null;

          const transformed = {
            id: tribe.id,
            name: tribe.name,
            description: tribe.description,
            members: tribe._count?.members ?? tribe.members.length,
            owner:
              tribe.members.find((m) => m.user.id === tribe.createdBy)?.user?.firstName ||
              "Unknown",
            image:
              tribe.members[0]?.user?.profileImageUrl ||
              platformImages[platform] ||
              platformImages["Amazon Prime"],
            color: platformColors[platform] || platformColors.Default,
            isOwner: tribe.createdBy === currentUser.uid,
            nextBilling: new Date(), // replace with real billing when backend provides
            avatars: tribe.members
              .map((m) => m.user?.profileImageUrl)
              .filter(Boolean)
              .slice(0, 5),
            createdAt: createdAt
              ? createdAt.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
              : " ",
          };
          setGroupData(transformed);

          const ottServicesRes = await axios.get(`https://api-s2onatgxwq-uc.a.run.app/api/ott-services`, {
            headers: { Authorization: `Bearer ${idToken}` }
          });
          setPlatforms(ottServicesRes.data);

          const { data } = await axios.get(
            "https://api-s2onatgxwq-uc.a.run.app/api/subscriptions",
            { headers: { Authorization: `Bearer ${idToken}` } } // add your token
          );
          // assuming API returns an array of subscriptions, pick the first one
          console.log("subscription data: ", data);
          const subscriptions = data.filter((sub) => sub.tribe.id === id);

          const subscription = data.find(
            (sub) => sub.tribe.id === id
          );
          if (!subscription) {
            console.warn("No subscription found for tribe:", id);
            return;
          }
          console.log("subscription.ottService:", subscription.ottService);
          setNoOfSubs(subscription.ottService);
          console.log("No Of Subs : ", subscription);
          const tribeMembers = subscription.tribe.members || [];
          setSubscription(subscription);

          const subscriptionCredentialsRes = await axios.get(
            `https://api-s2onatgxwq-uc.a.run.app/api/subscriptions/${subscription.id}/credentials`,
            { headers: { Authorization: `Bearer ${idToken}` } }
          );

          setCredentials(subscriptionCredentialsRes.data);
          console.log("credentials: ", subscriptionCredentialsRes.data);
          // map payments with user info
          const paymentsWithNames = subscription.payments.map((p) => {
            const member = tribeMembers.find((m) => m.userId === p.userId);
            return {
              id: p.id,
              amount: parseFloat(p.amount).toFixed(2),
              date: new Date(p.createdAt._seconds * 1000).toLocaleDateString(),
              method: p.stripePaymentIntentId, // or dynamic if you have it
              status: p.status,
              userName: member ? `${member.user.firstName} ${member.user.lastName}` : "Unknown User",
              profileImageUrl: member?.user?.profileImageUrl || null,
            };
          });
          const billingNew = tribesRes.data;
          console.log('renwal date with tribe : ', billingNew?.subscriptions[0]?.renewalDate?._seconds);
          // now you can set billing
          const newBilling = {
            nextBilling: subscription?.renewalDate?._seconds
              ? subscription.renewalDate._seconds * 1000
              : null,
            billingHistory: paymentsWithNames,
          };
          setBilling(newBilling);
          console.log("Updated billing:", newBilling);
          // compute personal cost = monthlyPrice / number of members
          const memberCount = subscription?.tribe?.memberIds?.length ?? 1; // avoid divide by 0
          const monthlyPrice = subscription?.ottService?.monthlyPrice ?? 0;
          const perMemberCost = (monthlyPrice / memberCount) * 1.09;
        } catch (error) {
          console.error("Error fetching groups:", error);
        }
      };

      fetchData();
    }, [id])
  );

  // console.log("tribe info: ", tribe);
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'members', label: 'Members' },
    { id: 'billing', label: 'Billing' },
    { id: 'subscriptions', label: 'subscriptions' },
    ...(groupData.isOwner
      ? [{ id: 'Withdraw', label: 'Withdraw' }]
      : []),
  ];

  const getFAIconName = (iconClass: string) => {
    if (!iconClass) return null;
    const parts = iconClass.split(" ");
    return parts.length > 1 ? parts[1].replace("fa-", "") : null;
  };

  const copyGroupCode = () => {
    Alert.alert('Copied!', 'Group code copied to clipboa');
  };

  const shareGroup = () => {
    Alert.alert('Share Group', 'Share link copied to clipboard');
  };

  const handleWithdraw = () => {
    Alert.alert(
      'Withdraw Funds',
      `Withdraw ₹${groupData.availableBalance} to purchase ${groupData.platform} subscription?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Withdraw',
          onPress: () => Alert.alert('Success', 'Funds withdrawn successfully!')
        },
      ]
    );
  };
  useEffect(() => {
    if (selectedPlanObj?.price && membersData.length > 0) {
      const totalCost = Number(selectedPlanObj.price) + (Number(selectedPlanObj.price) * 0.09);
      const splitCost = totalCost / membersData.length;
      setPerMemberCost(splitCost.toFixed(2));
    } else {
      setPerMemberCost(0);
    }
  }, [selectedPlanObj, membersData]);

  const handleInvite = async () => {
    console.log('clicked the send button', inviteEmail, invitePhone);

    // Require at least one field
    if (!inviteEmail.trim() && !invitePhone.trim()) {
      alert("Please enter email or phone number");
      return;
    }

    try {
      let payload: any = {};

      // If email exists and is valid
      if (inviteEmail.trim()) {
        const isEmail = /\S+@\S+\.\S+/.test(inviteEmail);
        if (!isEmail) {
          alert("Please enter a valid email");
          return;
        }
        payload.inviteEmails = inviteEmail;
      }

      // If phone exists and is valid
      if (invitePhone.trim()) {
        const isPhone = /^[0-9]{10}$/.test(invitePhone); // adjust regex if needed
        if (!isPhone) {
          alert("Please enter a valid 10-digit phone number");
          return;
        }
        payload.phoneNumbers = invitePhone;
      }

      // Tribe ID
      const tribeId = id;

      const response = await axios.post(
        `https://api-s2onatgxwq-uc.a.run.app/api/tribes/${tribeId}/members`,
        payload
      );
      console.log("✅ Invite success:", response.data);
      Alert.alert(response.data.message || "Invite sent successfully!");

      setInviteModalVisible(false);
      setInviteEmail("");
      setInvitePhone(""); // reset phone too
    } catch (error: any) {
      console.error("❌ Invite failed:", error.response?.data || error.message);
      Alert.alert(error.response?.data?.message || "Failed to send invite");
    }
  };
  const handleRemoveMember = async (userId) => {
    console.log("userid: ", userId);
    try {
      // Get the current Firebase token
      const currentUser = auth().currentUser;
      const token = currentUser ? await currentUser.getIdToken() : null;

      if (!token) {
        console.error("No auth token found");
        return;
      }
      const tribeId = id;
      const response = await axios.delete(
        `https://api-s2onatgxwq-uc.a.run.app/api/tribes/${tribeId}/members`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // required for verifyFirebaseToken
          },
          data: { userId },
        }
      );
      console.log("Member removed:", response.data.message);
      Alert.alert("Success", "Member removed successfully.");
      setRemoveModalVisible(false);
      setSelectedMember(null);
    } catch (error) {
      console.error("Failed to remove member:", error.response?.data || error.message);
    }
  };
  const handleSendWhatsAppNotification = async (tribe: any) => {
    console.log("props: ", tribe);
    try {
      const currentUser = auth().currentUser;
      const token = currentUser ? await currentUser.getIdToken() : null;
      if (!token) {
        Alert.alert("Error", "No auth token found. Please login again.");
        return;
      }
      const response = await axios.post(
        `https://api-s2onatgxwq-uc.a.run.app/api/tribes/${tribe.id}/whatsapp-notification`,
        {
          message: `Hi! You have updates in the ${tribe.name} tribe. Check your subscriptions and payments in Sttribe app.`,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        Alert.alert(
          "Success",
          `WhatsApp notifications sent to all ${tribe.name} members.`
        );
        alert(
          `Success,
          WhatsApp notifications sent to all ${tribe.name} members.`
        );
      } else {
        throw new Error("Failed to send notifications");
      }
    } catch (error: any) {
      console.error("WhatsApp notification error:", error.response?.data || error.message);
      Alert.alert(
        "Notification Failed",
        "Unable to send WhatsApp notifications. Please try again."
      );
    }
  };
  const handleAddOttPlatform = () => {
    setAddPlatformModalVisible(true);
  }
  const renderOverview = () => (
    <View style={styles.tabContent}>
      {/* Group Info Card */}
      <View style={styles.infoCard}>
        <LinearGradient
          colors={[
            (groupData.color || '#8B5CF6') + '20',
            (groupData.color || '#8B5CF6') + '10'
          ]}
          style={styles.infoCardGradient}
        >
          <View style={styles.infoHeader}>
            <Image source={{ uri: groupData.image }} style={styles.groupImage} />
            <View style={styles.groupInfo}>
              <Text style={styles.groupName}>{groupData.name}</Text>
              {/* <Text style={styles.groupPlatform}>{groupData.platform} • {groupData.plan}</Text> */}
              <Text style={styles.groupPlatform}>{groupData.description}</Text>
              <View style={styles.statusBadge}>
                <CheckCircle size={12} color="#10B981" />
                <Text style={styles.statusText}>Active</Text>
              </View>
            </View>
            {groupData.isOwner && (
              <Crown size={20} color="#F59E0B" />
            )}
          </View>
        </LinearGradient>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Users size={20} color="#8B5CF6" />
          <Text style={styles.statValue}>{groupData.members}</Text>
          <Text style={styles.statLabel}>Members</Text>
        </View>
        <View style={styles.statCard}>
          <IndianRupee size={20} color="#10B981" />
          <Text style={styles.statValue}>₹{noOfSubs?.monthlyPrice ?? "0"}</Text>
          <Text style={styles.statLabel}>Full Price</Text>
        </View>
        <View style={styles.statCard}>
          <Calendar size={20} color="#F59E0B" />
          <Text style={styles.statValue}>
            {subscription?.renewalDate?._seconds
              ? new Date(subscription.renewalDate._seconds * 1000).toLocaleDateString('en-US', {
                month: 'numeric',
                day: 'numeric',
                year: 'numeric',
              })
              : "-/-/--"}
          </Text>
          <Text style={styles.statLabel}>Next Billing</Text>
        </View>
        <View style={styles.statCard}>
          <IndianRupee size={20} color="#10B981" />
          <Text style={styles.statValue}>
            ₹{subscription?.payments?.[0]?.amount ?? "0"}
          </Text>
          <Text style={styles.statLabel}>Your Share</Text>
        </View>
      </View>

      {groupData.isOwner && (
        <View style={styles.withdrawalCard}>
          <LinearGradient
            colors={['#059669', '#10B981']}
            style={styles.withdrawalGradient}
          >
            <Text style={styles.withdrawalTitle}>Ready to Purchase Subscriptions</Text>
            <Text style={styles.withdrawalSubtitle}>
              You can now purchase the subscriptions.
            </Text>
            <Text style={{ marginBottom: 16, color: '#FFFFFF' }}>Note: 1 Tribe Can contain Only One Subscription</Text>
            <Text style={{ marginBottom: 16, color: '#FFFFFF', textAlign: 'center' }}>Note: 2 All the money you can Withdraw from Withdraw tab on Beside Subscription{'\n'}You can withdraw the total amount once all members have paid their share</Text>
            {(() => {
              const subsArray = Array.isArray(noOfSubs) ? noOfSubs : [noOfSubs];
              if (subsArray.length === 0) {
                return (
                  <TouchableOpacity
                    style={styles.withdrawButton}
                    onPress={handleAddOttPlatform}
                  >
                    <Text style={styles.withdrawButtonText}>
                      Purchase Subscriptions
                    </Text>
                  </TouchableOpacity>
                );
              }
              return null; // nothing if condition not met
            })()}
          </LinearGradient>
        </View>
      )}

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() =>
            router.navigate("Chat", {
              groupId: groupData.id,
              groupName: groupData.name,
              memberCount: groupData.members,
            })
          }
        >
          <MessageCircle size={20} color="#8B5CF6" />
          <Text style={styles.actionText}>Group Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={shareGroup}>
          <Share size={20} color="#10B981" />
          <Text style={styles.actionText}>Share Group</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.actionButton}>
          <Bell size={20} color="#F59E0B" />
          <Text style={styles.actionText}>Notifications</Text>
        </TouchableOpacity> */}
      </View>

      {/* Group Code */}
      {/* <View style={styles.codeCard}>
        <Text style={styles.codeTitle}>Group Code</Text>
        <View style={styles.codeContainer}>
          <Text style={styles.codeText}>{groupData.groupCode}</Text>
          <TouchableOpacity onPress={copyGroupCode}>
            <Copy size={20} color="#8B5CF6" />
          </TouchableOpacity>
        </View>
        <Text style={styles.codeSubtitle}>Share this code with friends to invite them</Text>
      </View> */}
      {renderPlatformModal()}
    </View>
  );

  const renderMembers = () => (
    <View style={styles.tabContent}>
      {groupData.isOwner && (
        <TouchableOpacity
          style={styles.inviteButton}
          onPress={() => setInviteModalVisible(true)}   // 👈 open modal
        >
          <LinearGradient
            colors={['#8B5CF6', '#A78BFA']}
            style={styles.inviteButtonGradient}
          >
            <UserPlus size={20} color="#FFFFFF" />
            <Text style={styles.inviteButtonText}>Invite Member</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}

      {membersData.map((member) => (
        <View key={member.id} style={styles.memberCard}>
          <View style={styles.memberAvatarWrapper}>
            {member?.user?.profileImageUrl ? (
              <Image
                source={{ uri: member.user.profileImageUrl }}
                style={styles.memberAvatar}
              />
            ) : (
              <View style={styles.fallbackAvatar}>
                <Text style={styles.fallbackText}>
                  {member?.user?.firstName?.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.memberInfo}>
            <View style={styles.memberHeader}>
              <Text style={styles.memberName}>{member.user?.firstName}</Text>
              {member.isOwner && <Crown size={14} color="#F59E0B" />}
            </View>
            <Text style={styles.memberEmail}>{member.user?.email}</Text>
            <Text style={styles.memberJoined}>
              Joined{" "}
              {member?.joinedAt?._seconds
                ? new Date(member.joinedAt._seconds * 1000).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
                : "N/A"}
            </Text>
          </View>
          <View style={[styles.memberStatus, { gap: 10, justifyContent: 'center', alignItems: 'center' }]}>
            {member.role === 'admin' ? (
              <View style={styles.paidStatus}>
                {/* <CheckCircle size={16} color="#10B981" /> */}
                <Text style={styles.paidText}>{member.role}</Text>
              </View>
            ) : (
              <View style={styles.pendingStatus}>
                {/* <Clock size={16} color="#F59E0B" /> */}
                <Text style={styles.pendingText}>{member.role}</Text>
              </View>
            )}
            {groupData.isOwner && !member.isOwner && member.role !== 'admin' && (
              <TouchableOpacity
                onPress={() => {
                  setSelectedMember(member);
                  setRemoveModalVisible(true);
                }}
                style={styles.removeButton}
              >
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ))}

      <Modal
        transparent={true}
        visible={inviteModalVisible}
        animationType="slide"
        onRequestClose={() => setInviteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Invite Member</Text>

            <Text style={styles.cardTitle}>Email Address: (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter email or Number"
              value={inviteEmail}
              onChangeText={setInviteEmail}
              placeholderTextColor="#888"
            />
            <Text style={styles.cardTitle}>Mobile Number: (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter email or Number"
              value={invitePhone}
              onChangeText={setInvitePhone}
              placeholderTextColor="#888"
            />

            <View style={[styles.modalActions, { justifyContent: 'center', alignItems: 'center', flexDirection: 'column', marginTop: 10, }]}>
              <TouchableOpacity onPress={() => {
                handleInvite();
              }} style={{ backgroundColor: '#8B5CF6', padding: 10, borderRadius: 6 }}>
                <Text style={{ color: '#fff' }}>Send Invite</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setInviteModalVisible(false)}>
                <Text style={styles.cancelButton}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="fade"
        transparent
        visible={removeModalVisible}
        onRequestClose={() => setRemoveModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Remove Member</Text>
            <Text style={styles.modalText}>
              Are you sure you want to remove {selectedMember?.user?.firstName} from the tribe? This action will automatically recalculate billing amounts for all remaining members starting from the next billing cycle.
            </Text>

            <View style={styles.noteBox}>
              <Text style={styles.noteText}>
                Note: Billing amounts will be redistributed among remaining members. The removed member will lose access to all tribe subscriptions immediately.
              </Text>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setRemoveModalVisible(false);
                  setSelectedMember(null);
                }}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.removeConfirmButton]}
                onPress={() => handleRemoveMember(selectedMember?.user?.id)}
              >
                <Text style={{ color: 'white' }}>Remove Member</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );

  const renderBilling = () => {
    const getPaymentStatus = (memberId) => {
      const payment = subscription?.payments?.find((p) => p.userId === memberId);
      return payment?.status === "paid" ? "paid" : "pending";
    };
    if (!billing) {
      return (
        <Text style={{ textAlign: "center", marginTop: 20, color: "#6B7280" }}>
          Loading billing info...
        </Text>
      );
    }
    return (
      <View style={styles.tabContent}>
        {/* Next Payment */}
        <View style={styles.nextPaymentCard}>
          <LinearGradient
            colors={['#8B5CF6', '#A78BFA']}
            style={styles.nextPaymentGradient}
          >
            <Text style={styles.nextPaymentTitle}>Next Payment</Text>
            <Text style={styles.nextPaymentDate}>
              {billing?.nextBilling
                ? new Date(billing.nextBilling).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })
                : " "}
            </Text>

            <View style={styles.nextPaymentAmount}>
              {/* <IndianRupee size={20} color="#FFFFFF" /> */}
              {billing?.billingHistory?.[0]?.amount ? (
                <Text style={styles.nextPaymentAmountText}>
                  ₹{billing.billingHistory[0].amount}
                </Text>
              ) : (
                <Text style={styles.nextPaymentAmountText}> No active subscriptions yet. Add one to get started.</Text>
              )}
            </View>
            {/* <TouchableOpacity style={styles.payNowButton}>
              <Text style={styles.payNowText}>Pay Now</Text>
            </TouchableOpacity> */}
          </LinearGradient>
        </View>

        {/* Billing History */}

        <Text style={styles.sectionTitle}>Payment Status: </Text>

        {subscription ? (
          (membersData || []).map((member, idx) => {
            const paymentStatus = getPaymentStatus(member.userId);
            return (
              <View
                key={idx}
                style={[styles.billCard, { justifyContent: 'space-between', padding: 20 }]}
              >
                <Text style={styles.billDate}>
                  {member.user?.firstName ||
                    member.user?.email?.split("@")[0] ||
                    "Unknown"}
                </Text>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                  }}
                >
                  {paymentStatus === "pending" && (
                    <TouchableOpacity
                      style={{
                        borderWidth: 1,
                        borderColor: "#16A34A",
                        padding: 6,
                        borderRadius: 6,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onPress={() => handleSendWhatsAppNotification(groupData)}
                    >
                      <MessageSquare size={14} color="#16A34A" style={{ marginRight: 4 }} />
                      <Text style={{ fontSize: 12, color: "#16A34A" }}>Notify</Text>
                    </TouchableOpacity>
                  )}

                  <View
                    style={{
                      backgroundColor: paymentStatus === "paid" ? "#D1FAE5" : "#FEE2E2",
                      paddingHorizontal: 8,
                      paddingVertical: 6,
                      borderRadius: 6,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        color: paymentStatus === "paid" ? "#065F46" : "#991B1B",
                      }}
                    >
                      {paymentStatus === "paid" ? "Paid" : "Pending"}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })
        ) : (
          <Text style={{ fontSize: 14, color: "#9CA3AF", marginVertical: 20, textAlign: 'center' }}>
           No subscriptions found. Add one to begin sharing.
          </Text>
        )}

        <Text style={styles.sectionTitle}>Billing History</Text>
        {
          (billing?.billingHistory ?? []).filter(bill => bill.status === 'paid').length > 0 ? (
            billing.billingHistory
              .filter(bill => bill.status === 'paid')
              .map((bill, index) => (
                <View key={index} style={styles.billCard}>
                  <View style={styles.billIcon}>
                    <CreditCard size={20} color="#8B5CF6" />
                  </View>
                  <View style={styles.billInfo}>
                    <Text style={styles.billDate}>
                      {bill.userName}
                    </Text>
                    <Text style={styles.billMethod}>
                      Date: {bill.date || 'N/A'}
                    </Text>
                    <Text style={styles.billMethod}>
                      Payment ID: {bill.method || 'N/A'}
                    </Text>
                  </View>
                  <View style={styles.billAmount}>
                    <Text style={styles.billAmountText}>
                      ₹{bill.amount ? parseFloat(bill.amount).toFixed(2) : '0.00'}
                    </Text>
                    <CheckCircle size={16} color="#10B981" />
                  </View>
                </View>
              ))
          ) : (
            <Text style={{ color: '#9CA3AF', textAlign: 'center' }}>
              No paid transactions found yet.
            </Text>
          )
        }
      </View >
    );
  };

  const renderSubscriptions = () => {
    // 🔹 Static sample data for now
    const subsArray = Array.isArray(noOfSubs) ? noOfSubs : [noOfSubs];
    const getPaymentStatus = (memberId) => {
      const payment = subscription?.payments?.find((p) => p.userId === memberId);
      return payment?.status === "paid" ? "paid" : "pending";
    };

    return (
      <View style={styles.tabContent}>
        {/* Subscriptions Summary */}
        <View style={styles.subCard}>
          <LinearGradient
            colors={["#4F46E5", "#6366F1"]}
            style={styles.subGradient}
          >
            <Text style={styles.subTitle}>Active Subscriptions In Tribe</Text>
            <View style={styles.subCountRow}>
              <Star size={24} color="#FFFFFF" />
              <Text style={styles.subCountText}>{subsArray.length}</Text>
            </View>
            <Text style={styles.subSubtitle}>
              Across {groupData.members} members
            </Text>
          </LinearGradient>
        </View>

        {/* Subscriptions List */}
        <Text style={styles.sectionTitle}>Your Subscriptions</Text>
        {subsArray.map((sub, index) => {
          const faName = getFAIconName(sub.iconClass);
          return (
            <View key={index} style={styles.subItemCard}>
              <View style={styles.subIcon}>
                {faName && typeof faName === "string" ? (
                  <FontAwesome5
                    name={faName}
                    size={32}
                    color={sub.color}
                    style={styles.platformImage}
                  />
                ) : (
                  <Text
                    style={[
                      styles.platformImage,
                      { color: '#1f80e0', fontSize: 28, fontWeight: "bold" }
                    ]}
                  >
                    {sub.name?.charAt(0).toUpperCase()}
                  </Text>
                )}
              </View>
              <View style={styles.subInfo}>
                <Text style={styles.subName}>{sub.name}</Text>
                <Text style={styles.subExpiry}>duration: {sub.duration}</Text>
                <Text style={styles.subExpiry}>
                  Expiry: {billing?.nextBilling
                    ? new Date(billing.nextBilling).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'numeric',
                      year: 'numeric',
                    })
                    : " "}
                </Text>
              </View>
              <View style={[styles.subStatus, { justifyContent: 'center', alignItems: 'center', gap: 10 }]}>
                {getPaymentStatus(currentUserId) === "paid" ? (
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      borderWidth: 1,
                      borderColor: "#9CA3AF",
                      padding: 6,
                      borderRadius: 6,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onPress={() => setViewCredentialsModalVisible(true)}
                  >
                    <Eye size={14} color="#374151" style={{ marginRight: 4 }} />
                    <Text style={{ fontSize: 12 }}>View Credentials</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={{ flex: 1 }}>
                    <View
                      style={{
                        backgroundColor: "#FEF3C7",
                        borderWidth: 1,
                        borderColor: "#FCD34D",
                        borderRadius: 6,
                        padding: 6,
                        marginBottom: 6,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          color: "#92400E",
                          fontWeight: "600",
                        }}
                      >
                        Payment Required
                      </Text>
                      <Text style={{ fontSize: 12, color: "#B45309" }}>
                        Amount: ₹{subscription?.payments?.[0]?.amount} (includes 9% platform fee)
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 6,
                        backgroundColor: "#16A34A",
                        borderRadius: 6,
                      }}
                      onPress={() => {
                        const currentUser = auth().currentUser;

                        if (!currentUser) {
                          Alert.alert("Error", "User not logged in");
                          return;
                        }

                        const memberId = currentUser.uid;
                        const memberName =
                          currentUser.displayName ||
                          currentUser.email?.split("@")[0] ||
                          "Member";
                        const memberEmail = currentUser.email || "test@example.com";
                        const subscriptionId = subscription.id;
                        const amount = subscription?.payments?.[0]?.amount;
                        handleMemberPayment(memberId, id, subscriptionId, amount, memberName, memberEmail);
                      }}
                    >
                      <CreditCard size={14} color="#fff" style={{ marginRight: 4 }} />
                      <Text style={{ fontSize: 12, color: "#fff" }}>
                        Pay ₹{subscription?.payments?.[0]?.amount}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
                <Text
                  style={[
                    styles.subStatusText,
                    { color: subscription.isActive === true ? "#10B981" : "#EF4444" },
                  ]}
                >
                  {subscription.isActive === true ? "Active" : "Expired"}
                </Text>
              </View>
            </View>
          )
        })
        }
        {/* Admin Actions */}
        {
          subsArray.length === 0 && groupData.isOwner && (
            (m) => m.userId === currentUserId && m.role === "admin"
          ) && (
            <View style={styles.adminActions}>
              <TouchableOpacity onPress={handleAddOttPlatform} style={styles.adminActionButton}>
                <CreditCard size={20} color="#4F46E5" />
                <Text style={styles.adminActionText}>Add OTT Platforms To Trbe</Text>
              </TouchableOpacity>
            </View>
          )
        }
        <Modal
          visible={viewCredentialsModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setViewCredentialsModalVisible(false)} // ✅ correct usage
        >
          <View style={styles.overlay}>
            <View style={styles.modalContainer}>
              {/* Title */}
              <Text style={styles.title}>{noOfSubs.name} Credentials</Text>
              <Text style={styles.subtitle}>
                Use these credentials to access your shared subscription.
              </Text>

              {/* Username */}
              <View style={styles.inputBox}>
                <Text style={styles.label}>Email/Username:</Text>
                <View style={styles.readonlyInput}>
                  <Text style={styles.inputText}>{credentials?.email}</Text>
                </View>
              </View>

              {/* Password */}
              <View style={styles.inputBox}>
                <Text style={styles.label}>Password:</Text>
                <View style={styles.readonlyInput}>
                  <Text style={styles.inputText}>{credentials?.password}</Text>
                </View>
              </View>

              {/* Info Note */}
              <View style={styles.noticeBox}>
                <Text style={styles.noticeText}>
                  <Text style={{ fontWeight: "bold", color: "red" }}>Important: </Text>
                  Please don't change the password or profile settings. This is shared with other tribe members.
                </Text>
              </View>

              {/* Buttons */}
              <TouchableOpacity
                style={styles.gotItButton}
                onPress={() => setViewCredentialsModalVisible(false)} // ✅ close modal
              >
                <Text style={styles.gotItText}>Got it</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {renderPlatformModal()}
      </View >
    );
  };

  const renderSettings = () => (
    <View style={styles.tabContent}>
      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Group Settings</Text>
        <TouchableOpacity onPress={() => { }} style={styles.settingItem}>
          <Text style={styles.settingText}>Edit Group Info</Text>
          <Settings size={16} color="#6B7280" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Notification Preferences</Text>
          <Bell size={16} color="#6B7280" />
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Payment Settings</Text>
          <CreditCard size={16} color="#6B7280" />
        </TouchableOpacity> */}
      </View>

      {settings.isOwner && (
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Owner Actions</Text>
          <TouchableOpacity style={[styles.settingItem, styles.dangerItem]}>
            <Text style={[styles.settingText, styles.dangerText]}>Transfer Ownership</Text>
            <AlertCircle size={16} color="#EF4444" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const WithdrawalTab = () => {

    const totalPaid = (billing?.billingHistory ?? [])
      .filter(bill => bill.status === 'paid') // only paid bills
      .reduce((acc, bill) => acc + parseFloat(bill.amount || "0"), 0);

    // Format as currency
    const availableBalance = `₹${totalPaid.toFixed(2)}`;

    const getPaymentStatus = (memberId) => {
      const payment = subscription?.payments?.find((p) => p.userId === memberId);
      return payment?.status === "paid" ? "paid" : "pending";
    };

    const show = () => {
      // assume groupMembers is an array of all group members with their ids
      const allPaid =
        membersData.length > 0 &&
        membersData.every((member) => getPaymentStatus(member.id) === "paid");

      console.log("allPaid: ", allPaid);

      if (allPaid) {
        setShowForm(!showForm);
      } else {
        Alert.alert(
          "Withdrawal Not Allowed",
          "All members haven't paid yet. Notify them and try again later.",
          [{ text: "OK" }]
        );
      }
    };

    const handleSubmit = () => {
      if (!amount || !upiId) {
        Alert.alert("Error", "Please enter amount and UPI ID");
        return;
      }
      Alert.alert("Success", `Withdrawal of ${amount} requested for UPI: ${upiId}`);
      // Reset form
      setAmount("");
      setUpiId("");
      setShowForm(false);
    };

    return (
      <View style={{ flex: 1, padding: 16, backgroundColor: "#F9FAFB" }}>
        {/* Available Balance */}
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 8,
            padding: 16,
            marginBottom: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 2,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "700", color: "#111827" }}>Available Balance</Text>
          <Text style={{ fontSize: 24, fontWeight: "700", color: "#4F46E5", marginTop: 8 }}>{availableBalance}</Text>
        </View>

        {/* Withdrawal Section */}
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 8,
            padding: 16,
            marginBottom: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 2,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "700", color: "#111827", marginBottom: 12 }}>Withdrawal</Text>

          {/* Request Withdrawal */}
          <TouchableOpacity
            onPress={() => show()}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingVertical: 12,
              borderBottomWidth: 1,
              borderBottomColor: "#E5E7EB",
            }}
          >
            <Text style={{ fontSize: 14, color: "#111827" }}>Request Withdrawal</Text>
            <ArrowDownCircle size={20} color="#6B7280" />
          </TouchableOpacity>

          {/* Withdrawal Form */}
          {showForm && (
            <View style={{ marginTop: 16 }}>
              <TextInput
                placeholder="Enter Amount"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
                style={{
                  borderWidth: 1,
                  borderColor: "#D1D5DB",
                  borderRadius: 6,
                  padding: 10,
                  marginBottom: 12,
                  fontSize: 14,
                }}
              />
              <TextInput
                placeholder="Enter UPI ID"
                placeholderTextColor="#9CA3AF"
                value={upiId}
                onChangeText={setUpiId}
                style={{
                  borderWidth: 1,
                  borderColor: "#D1D5DB",
                  borderRadius: 6,
                  padding: 10,
                  marginBottom: 12,
                  fontSize: 14,
                }}
              />
              <Button title="Submit" onPress={handleSubmit} color="#4F46E5" />
            </View>
          )}

          {/* Withdrawal History */}
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingVertical: 12,
              marginTop: 12,
            }}
          >
            <Text style={{ fontSize: 14, color: "#111827" }}>Withdrawal History</Text>
            <History size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Admin Actions Section */}
        {/* <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 8,
            padding: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 2,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "700", color: "#111827", marginBottom: 12 }}>Admin Actions</Text>

          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingVertical: 12,
              borderBottomWidth: 1,
              borderBottomColor: "#FCA5A5",
            }}
          >
            <Text style={{ fontSize: 14, color: "#EF4444" }}>Manage Withdrawal Requests</Text>
            <AlertCircle size={20} color="#EF4444" />
          </TouchableOpacity>
        </View> */}
      </View>
    );
  };



  const renderPlatformModal = () => {
    return (
      <Modal
        visible={isAddPlatformModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setAddPlatformModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <ScrollView style={styles.modalContent}
            showsVerticalScrollIndicator={true}
            showsHorizontalScrollIndicator={true}>

            {modalStep === "select" && (
              <>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <TouchableOpacity onPress={() => setAddPlatformModalVisible(false)}>
                    <ArrowLeft size={20} color={'#000'} />
                  </TouchableOpacity>
                  <Text style={styles.stepTitle}>Select Platform</Text>
                </View>
                <View style={styles.section}>
                  <View style={styles.platformGrid}>
                    {platforms.map(platform => {
                      const faName = getFAIconName(platform.iconClass);
                      return (
                        <TouchableOpacity
                          key={platform.id}
                          style={[
                            styles.platformCard,
                            selectedPlatform === platform.id && styles.platformCardSelected
                          ]}
                          onPress={() => {
                            if (selectedPlatform === platform.id) {
                              setSelectedPlatform(null);
                              setSelectedPlan(null);
                            } else {
                              setSelectedPlatform(platform.id);
                              setSelectedPlan(null);
                            }
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
                  </View>
                </View>

                {selectedPlatform && (
                  <View style={styles.section}>
                    <Text style={styles.stepTitle}>Select Plan</Text>
                    {platforms.find(p => p.id === selectedPlatform)?.plans.map(plan => (
                      <TouchableOpacity
                        key={plan.planName}
                        style={[
                          styles.planCard,
                          selectedPlan === plan.planName && styles.planCardSelected
                        ]}
                        onPress={() => {
                          setSelectedPlan(plan.planName);
                        }}
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

                {selectedPlan && (
                  <TouchableOpacity
                    style={[styles.continueButton, { backgroundColor: '#8B5CF6' }]}
                    onPress={() => setModalStep("credentials")}
                  >
                    <Text style={styles.continueButtonText}>Continue to Credentials</Text>
                  </TouchableOpacity>
                )}
              </>
            )}

            {modalStep === "credentials" && (
              <View style={styles.credentialsWrapper}>
                {/* Title */}
                <Text style={styles.stepTitle}>Enter Credentials</Text>
                <Text style={styles.stepDescription}>
                  Enter login credentials for each platform. These will be securely shared with tribe members.
                </Text>

                {/* Card */}
                <View style={styles.card}>
                  {/* Platform header */}
                  <View style={styles.cardHeader}>
                    <View style={[styles.platformIconBox, { backgroundColor: selectedPlatformObj?.color }]}>
                      {selectedPlatformObj?.iconClass ? (
                        <FontAwesome5
                          name={getFAIconName(selectedPlatformObj.iconClass)}
                          size={20}
                          color="#fff"
                        />
                      ) : (
                        <Text style={styles.platformIcon}>
                          {selectedPlatformObj?.name?.charAt(0).toUpperCase()}
                        </Text>
                      )}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.cardTitle}>
                        {selectedPlatformObj?.name} - {selectedPlanObj?.planName}
                      </Text>
                    </View>
                    <Text style={styles.planPriceTag}>₹{selectedPlanObj?.price}/{selectedPlanObj?.duration}</Text>
                  </View>

                  {/* Input Fields */}
                  <TextInput
                    style={[styles.input, { height: 40 }]}
                    placeholder="Email/Username *"
                    placeholderTextColor="#999"
                    value={username}
                    onChangeText={setUsername}
                  />

                  <View style={styles.passwordField}>
                    <TextInput
                      style={[styles.passwordInput, { flex: 1, height: 40 }]}
                      placeholder="Password *"
                      placeholderTextColor="#999"
                      secureTextEntry={!showPassword}
                      value={password}
                      onChangeText={setPassword}
                    />
                    <TouchableOpacity
                      style={styles.passwordToggle}
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <Ionicons
                        name={showPassword ? "eye-off" : "eye"}
                        size={20}
                        color="#6B7280"
                      />
                    </TouchableOpacity>
                  </View>

                  <TextInput
                    style={[styles.input, { height: 40 }]}
                    placeholder="Profile Name"
                    placeholderTextColor="#999"
                    value={profileName}
                    onChangeText={setProfileName}
                  />

                  <TextInput
                    style={[styles.input, { height: 100 }]}
                    placeholder="Additional Notes"
                    placeholderTextColor="#999"
                    multiline
                    value={notes}
                    onChangeText={setNotes}
                  />
                </View>

                {/* Buttons */}
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => setModalStep("select")}
                  >
                    <Text style={styles.backButtonText}>Back to Platforms</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    disabled={!username.trim() || !password.trim()} // disable if empty
                    style={[
                      styles.continueButton,
                      {
                        backgroundColor:
                          !username.trim() || !password.trim()
                            ? "#A5B4FC" // lighter purple when disabled
                            : "#8B5CF6", // active purple
                        opacity: !username.trim() || !password.trim() ? 0.6 : 1,
                      },
                    ]}
                    onPress={() => {
                      setModalStep("payment");
                    }}
                  >
                    <Text style={styles.continueButtonText}>Continue to Payment</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {modalStep === "payment" && (
              <View style={styles.paymentContainer}>
                <Text style={styles.paymentTitle}>Payment Summary</Text>

                <View style={styles.summaryCard}>
                  {/* Selected Platform */}
                  <Text style={styles.sectionHeading}>Selected Platforms:</Text>
                  <View style={styles.platformItem}>
                    <View style={[styles.platformIconBox, { backgroundColor: selectedPlatformObj?.color }]}>
                      {selectedPlatformObj?.iconClass ? (
                        <FontAwesome5
                          name={getFAIconName(selectedPlatformObj.iconClass)}
                          size={20}
                          color="#fff"
                        />
                      ) : (
                        <Text style={styles.platformIcon}>
                          {selectedPlatformObj?.name?.charAt(0).toUpperCase()}
                        </Text>
                      )}
                    </View>
                    <Text style={styles.cardTitle}>
                      {selectedPlatformObj?.name} - {selectedPlanObj?.planName}
                    </Text>
                    <Text style={styles.planPriceTag}>₹{selectedPlanObj?.price}/{selectedPlanObj?.duration}</Text>
                  </View>

                  {/* Cost Breakdown */}
                  <Text style={styles.costText}>Subscription Total: ₹{selectedPlanObj?.price}</Text>
                  <Text style={styles.costText}>Platform Fee: {Number(selectedPlanObj.price) * 0.09}</Text>
                  <Text style={styles.costTotal}>Total Amount: ₹{Number(selectedPlanObj?.price) + (Number(selectedPlanObj.price) * 0.09)}</Text>

                  {/* Cost Split Details */}
                  <View style={styles.splitBox}>
                    <Text style={styles.sectionHeading}>Cost Split Details</Text>
                    <Text style={styles.splitText}>Total Members: {membersData.length}</Text>
                    <Text style={styles.splitText}>Total Cost (with fee): ₹{selectedPlanObj?.price
                      ? (Number(selectedPlanObj.price) + (Number(selectedPlanObj.price) * 0.09)).toFixed(2)
                      : "0"}</Text>
                    <Text style={styles.splitText}>Cost per Member: ₹{perMemberCost}</Text>
                    <Text style={styles.yourShare}>Your Share: ₹{perMemberCost}</Text>
                  </View>

                  {/* Info Note */}
                  <View style={styles.infoNotice}>
                    <Text style={styles.infoText}>
                      You're paying only your share (₹{perMemberCost}). Other tribe members will be notified to pay their share.{'\n'}
                      Note: You will get back your share
                    </Text>
                  </View>
                </View>

                {/* Buttons */}
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => setModalStep("credentials")}
                  >
                    <Text style={styles.backBtnText}>Back to Credentials</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.payBtn}
                    onPress={() => {
                      handlePayment(perMemberCost, id);
                      console.log("Proceeding with payment of");
                    }}
                  >
                    <Text style={styles.payBtnText}>Pay ₹{perMemberCost}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setAddPlatformModalVisible(false)
                setSelectedPlatform(null);
                setSelectedPlan(null);
                setModalStep("select");
              }}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>

          </ScrollView>
        </View>
      </Modal>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.goBack()}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Group Details</Text>
        <TouchableOpacity>
          {/* <Settings size={24} color="#6B7280" /> */}
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                activeTab === tab.id && styles.activeTab,
              ]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab.id && styles.activeTabText,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Tab Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'members' && renderMembers()}
        {activeTab === 'billing' && renderBilling()}
        {activeTab === 'subscriptions' && renderSubscriptions()}
        {activeTab === 'Withdraw' && WithdrawalTab()}
        {activeTab === 'settings' && renderSettings()}
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
  tabsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeTab: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  infoCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  infoCardGradient: {
    padding: 20,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  groupPlatform: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#10B981',
    marginLeft: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    margin: '1%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  withdrawalCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  withdrawalGradient: {
    padding: 20,
    alignItems: 'center',
  },
  withdrawalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  withdrawalSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    opacity: 0.9,
  },
  withdrawalAmount: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  withdrawalAmountText: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  withdrawButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  withdrawButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#059669',
    marginLeft: 8,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
  codeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  codeTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 12,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  codeText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    letterSpacing: 2,
  },
  codeSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  inviteButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  inviteButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  inviteButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  memberCard: {
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
  memberAvatarWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  fallbackAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    backgroundColor: "#89a28a8a", // or any default color
    alignItems: "center",
    justifyContent: "center",
  },
  fallbackText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  memberAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  memberInfo: {
    flex: 1,
  },
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  memberName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginRight: 8,
  },
  memberEmail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 2,
  },
  memberJoined: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  memberStatus: {
    alignItems: 'flex-end',
  },
  removeButton: {
    padding: 6,
    backgroundColor: '#FEE2E2',
    borderRadius: 4,
    // marginRight: 8,
    marginLeft: 5,
  },
  removeText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '500',
  },
  paidStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paidText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#10B981',
    marginLeft: 4,
  },
  pendingStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pendingText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#F59E0B',
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", // dim background
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    textAlign: "center",
    color: "#333",
  },
  noteBox: {
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 6,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  noteText: {
    color: '#92400E',
    fontSize: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  modalButton: {
    padding: 12,
    borderRadius: 6,
    minWidth: 120,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  removeConfirmButton: {
    backgroundColor: '#DC2626',
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    color: "#333",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 15,
  },
  cancelButton: {
    fontSize: 16,
    color: "#999",
    fontWeight: "500",
  },
  // inviteButtonText: {
  //   fontSize: 16,
  //   color: "#007BFF",
  //   fontWeight: "600",
  // },
  nextPaymentCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  nextPaymentGradient: {
    padding: 20,
    alignItems: 'center',
  },
  nextPaymentTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  nextPaymentDate: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  nextPaymentAmount: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  nextPaymentAmountText: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  payNowButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  payNowText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#8B5CF6',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 16,
  },
  billCard: {
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
  billIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8B5CF6' + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  billInfo: {
    flex: 1,
  },
  billDate: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  billMethod: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  billAmount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  billAmountText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginRight: 8,
  },
  subCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
  },
  subGradient: {
    padding: 20,
    borderRadius: 16,
  },
  subTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  subCountRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  subCountText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginLeft: 8,
  },
  subSubtitle: {
    color: "#E0E7FF",
    fontSize: 13,
    marginTop: 6,
  },

  subItemCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  subIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  subInfo: {
    flex: 1,
  },
  subName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  subExpiry: {
    fontSize: 13,
    color: "#6B7280",
  },
  subStatus: {
    paddingHorizontal: 10,
  },
  subStatusText: {
    fontSize: 14,
    fontWeight: "600",
  },
  noSubscriptions: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 12,
  },
  adminActions: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  adminActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    marginBottom: 16,
  },
  inputBox: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 4,
  },
  readonlyInput: {
    backgroundColor: "#F3F4F6",
    borderRadius: 6,
    padding: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  inputText: {
    fontSize: 14,
    color: "#111827",
  },
  noticeBox: {
    backgroundColor: "#FEF3C7",
    borderRadius: 6,
    padding: 10,
    marginTop: 10,
    marginBottom: 20,
  },
  noticeText: {
    fontSize: 13,
    color: "#92400E",
  },
  gotItButton: {
    backgroundColor: "#8B5CF6",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  gotItText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  adminActionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#111827',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    paddingTop: 24,
    maxHeight: '70%',
    margin: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  section: {
    paddingHorizontal: 20,
    // marginBottom: 24,
    // margin: 24,
  },
  stepTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 8,
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
    // maxWidth: '100%',
    // flexWrap: 'wrap',
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
    flexWrap: 'wrap',
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
  // continueButton: {
  //   marginTop: 16,
  //   paddingVertical: 14,
  //   paddingHorizontal: 24,
  //   borderRadius: 8,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
  // continueButtonText: {
  //   color: '#fff',
  //   fontSize: 16,
  //   fontFamily: 'Inter-Bold',
  // },
  continueButton: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 8,
    backgroundColor: "#8B5CF6",
    borderRadius: 8,
    alignItems: "center",
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  credentialsWrapper: {
    padding: 12,
    backgroundColor: "#F9FAFB", // light background for mobile clarity
    flex: 1,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 6,
  },
  stepDescription: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 14,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 1, // lighter elevation for mobile
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  platformIconBox: {
    width: 32,
    height: 32,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  platformIcon: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  planPriceTag: {
    fontSize: 12,
    fontWeight: "500",
    color: "#374151",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    marginBottom: 10,
    color: "#111827",
    backgroundColor: "#fff",
  },
  passwordField: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
  },
  passwordInput: {
    flex: 1,
    fontSize: 14,
    color: "#111827",
    paddingVertical: 10,
  },
  passwordToggle: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  backButton: {
    flex: 1,
    // paddingVertical: 12,
    marginRight: 8,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: 'center'
  },
  backButtonText: {
    color: "#111827",
    fontSize: 12,
    fontWeight: "500",
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: "#4F46E5",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 35,
    marginHorizontal: 60,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  paymentContainer: {
    // padding: 20,
    // backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    // elevation: 3,
    // marginVertical: 20,
  },

  paymentTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },

  summaryCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },

  sectionHeading: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },

  platformItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  platformLogoBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  platformLogo: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  platformName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
  },
  platformPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },

  costText: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 4,
  },
  costTotal: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginTop: 4,
    marginBottom: 12,
  },

  splitBox: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  splitText: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 2,
  },
  yourShare: {
    fontSize: 15,
    fontWeight: "700",
    color: "#8B5CF6",
    marginTop: 6,
  },

  infoNotice: {
    backgroundColor: "#EEF2FF",
    borderRadius: 8,
    padding: 12,
  },
  infoText: {
    fontSize: 13,
    color: "#4B5563",
  },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  backBtn: {
    flex: 1,
    backgroundColor: "#edf0faff",
    paddingVertical: 12,
    borderRadius: 10,
    marginRight: 8,
    alignItems: "center",
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  payBtn: {
    flex: 1,
    backgroundColor: "#8B5CF6",
    paddingVertical: 12,
    borderRadius: 10,
    marginLeft: 8,
    alignItems: "center",
  },
  payBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  settingsSection: {
    marginBottom: 24,
  },
  credentialCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  credentialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  credentialLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  credentialValue: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#111827',
  },
  viewCredentialsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  viewCredentialsText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#8B5CF6',
    marginLeft: 8,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  settingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
  },
  dangerItem: {
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  dangerText: {
    color: '#EF4444',
  },
});