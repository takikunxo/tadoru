import AsyncStorage from "@react-native-async-storage/async-storage";
import Slider from "@react-native-community/slider";
import * as Brightness from "expo-brightness";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  Animated,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function LightScreen() {
  const [selectedColor, setSelectedColor] = useState("#FFB6C1");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [hue, setHue] = useState(350);
  const [saturation, setSaturation] = useState(50);
  const [lightness, setLightness] = useState(85);
  const [colorHistory, setColorHistory] = useState<string[]>([]);
  const [favoriteColors, setFavoriteColors] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);
  const insets = useSafeAreaInsets();

  // アニメーション用の値
  const buttonScale = new Animated.Value(1);
  const customButtonScale = new Animated.Value(1);
  const doneButtonScale = new Animated.Value(1);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Set brightness to maximum
        await Brightness.setBrightnessAsync(1.0);

        // Load saved color
        const savedColor = await AsyncStorage.getItem("selectedColor");
        if (savedColor) {
          setSelectedColor(savedColor);
        }

        // Load color history
        const savedHistory = await AsyncStorage.getItem("colorHistory");
        if (savedHistory) {
          setColorHistory(JSON.parse(savedHistory));
        }

        // Load favorite colors
        const savedFavorites = await AsyncStorage.getItem("favoriteColors");
        if (savedFavorites) {
          setFavoriteColors(JSON.parse(savedFavorites));
        }

        // Check if it's the first launch
        const hasSeenWelcome = await AsyncStorage.getItem("hasSeenWelcome");
        if (!hasSeenWelcome) {
          setShowWelcomeDialog(true);
        }
      } catch (error) {
        console.log("Could not initialize app:", error);
      }
    };
    initializeApp();
  }, []);

  const presetColors = [
    // Warm tones
    "#FFB6C1", // Light Pink
    "#FFCCCB", // Light Coral
    "#FFE4E1", // Misty Rose
    "#FFEFD5", // Papaya Whip
    "#FFFACD", // Lemon Chiffon
    "#FFF8DC", // Cornsilk
    "#F5DEB3", // Wheat
    "#F5F5DC", // Beige

    // Cool tones
    "#F0F8FF", // Alice Blue
    "#E6E6FA", // Lavender
    "#E0FFFF", // Light Cyan
    "#F0FFFF", // Azure
    "#F5FFFA", // Mint Cream
    "#F0FFF0", // Honeydew
    "#FFFAF0", // Floral White
    "#FFFFFF", // White

    // Soft pastels
    "#FFE4B5", // Moccasin
    "#FFDAB9", // Peach Puff
    "#FFE4CD", // Blanched Almond
    "#FDF5E6", // Old Lace
    "#FAF0E6", // Linen
    "#FFF5EE", // Seashell
    "#F8F8FF", // Ghost White
    "#FFFAFA", // Snow

    // Light colors for makeup
    "#FFEAA7", // Light Yellow
    "#FDCB6E", // Light Orange
    "#FD79A8", // Light Pink
    "#FDCB6E", // Peach
    "#74B9FF", // Light Blue
    "#81ECEC", // Light Turquoise
    "#A29BFE", // Light Purple
    "#FD79A8", // Rose
  ];

  const saveColor = async (color: string) => {
    try {
      await AsyncStorage.setItem("selectedColor", color);
    } catch (error) {
      console.log("Could not save color:", error);
    }
  };

  const addToHistory = async (color: string) => {
    try {
      const newHistory = [
        color,
        ...colorHistory.filter((c) => c !== color),
      ].slice(0, 20);
      setColorHistory(newHistory);
      await AsyncStorage.setItem("colorHistory", JSON.stringify(newHistory));
    } catch (error) {
      console.log("Could not save color history:", error);
    }
  };

  const toggleFavorite = async (color: string) => {
    try {
      const newFavorites = favoriteColors.includes(color)
        ? favoriteColors.filter((c) => c !== color)
        : [...favoriteColors, color];
      setFavoriteColors(newFavorites);
      await AsyncStorage.setItem(
        "favoriteColors",
        JSON.stringify(newFavorites)
      );
    } catch (error) {
      console.log("Could not save favorite colors:", error);
    }
  };

  const clearHistory = async () => {
    try {
      setColorHistory([]);
      await AsyncStorage.removeItem("colorHistory");
    } catch (error) {
      console.log("Could not clear history:", error);
    }
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    saveColor(color);
    addToHistory(color);
    setShowColorPicker(false);
  };

  const hslToHex = (h: number, s: number, l: number) => {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color)
        .toString(16)
        .padStart(2, "0");
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  const updateCustomColor = React.useCallback(() => {
    const newColor = hslToHex(hue, saturation, lightness);
    setSelectedColor(newColor);
  }, [hue, saturation, lightness]);

  const handleWelcomeClose = async () => {
    try {
      await AsyncStorage.setItem("hasSeenWelcome", "true");
      setShowWelcomeDialog(false);
    } catch (error) {
      console.log("Could not save welcome status:", error);
    }
  };

  const handleCustomColorSelected = async () => {
    // ボタンアニメーション
    Animated.sequence([
      Animated.timing(doneButtonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(doneButtonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    const newColor = hslToHex(hue, saturation, lightness);
    setSelectedColor(newColor);
    await saveColor(newColor);
    await addToHistory(newColor);
    setShowCustomPicker(false);
    setShowColorPicker(false);
  };

  const toggleColorPicker = () => {
    // ボタンアニメーション
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    setShowColorPicker(!showColorPicker);
    setShowCustomPicker(false);
  };

  const showCustomColorPicker = () => {
    // カスタムボタンアニメーション
    Animated.sequence([
      Animated.timing(customButtonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(customButtonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    setShowCustomPicker(true);
    setShowColorPicker(false);
  };

  useEffect(() => {
    if (showCustomPicker) {
      updateCustomColor();
    }
  }, [hue, saturation, lightness, showCustomPicker, updateCustomColor]);

  return (
    <View style={[styles.container, { backgroundColor: selectedColor }]}>
      <StatusBar hidden />

      <Animated.View
        style={[
          styles.colorButton,
          { top: insets.top + 20, transform: [{ scale: buttonScale }] },
        ]}
      >
        <TouchableOpacity
          style={styles.colorButtonTouchable}
          onPress={toggleColorPicker}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["rgba(255, 255, 255, 0.3)", "rgba(255, 255, 255, 0.1)"]}
            style={styles.colorButtonGradient}
          >
            <View
              style={[
                styles.colorButtonInner,
                { backgroundColor: selectedColor },
              ]}
            />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      {showColorPicker && (
        <View style={styles.colorPickerOverlay}>
          <TouchableOpacity
            style={styles.overlayBackground}
            onPress={toggleColorPicker}
            activeOpacity={1}
          />
          <View style={styles.colorPickerContainer}>
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[
                  styles.tab,
                  !showHistory && !showFavorites && styles.activeTab,
                ]}
                onPress={() => {
                  setShowHistory(false);
                  setShowFavorites(false);
                }}
              >
                <Text
                  style={[
                    styles.tabText,
                    !showHistory && !showFavorites && styles.activeTabText,
                  ]}
                >
                  プリセット
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, showHistory && styles.activeTab]}
                onPress={() => {
                  setShowHistory(true);
                  setShowFavorites(false);
                }}
              >
                <Text
                  style={[styles.tabText, showHistory && styles.activeTabText]}
                >
                  履歴
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, showFavorites && styles.activeTab]}
                onPress={() => {
                  setShowFavorites(true);
                  setShowHistory(false);
                }}
              >
                <Text
                  style={[
                    styles.tabText,
                    showFavorites && styles.activeTabText,
                  ]}
                >
                  お気に入り
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.colorScrollView}
              showsVerticalScrollIndicator={false}
            >
              {showHistory ? (
                <View>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>カラー履歴</Text>
                    {colorHistory.length > 0 && (
                      <TouchableOpacity onPress={clearHistory}>
                        <Text style={styles.clearButton}>クリア</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  {colorHistory.length === 0 ? (
                    <Text style={styles.emptyText}>履歴がありません</Text>
                  ) : (
                    <View style={styles.colorGrid}>
                      {colorHistory.map((color, index) => (
                        <TouchableOpacity
                          key={index}
                          style={[
                            styles.colorOption,
                            { backgroundColor: color },
                            selectedColor.toLowerCase() ===
                              color.toLowerCase() && styles.selectedColorOption,
                          ]}
                          onPress={() => handleColorSelect(color)}
                          onLongPress={() => toggleFavorite(color)}
                          activeOpacity={0.8}
                        >
                          {selectedColor.toLowerCase() ===
                            color.toLowerCase() && (
                            <View style={styles.selectedIndicator}>
                              <Text style={styles.checkmark}>✓</Text>
                            </View>
                          )}
                          {favoriteColors.includes(color) && (
                            <View style={styles.favoriteIndicator}>
                              <Text style={styles.favoriteIcon}>♥</Text>
                            </View>
                          )}
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              ) : showFavorites ? (
                <View>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>お気に入り</Text>
                  </View>
                  {favoriteColors.length === 0 ? (
                    <Text style={styles.emptyText}>お気に入りがありません</Text>
                  ) : (
                    <View style={styles.colorGrid}>
                      {favoriteColors.map((color, index) => (
                        <TouchableOpacity
                          key={index}
                          style={[
                            styles.colorOption,
                            { backgroundColor: color },
                            selectedColor.toLowerCase() ===
                              color.toLowerCase() && styles.selectedColorOption,
                          ]}
                          onPress={() => handleColorSelect(color)}
                          onLongPress={() => toggleFavorite(color)}
                          activeOpacity={0.8}
                        >
                          {selectedColor.toLowerCase() ===
                            color.toLowerCase() && (
                            <View style={styles.selectedIndicator}>
                              <Text style={styles.checkmark}>✓</Text>
                            </View>
                          )}
                          <View style={styles.favoriteIndicator}>
                            <Text style={styles.favoriteIcon}>♥</Text>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              ) : (
                <View style={styles.colorGrid}>
                  {presetColors.map((color, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.colorOption,
                        { backgroundColor: color },
                        selectedColor.toLowerCase() === color.toLowerCase() &&
                          styles.selectedColorOption,
                      ]}
                      onPress={() => handleColorSelect(color)}
                      onLongPress={() => toggleFavorite(color)}
                      activeOpacity={0.8}
                    >
                      {selectedColor.toLowerCase() === color.toLowerCase() && (
                        <View style={styles.selectedIndicator}>
                          <Text style={styles.checkmark}>✓</Text>
                        </View>
                      )}
                      {favoriteColors.includes(color) && (
                        <View style={styles.favoriteIndicator}>
                          <Text style={styles.favoriteIcon}>♥</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </ScrollView>
            <Animated.View
              style={{ transform: [{ scale: customButtonScale }] }}
            >
              <TouchableOpacity
                style={styles.customColorButton}
                onPress={showCustomColorPicker}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#FFB6C1", "#FFC0CB"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.customColorButtonGradient}
                >
                  <Text style={styles.customColorButtonText}>
                    カスタムカラー
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      )}

      {showCustomPicker && (
        <View style={styles.colorPickerOverlay}>
          <TouchableOpacity
            style={styles.overlayBackground}
            onPress={() => setShowCustomPicker(false)}
            activeOpacity={1}
          />
          <View style={styles.customPickerContainer}>
            <View style={styles.colorPreview}>
              <View
                style={[
                  styles.colorPreviewBox,
                  { backgroundColor: selectedColor },
                ]}
              />
            </View>

            <View style={styles.sliderContainer}>
              <Text style={styles.sliderLabel}>色相 ({Math.round(hue)}°)</Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={360}
                value={hue}
                onValueChange={setHue}
                minimumTrackTintColor="#FF6B6B"
                maximumTrackTintColor="#d3d3d3"
                thumbStyle={styles.sliderThumb}
              />
            </View>

            <View style={styles.sliderContainer}>
              <Text style={styles.sliderLabel}>
                彩度 ({Math.round(saturation)}%)
              </Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={100}
                value={saturation}
                onValueChange={setSaturation}
                minimumTrackTintColor="#4ECDC4"
                maximumTrackTintColor="#d3d3d3"
                thumbStyle={styles.sliderThumb}
              />
            </View>

            <View style={styles.sliderContainer}>
              <Text style={styles.sliderLabel}>
                明度 ({Math.round(lightness)}%)
              </Text>
              <Slider
                style={styles.slider}
                minimumValue={10}
                maximumValue={100}
                value={lightness}
                onValueChange={setLightness}
                minimumTrackTintColor="#FFE66D"
                maximumTrackTintColor="#d3d3d3"
                thumbStyle={styles.sliderThumb}
              />
            </View>

            <Animated.View style={{ transform: [{ scale: doneButtonScale }] }}>
              <TouchableOpacity
                style={styles.doneButton}
                onPress={handleCustomColorSelected}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#FFB6C1", "#FF69B4"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.doneButtonGradient}
                >
                  <Text style={styles.doneButtonText}>完了</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      )}

      {showWelcomeDialog && (
        <View style={styles.welcomeOverlay}>
          <TouchableOpacity
            style={styles.overlayBackground}
            onPress={handleWelcomeClose}
            activeOpacity={1}
          />
          <View style={styles.welcomeContainer}>
            <View style={styles.welcomeContent}>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>📸</Text>
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>撮影時の補助光</Text>
                  <Text style={styles.featureDescription}>
                    撮影される方が顔の近くでアプリを開くことで、美しい補助光として機能
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.welcomeButton}
              onPress={handleWelcomeClose}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#FFB6C1", "#FF69B4"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.welcomeButtonGradient}
              >
                <Text style={styles.welcomeButtonText}>始める</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  colorButton: {
    position: "absolute",
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  colorButtonTouchable: {
    width: "100%",
    height: "100%",
    borderRadius: 28,
    overflow: "hidden",
  },
  colorButtonGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  colorButtonInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.9)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  colorPickerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  overlayBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  colorPickerContainer: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 24,
    margin: 20,
    maxHeight: "80%",
    minWidth: 320,
    width: "85%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    color: "#333",
  },
  colorScrollView: {
    maxHeight: 300,
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
    paddingBottom: 10,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedColorOption: {
    // 選択状態のボーダーを削除
  },
  selectedIndicator: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
  },
  checkmark: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  customColorButton: {
    borderRadius: 16,
    marginTop: 20,
    overflow: "hidden",
    shadowColor: "#FFB6C1",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  customColorButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  customColorButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  customPickerContainer: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 24,
    margin: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
  colorPreview: {
    alignItems: "center",
    marginBottom: 24,
  },
  colorPreviewBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  sliderContainer: {
    marginBottom: 24,
  },
  sliderLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
    textAlign: "center",
  },
  slider: {
    width: "100%",
    height: 40,
  },
  sliderThumb: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#007AFF",
    width: 24,
    height: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  doneButton: {
    borderRadius: 16,
    marginTop: 16,
    overflow: "hidden",
    shadowColor: "#FF69B4",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  doneButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: "center",
  },
  doneButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#FFB6C1",
    shadowColor: "#FFB6C1",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  activeTabText: {
    color: "white",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  clearButton: {
    color: "#FF6B6B",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    fontSize: 14,
    marginTop: 40,
    marginBottom: 40,
  },
  favoriteIndicator: {
    position: "absolute",
    top: -5,
    right: -5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  favoriteIcon: {
    color: "#FF6B6B",
    fontSize: 12,
    fontWeight: "bold",
  },
  welcomeOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  welcomeContainer: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 24,
    margin: 20,
    maxHeight: "90%",
    width: "90%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
  welcomeHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  welcomeContent: {
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 16,
    width: 32,
    textAlign: "center",
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  welcomeButton: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#FF69B4",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  welcomeButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: "center",
  },
  welcomeButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
