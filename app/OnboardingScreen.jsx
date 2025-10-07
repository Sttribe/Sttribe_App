import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';
import image1 from './assets/001_Mobile-Version.png';
import image2 from './assets/002_Mobile-Version.png';
import image3 from './assets/003_Mobile-Version.png';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const onboardingData = [
  { id: '1', image: image1 },
  { id: '2', image: image2 },
  { id: '3', image: image3 },
];

export default function OnboardingScreen({ onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const navigation = useNavigation();

  const handleScroll = (event) => {
    const slideIndex = Math.round(
      event.nativeEvent.contentOffset.x / width
    );
    setCurrentIndex(slideIndex);
  };

  const scrollToNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      // Navigate to next screen when onboarding ends
      onComplete();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      }); // change to your next screen name
    }
  };

  const skipOnboarding = () => {
    onComplete();
    navigation.navigate("Login");// skip directly
  };

  const renderItem = ({ item }) => (
    <View style={styles.slide}>
      <Image
        source={item.image}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
  );

  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {onboardingData.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            currentIndex === index && styles.activeDot,
          ]}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Skip Button */}
      {currentIndex < onboardingData.length - 1 && (
        <TouchableOpacity
          style={styles.skipButton}
          onPress={skipOnboarding}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}

      {/* Image Slides */}
      <FlatList
        data={onboardingData}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        keyExtractor={(item) => item.id}
        onScroll={handleScroll}
        ref={flatListRef}
      />

      {/* Footer */}
      <View style={styles.footer}>
        {renderDots()}
        <TouchableOpacity style={styles.button} onPress={scrollToNext}>
          <Text style={styles.buttonText}>
            {currentIndex === onboardingData.length - 1
              ? 'Get Started'
              : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // optional background
  },
  slide: {
    width,
    height,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  skipText: {
    color: '#fff',
    fontSize: 14,
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    alignItems: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#fff',
    width: 20,
  },
  button: {
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});
