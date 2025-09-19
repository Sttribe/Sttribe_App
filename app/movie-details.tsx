import React, { useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated } from "react-native";
import { useRoute } from '@react-navigation/native';
import { ArrowLeft } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";

const { height } = Dimensions.get("window");
const POSTER_HEIGHT = height * 0.65;

export default function MovieDetailsScreen() {
    const route = useRoute();
    const { item } = route.params;
    const router = useNavigation();
    const parsedItem = item;

    const scrollY = useRef(new Animated.Value(0)).current;

    const imageOpacity = scrollY.interpolate({
        inputRange: [0, POSTER_HEIGHT / 2, POSTER_HEIGHT],
        outputRange: [1, 0.4, 0.2],
        extrapolate: "clamp",
    });

    const imageTranslateY = scrollY.interpolate({
        inputRange: [0, POSTER_HEIGHT],
        outputRange: [0, -50],
        extrapolate: "clamp",
    });

    return (
        <View style={styles.container}>
            {/* Poster (background) */}
            <Animated.Image
                source={{ uri: parsedItem.thumbnail }}
                style={[
                    styles.poster,
                    {
                        opacity: imageOpacity,
                        transform: [{ translateY: imageTranslateY }],
                    },
                ]}
            />

            {/* Back Button */}
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.goBack()}
                activeOpacity={0.7}
            >
                <ArrowLeft size={24} color="#fff" />
            </TouchableOpacity>

            {/* Scroll Content */}
            <Animated.ScrollView
                contentContainerStyle={{ paddingTop: POSTER_HEIGHT - 40 }}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: true }
                )}
            >
                <View style={styles.detailsContainer}>
                    {/* Title */}
                    <Text style={styles.title}>{parsedItem.title}</Text>

                    {/* Genre */}
                    <Text style={styles.genre}>
                        {parsedItem.genre
                            ? parsedItem.genre.charAt(0).toUpperCase() + parsedItem.genre.slice(1)
                            : "N/A"}
                    </Text>

                    {/* Tags */}
                    {parsedItem.tags?.length > 0 && (
                        <View style={styles.tagsContainer}>
                            {parsedItem.tags.map((tag, index) => (
                                <View key={index} style={styles.tag}>
                                    <Text style={styles.tagText}>{tag}</Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Description */}
                    <Text style={styles.description}>
                        {parsedItem.description || "No description available."}
                    </Text>

                    {/* Meta Info */}
                    <Text style={styles.meta}>Year: {parsedItem.year || "N/A"}</Text>
                    <Text style={styles.meta}>Duration: {parsedItem.duration || "N/A"}</Text>

                    {/* Watch Now */}
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Watch Now</Text>
                    </TouchableOpacity>
                </View>
            </Animated.ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F9FAFB" },
    poster: {
        position: "absolute",
        top: 0,
        width: "100%",
        height: POSTER_HEIGHT,
        zIndex: 0,
    },
    backButton: {
        position: "absolute",
        top: 60, // adjust for status bar
        left: 16,
        zIndex: 10,
        backgroundColor: "rgba(0,0,0,0.5)",
        padding: 8,
        borderRadius: 50,
    },
    detailsContainer: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        paddingTop: 20,
        paddingBottom: 40,
        zIndex: 1,
    },
    title: {
        fontSize: 24,
        fontFamily: "Inter-Bold",
        color: "#111827",
        marginHorizontal: 20,
        marginTop: 10,
    },
    genre: {
        fontSize: 16,
        fontFamily: "Inter-Regular",
        color: "#6B7280",
        marginHorizontal: 20,
        marginBottom: 10,
    },
    tagsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginHorizontal: 20,
        marginVertical: 8,
    },
    tag: {
        backgroundColor: "#F3F4F6",
        borderRadius: 15,
        paddingVertical: 4,
        paddingHorizontal: 10,
        margin: 4,
    },
    tagText: {
        color: "#111827",
        fontSize: 12,
        fontFamily: "Inter-Regular",
    },
    description: {
        fontSize: 14,
        fontFamily: "Inter-Regular",
        color: "#4B5563",
        marginHorizontal: 20,
        marginVertical: 10,
    },
    meta: {
        fontSize: 14,
        fontFamily: "Inter-Regular",
        color: "#6B7280",
        marginHorizontal: 20,
        marginVertical: 2,
    },
    button: {
        backgroundColor: "#8B5CF6",
        padding: 14,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 20,
        marginHorizontal: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontFamily: "Inter-SemiBold",
    },
});
