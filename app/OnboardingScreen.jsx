import { useNavigation } from '@react-navigation/native';
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  FlatList,
  TouchableOpacity,
  StatusBar,
  SafeAreaView
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

const OnboardingScreen = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);
  const navigation = useNavigation();

  const onboardingData = [
    {
      id: '1',
      title: 'Create Groups',
      description: 'Easily create groups for family, friends, or colleagues and invite them to join your Sttribe community.',
      icon: '👥',
      gradient: ['#667eea', '#764ba2'],
    },
    {
      id: '2',
      title: 'Share Subscriptions',
      description: 'Share your favorite subscriptions with your groups and split costs effortlessly.',
      icon: '📱',
      gradient: ['#f093fb', '#f5576c'],
    },
    {
      id: '3',
      title: 'Manage Payments',
      description: 'Get notified about payments and manage all your shared subscriptions in one place.',
      icon: '💳',
      gradient: ['#4facfe', '#00f2fe'],
    },
  ];

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollTo = () => {
    if (currentIndex < onboardingData.length - 1) {
      slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      onComplete();
      navigation.navigate('Login');
    }
  };
  const skipOnboarding = () => {
    onComplete();
    navigation.navigate('Login');
  };

  const renderItem = ({ item }) => {
    return (
      <View style={[styles.slide, { width }]}>
        {/* Background gradient */}
        <LinearGradient
          colors={item.gradient}
          style={styles.backgroundGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />

        {/* Decorative background circles */}
        <View style={styles.backgroundElements}>
          <View style={[styles.bgCircle, { top: '10%', left: '8%', backgroundColor: 'rgba(255,255,255,0.1)' }]} />
          <View style={[styles.bgCircle, { top: '60%', right: '5%', backgroundColor: 'rgba(255,255,255,0.08)' }]} />
          <View style={[styles.bgCircle, { bottom: '20%', left: '10%', backgroundColor: 'rgba(255,255,255,0.06)' }]} />
        </View>

        {/* Icon inside glassy circle */}
        <View style={styles.illustrationContainer}>
          <LinearGradient
            colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.05)']}
            style={styles.circleGradient}
          >
            <View style={styles.circle}>
              <Text style={styles.icon}>{item.icon}</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Text content */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    );
  };

  const renderDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {onboardingData.map((_, i) => {
          const inputRange = [(i - 1) * width, i * width, (i + 1) * width];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 24, 8],
            extrapolate: 'clamp'
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp'
          });

          return (
            <Animated.View
              key={i.toString()}
              style={[
                styles.dot,
                {
                  width: dotWidth,
                  opacity
                }
              ]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <LinearGradient
      colors={onboardingData[currentIndex].gradient}   // 🌟 Entire screen matches current slide
      style={styles.container}
    >
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Skip Button */}
      <TouchableOpacity style={styles.skipButtonTop} onPress={skipOnboarding}>
        <Text style={styles.skipTextTop}>Skip</Text>
      </TouchableOpacity>

      {/* Slides */}
      <FlatList
        data={onboardingData}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={32}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        ref={slidesRef}
      />

      {/* Footer */}
      <View style={styles.footer}>
        {renderDots()}

        <TouchableOpacity style={styles.button} onPress={scrollTo}>
          <LinearGradient
            colors={onboardingData[currentIndex].gradient}  // 🌟 Button matches current slide
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>
              {currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Next'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  slide: { justifyContent: 'center', alignItems: 'center' },
  backgroundGradient: { ...StyleSheet.absoluteFillObject },
  backgroundElements: { ...StyleSheet.absoluteFillObject },
  bgCircle: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  illustrationContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  circleGradient: {
    width: 220,
    height: 220,
    borderRadius: 110,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  circle: {
    width: '100%',
    height: '100%',
    borderRadius: 110,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  icon: { fontSize: 80, color: '#fff' },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  title: { fontSize: 30, fontWeight: 'bold', color: '#fff', marginBottom: 12, textAlign: 'center' },
  description: { fontSize: 16, color: 'rgba(255,255,255,0.85)', textAlign: 'center', lineHeight: 24 },
  footer: {
    height: height * 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  dotsContainer: { flexDirection: 'row', marginBottom: 25 },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.9)',
    marginHorizontal: 5,
  },
  button: { width: '80%', borderRadius: 30, overflow: 'hidden' },
  buttonGradient: {
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 30,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  skipButtonTop: {
    position: 'absolute',
    top: StatusBar.currentHeight ? StatusBar.currentHeight + 15 : 30,
    right: 20,
    zIndex: 10,
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  skipTextTop: { color: '#fff', fontSize: 16 },
});

export default OnboardingScreen;
