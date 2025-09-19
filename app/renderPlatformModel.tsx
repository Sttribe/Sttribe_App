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
                                        You're paying only your share (₹{perMemberCost}). Other tribe members will be notified to pay their share.
                                        <br />
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
                                        console.log("Proceeding with payment of ₹64.00");
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

const styles = {
    
}