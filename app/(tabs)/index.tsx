import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  Plus,
  Users,
  DollarSign,
  Bell,
  ChevronRight,
  Play,
  Star,
  CreditCard,
  Tv,
  IndianRupee,
  User
} from 'lucide-react-native';
import axios from 'axios';
// import { getAuth } from 'firebase/auth';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
// import { API_BASE_URL } from '@env';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [dashboardstats, setDashboardstats] = useState([]);
  const [recentGroups, setRecentGroups] = useState([]);
  const [freeContent, setFreeContent] = useState([]);
  const [profile, setProfile] = useState([]);
  const [refreshing, setRefreshing] = useState(false); // later reloads

  const fetchData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        // Only show big loader if nothing is cached yet
        if (recentGroups.length === 0 || freeContent.length === 0) {
          setLoading(true);
        }
      }

      const currentUser = auth().currentUser;
      if (!currentUser) {
        console.error("No user logged in");
        return;
      }

      const idToken = await currentUser.getIdToken();

      // Run all requests in parallel
      const [dashboardRes, tribesRes, profileRes, freeStreamsRes] = await Promise.all([
        axios.get(`https://api-s2onatgxwq-uc.a.run.app/api/dashboard/stats`, {
          headers: { Authorization: `Bearer ${idToken}` },
        }),
        axios.get(`https://api-s2onatgxwq-uc.a.run.app/api/tribes`, {
          headers: { Authorization: `Bearer ${idToken}` },
        }),
        axios.get(`https://api-s2onatgxwq-uc.a.run.app/api/auth/profile`, {
          headers: { Authorization: `Bearer ${idToken}` },
        }),
        axios.get(`https://api-s2onatgxwq-uc.a.run.app/api/free-streams`), // free streams might not need auth
      ]);

      // ✅ Update state
      setDashboardstats(dashboardRes.data);
      setProfile(profileRes.data);
      setFreeContent(freeStreamsRes.data);

      const platformImages = {
        Netflix:
          "https://images.pexels.com/photos/4009402/pexels-photo-4009402.jpeg?auto=compress&cs=tinysrgb&w=400",
        "Amazon Prime":
          "https://images.pexels.com/photos/3944091/pexels-photo-3944091.jpeg?auto=compress&cs=tinysrgb&w=400",
        "Disney+ Hotstar":
          "https://images.pexels.com/photos/7991669/pexels-photo-7991669.jpeg?auto=compress&cs=tinysrgb&w=400",
      };

      const transformedGroups = tribesRes.data.map((tribe) => {
        const platform = tribe.platform || "";
        return {
          id: tribe.id,
          name: tribe.name,
          platform,
          members: tribe._count?.members ?? tribe.members.length,
          avatars: tribe.members
            .map((m) => m.user?.profileImageUrl)
            .filter(Boolean)
            .slice(0, 5),
          image:
            tribe.imageUrl ||
            platformImages[platform] ||
            platformImages["Amazon Prime"],
          color: "#E50914",
        };
      });

      setRecentGroups(transformedGroups);
    } catch (error) {
      console.error("Error fetching HomeScreen data:", error);
    } finally {
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  // first time only
  useEffect(() => {
    fetchData();
  }, []);

  // 👇 Add this if you want auto refresh on screen focus without big loader
  useFocusEffect(
    useCallback(() => {
      fetchData(true);
    }, [])
  );

  const stats = [
    {
      label: 'Active Groups',
      value: dashboardstats?.activeTribes ?? 0,
      icon: Users,
      color: '#8B5CF6',
      action: () => navigation.navigate('Groups')
    },
    {
      label: 'Monthly Savings',
      value: `₹${dashboardstats?.monthlySavings ?? 0}`,
      icon: IndianRupee,
      color: '#10B981'
    },
    {
      label: 'Total Subscriptions',
      value: dashboardstats?.totalSubscriptions ?? 0,
      icon: Tv,
      color: '#F59E0B'
    },
  ];


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome!</Text>
            <Text style={styles.username}>{profile.firstName}</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.notificationBtn}>
            <User size={24} color="#6B7280" />
            {/* <View style={styles.notificationBadge} /> */}
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <Pressable onPress={stat.action} key={index} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
                <stat.icon size={20} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </Pressable>
          ))}
        </View>
        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.quickAction}
              onPress={() => navigation.navigate('CreateGroup')}
            >
              <LinearGradient
                colors={['#8B5CF6', '#A78BFA']}
                style={styles.quickActionGradient}
              >
                <Plus size={24} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.quickActionText}>Create Group</Text>
            </TouchableOpacity>
            <View style={[styles.joinInfo, { flexDirection: 'column' }]}>
              <LinearGradient
                colors={["#4F46E5", "#9333EA"]}
                style={[styles.disabledButton]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.disabledButtonText}>
                  Coming Soon: Buy Subscriptions Directly on Sttribe
                </Text>
              </LinearGradient>
              <View style={styles.versionContainer}>
                <Text style={styles.versionText}>In Version 1.2.0</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Recent Groups */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Groups</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Groups')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loader}>
              <ActivityIndicator size="large" color="#8B5CF6" />
              <Text style={styles.loaderText}>Loading your tribes...</Text>
            </View>
          ) : recentGroups.length > 0 ? (
            recentGroups.slice(0, 3).map((group) => (
              <TouchableOpacity
                key={group.id}
                style={styles.groupCard}
                onPress={() => navigation.navigate("GroupDetails", { id: group.id })}
              >
                <Image source={{ uri: group.image }} style={styles.groupImage} />
                <View style={styles.groupInfo}>
                  <Text style={styles.groupName}>{group.name}</Text>
                  <View style={styles.groupMeta}>
                    <View style={styles.groupMembers}>
                      <Users size={14} color="#6B7280" />
                      <Text style={styles.groupMemberCount}>{group.members} members</Text>
                    </View>
                    <View style={styles.memberAvatars}>
                      {(group.avatars ?? []).map((avatar, index) => (
                        <Image
                          key={index}
                          source={{ uri: avatar }}
                          style={[styles.memberAvatar, { marginLeft: index > 0 ? -8 : 0 }]}
                        />
                      ))}
                      {group.members > (group.avatars?.length ?? 0) && (
                        <View style={[styles.memberAvatar, styles.extraMember]}>
                          <Text style={styles.extraMemberText}>
                            +{group.members - (group.avatars?.length ?? 0)}
                          </Text>
                        </View>
                      )}
                      <ChevronRight size={20} color="#9CA3AF" />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>You don't have any tribes yet</Text>
              <TouchableOpacity
                style={styles.createButton}
                onPress={() => navigation.navigate("CreateGroup")}
              >
                <Text style={styles.createButtonText}>Create your tribe now</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Trending Content */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suggestions To Watch</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {freeContent.slice(0, 3).map((item) => (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('MovieDetails', { item });
                }}
                key={item.id} style={styles.trendingCard}>
                <Image source={{ uri: item.thumbnail }} style={styles.trendingImage} />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.8)']}
                  style={styles.trendingOverlay}
                />
                <View style={styles.trendingInfo}>
                  <Text style={styles.trendingTitle}>{item.title}</Text>
                  <View style={styles.trendingMeta}>
                    <Star size={12} color="#F59E0B" />
                    <Text style={styles.trendingRating}>{item.rating}</Text>
                    <Text style={styles.trendingPlatform}>{item.platform}</Text>
                  </View>
                </View>
                {/* <View style={styles.playButton}>
                  <Play size={16} color="#FFFFFF" />
                </View> */}
              </TouchableOpacity>
            ))}
          </ScrollView>
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
  greeting: {
    fontSize: 16,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
  username: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginTop: 4,
  },
  notificationBtn: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
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
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 15,
    marginTop: 20,
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  quickActionGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    textAlign: 'center',
  },
  joinInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingTop: 30,
    // borderTopWidth: 1,
    // borderTopColor: '#E5E7EB',
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
  groupCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
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
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  groupPlatform: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    // marginTop: 2,
  },
  groupMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  groupMembers: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
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
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 12,
  },
  createButton: {
    backgroundColor: "#8B5CF6",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  createButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  groupMemberCount: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginLeft: 4,
  },
  groupCost: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#059669',
  },
  trendingCard: {
    width: 200,
    height: 120,
    borderRadius: 12,
    marginRight: 16,
    position: 'relative',
    overflow: 'hidden',
    marginTop: 15,
  },
  trendingImage: {
    width: '100%',
    height: '100%',
  },
  trendingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  trendingInfo: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
  },
  trendingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  trendingMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  trendingRating: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  trendingPlatform: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#D1D5DB',
    marginLeft: 8,
  },
  playButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});