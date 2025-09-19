import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  Plus,
  Users,
  Search,
  MessageCircle,
  Settings,
  Crown,
  Calendar,
  IndianRupee
} from 'lucide-react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import axios from 'axios';
// import { API_BASE_URL } from "@env";
// https://api-s2onatgxwq-uc.a.run.app

export default function GroupsScreen() {
  const router = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [myGroups, setMyGroups] = useState([]);
  const [loading, setLoading] = useState(true);

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

          const tribesRes = await axios.get(
            `https://api-s2onatgxwq-uc.a.run.app/api/tribes`,
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
            Default: "#8B5CF6"
          };

          const transformed = tribesRes.data.map((tribe) => {
            const platform = tribe.platform || "";

            // ✅ Convert Firestore timestamp to JS Date
            const createdAt = tribe.createdAt?._seconds
              ? new Date(tribe.createdAt._seconds * 1000)
              : null;

            return {
              id: tribe.id,
              name: tribe.name,
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

              // ✅ Add createdAt as readable date
              createdAt: createdAt
                ? createdAt.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
                : " ",
            };
          });
          setLoading(true);
          setMyGroups(transformed);
          console.log("myGroups: ", myGroups);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching groups:", error);
        }
      };

      fetchData();
    }, []));

  const joinableGroups = [
    {
      id: 4,
      name: 'Sony LIV Fans',
      platform: 'Sony LIV',
      members: 2,
      maxMembers: 5,
      monthlyCost: 699,
      personalCost: 139.8,
      owner: 'Priya Sharma',
      image: 'https://images.pexels.com/photos/4009402/pexels-photo-4009402.jpeg?auto=compress&cs=tinysrgb&w=400',
      color: '#FF6B35',
    },
    {
      id: 5,
      name: 'Zee5 Premium',
      platform: 'Zee5',
      members: 1,
      maxMembers: 5,
      monthlyCost: 499,
      personalCost: 99.8,
      owner: 'Amit Patel',
      image: 'https://images.pexels.com/photos/3944091/pexels-photo-3944091.jpeg?auto=compress&cs=tinysrgb&w=400',
      color: '#8B5CF6',
    },
  ];

  const filteredGroups = [...myGroups, ...joinableGroups].filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.platform.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Groups</Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => router.navigate('CreateGroup')}
          >
            <Plus size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search groups or platforms..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* My Groups */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4F46E5" />
            <Text style={styles.loadingText}>Loading groups...</Text>
          </View>
        ) : myGroups.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>My Groups ({myGroups.length})</Text>
            <Text style={{ marginBottom: 16, marginTop: 8, color: '#9CA3AF' }}>Note: 1 Tribe Can contain Only One Subscription</Text>
            {myGroups.map((group) => (
              <TouchableOpacity
                key={group.id}
                style={styles.groupCard}
                onPress={() => router.navigate("GroupDetails", { id: group.id })}
              >
                <View style={styles.groupHeader}>
                  <Image source={{ uri: group.image }} style={styles.groupImage} />
                  <View style={styles.groupInfo}>
                    <View style={styles.groupTitleRow}>
                      <Text style={styles.groupName}>{group.name}</Text>
                      {group.isOwner && (
                        <Crown size={16} color="#F59E0B" />
                      )}
                    </View>
                    {/* <Text style={styles.groupPlatform}>{group.platform}</Text> */}
                    <View style={styles.groupMeta}>
                      <View style={styles.groupMembers}>
                        <Users size={14} color="#6B7280" />
                        <Text style={styles.groupMemberCount}>
                          {group.members} members
                        </Text>
                      </View>
                      <View style={styles.nextBilling}>
                        <Calendar size={14} color="#6B7280" />
                        <Text style={styles.nextBillingText}>
                          Next: {new Date(group.nextBilling).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.groupActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() =>
                      router.navigate("Chat",
                        {
                          groupId: group.id,
                          groupName: group.name,
                          memberCount: group.members,
                        })
                    }
                  >
                    <MessageCircle size={18} color="#8B5CF6" />
                  </TouchableOpacity>
                  {/* <TouchableOpacity style={styles.actionButton}>
                  <Settings size={18} color="#6B7280" />
                </TouchableOpacity> */}
                </View>

                <View style={styles.costInfo}>
                  <View style={styles.costRow}>
                    <Text style={styles.costLabel}> </Text>
                    <View style={styles.costValue}>
                      {/* <IndianRupee size={14} color="#059669" /> */}
                      <Text style={styles.costAmount}>Members</Text>
                    </View>
                  </View>
                  <View style={styles.costRow}>
                    <Text style={styles.costLabel}>Created On</Text>
                    <View style={styles.costValue}>
                      {/* <IndianRupee size={14} color="#6B7280" /> */}
                      <Text style={styles.totalAmount}>{group.createdAt}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.membersRow}>
                  <View style={styles.memberAvatars}>
                    {group.avatars.map((avatar, index) => (
                      <Image
                        key={index}
                        source={{ uri: avatar }}
                        style={[styles.memberAvatar, { marginLeft: index > 0 ? -8 : 0 }]}
                      />
                    ))}
                    {group.members > group.avatars.length && (
                      <View style={[styles.memberAvatar, styles.extraMember]}>
                        <Text style={styles.extraMemberText}>
                          +{group.members - group.avatars.length}
                        </Text>
                      </View>
                    )}
                  </View>
                  <LinearGradient
                    colors={[group.color + '20', group.color + '10']}
                    style={styles.progressBar}
                  >
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${(group.members / group.maxMembers) * 100}%`,
                          backgroundColor: group.color,
                        }
                      ]}
                    />
                  </LinearGradient>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>You don’t have any groups yet.</Text>
            <TouchableOpacity
              style={styles.createGroupButton}
              onPress={() => router.push('/create-group')}
            >
              <Text style={styles.createGroupButtonText}>+ Create Tribe</Text>
            </TouchableOpacity>
          </View>
        )}
        {/* Joinable Groups */}
        <View style={[styles.joinInfo, { flexDirection: 'column' }]}>
          <LinearGradient
            colors={["#4F46E5", "#9333EA"]}
            style={[styles.disabledButton]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.disabledButtonText}>
              Ready To Purchase via Sttribe (Coming Soon)
            </Text>
          </LinearGradient>
          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>In Version 1.2.0</Text>
          </View>
        </View>
      </ScrollView>
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
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  createButton: {
    backgroundColor: '#8B5CF6',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#6B7280",
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  groupCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  groupImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  groupInfo: {
    flex: 1,
  },
  groupTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  groupName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginRight: 8,
    marginBottom: 2
  },
  groupPlatform: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 4,
  },
  groupOwner: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  groupMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  groupMembers: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  groupMemberCount: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginLeft: 4,
  },
  nextBilling: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextBillingText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginLeft: 4,
  },
  groupActions: {
    flexDirection: 'row',
    position: 'absolute',
    top: 12,
    right: 16,
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
  costInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  costRow: {
    alignItems: 'center',
  },
  costLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 6,
  },
  costValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  costAmount: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#059669',
    marginLeft: 2,
  },
  totalAmount: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginLeft: 2,
  },
  membersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 15,
  },
  memberAvatars: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  extraMember: {
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  extraMemberText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    width: 100,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  joinableCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 12,
  },
  createGroupButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  createGroupButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  joinInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingTop: 30,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  joinCost: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  joinCostAmount: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#059669',
    marginLeft: 4,
  },
  disabledButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 12,
    opacity: 0.7, // shows it's disabled
    marginTop: 5,
  },
  disabledButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFF",
    textAlign: "center",
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  versionText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  joinButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  joinButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  availableSlots: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rechargeBadge: {
    backgroundColor: "#EEF2FF",
    borderColor: "#6366F1",
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  rechargeText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4338CA",
  },
  comingSoonText: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 2,
  },
  availableSlotsText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  slotIndicators: {
    flexDirection: 'row',
  },
  slotIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
    marginLeft: 4,
  },
});