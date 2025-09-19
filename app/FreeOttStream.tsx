import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    SafeAreaView,
} from "react-native";
import { Search, ArrowLeft } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";

export default function FreeOttStream() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [freeContent, setFreeContent] = useState([]);
    const [categories, setCategories] = useState(["All"]);
    const [loading, setLoading] = useState(true);
    const router = useNavigation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await axios.get(
                    "https://api-s2onatgxwq-uc.a.run.app/api/free-streams"
                );
                setFreeContent(res.data);
            } catch (error) {
                console.error("Error fetching free streams:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (freeContent.length > 0) {
            const uniqueGenres = [
                ...new Set(
                    freeContent.map(
                        (item) =>
                            item.genre?.charAt(0).toUpperCase() + item.genre?.slice(1)
                    )
                ),
            ];
            setCategories(["All", ...uniqueGenres]);
        }
    }, [freeContent]);

    const filteredContent = freeContent.filter((item) => {
        const matchesCategory =
            selectedCategory === "All" ||
            item.genre?.toLowerCase().includes(
                selectedCategory.toLowerCase().slice(0, -1)
            );

        const matchesSearch =
            item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.platform?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.genre?.toLowerCase().includes(selectedCategory.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.goBack()} style={styles.backButton}>
                    <ArrowLeft size={24} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Free to Watch</Text>
                <View style={{ width: 24 }} /> {/* placeholder for spacing */}
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                {/* Categories */}
                <View style={styles.categoriesContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {categories.map((category) => (
                            <TouchableOpacity
                                key={category}
                                style={[
                                    styles.categoryButton,
                                    selectedCategory === category && styles.categoryButtonActive,
                                ]}
                                onPress={() => setSelectedCategory(category)}
                            >
                                <Text
                                    style={[
                                        styles.categoryButtonText,
                                        selectedCategory === category &&
                                        styles.categoryButtonTextActive,
                                    ]}
                                >
                                    {category || "Unknown"} {/* Added fallback */}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Free Content */}
                <View style={styles.section}>
                    {loading ? (
                        <ActivityIndicator size="large" color="#8B5CF6" />
                    ) : (
                        <View
                            style={{
                                flexDirection: "row",
                                flexWrap: "wrap",
                                justifyContent: "space-between",
                            }}
                        >
                            {filteredContent.map((item) => (
                                <TouchableOpacity
                                    onPress={() => {
                                        router.navigate('MovieDetails', { item });
                                    }}
                                    key={item.id}
                                    style={styles.contentCard}
                                >
                                    <Image
                                        source={{ uri: item.thumbnail }}
                                        style={styles.contentImage}
                                    />
                                    <View style={styles.contentInfo}>
                                        <Text style={styles.contentTitle} numberOfLines={2}>
                                            {item.title || "Untitled"} {/* Added fallback */}
                                        </Text>
                                        <Text style={styles.metaText}>
                                            {item.genre || "Unknown genre"} {/* Added fallback */}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F9FAFB" },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between", // Changed to space-between for better alignment
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 16,
    },
    backButton: { padding: 4 },
    headerTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#111827",
        textAlign: "center", // Center the title
        flex: 1, // Take available space
        marginHorizontal: 10, // Add some spacing
    },
    categoriesContainer: { paddingHorizontal: 20, marginBottom: 24 },
    categoryButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: "#FFFFFF",
        marginRight: 12,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    categoryButtonActive: {
        backgroundColor: "#8B5CF6",
        borderColor: "#8B5CF6",
    },
    categoryButtonText: {
        fontSize: 14,
        color: "#6B7280",
        fontWeight: "500", // Added for better readability
    },
    categoryButtonTextActive: {
        color: "#FFFFFF",
        fontWeight: "600", // Added for better readability
    },
    section: { paddingHorizontal: 20, marginBottom: 2 },
    contentCard: {
        width: "48%",
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        marginBottom: 16,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    contentImage: {
        width: "100%",
        height: 200,
        resizeMode: "cover", // Ensure images are properly scaled
    },
    contentInfo: { padding: 8 },
    contentTitle: {
        fontSize: 14,
        fontWeight: "600",
        color: "#111827",
        marginBottom: 4,
    },
    metaText: {
        fontSize: 12,
        color: "#6B7280",
    },
});