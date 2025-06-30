import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import * as Speech from "expo-speech";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaLibraryPermission, requestMediaLibraryPermission] =
    MediaLibrary.usePermissions();
  const cameraRef = useRef<CameraView>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(0.1);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [annotationsEnabled, setAnnotationsEnabled] = useState(false);
  const [burstMode, setBurstMode] = useState(false);
  const [burstCount, setBurstCount] = useState(0);
  const [isBurstActive, setIsBurstActive] = useState(false);
  const [shootingMode, setShootingMode] = useState<"body" | "face">("body");
  const [timerDuration, setTimerDuration] = useState(0);

  useEffect(() => {
    const setupPermissions = async () => {
      try {
        // カメラのパーミッションを先に確認
        if (!permission?.granted) {
          const cameraResult = await requestPermission();
          if (!cameraResult.granted) {
            return; // カメラのパーミッションが拒否された場合は終了
          }
        }

        // カメラのパーミッションが許可された後にメディアライブラリのパーミッションを確認
        if (!mediaLibraryPermission?.granted) {
          const mediaResult = await requestMediaLibraryPermission();
          if (!mediaResult.granted) {
            Alert.alert("エラー", "写真の保存に必要な許可が拒否されました");
            return;
          }
        }
      } catch (error) {
        console.error(error);
        Alert.alert("エラー", "カメラの設定に失敗しました");
      }
    };

    setupPermissions();
  }, [
    mediaLibraryPermission?.granted,
    permission?.granted,
    requestMediaLibraryPermission,
    requestPermission,
  ]); // 依存配列を空にして初回のみ実行

  useFocusEffect(
    React.useCallback(() => {
      loadSettings();
    }, [])
  );

  const loadSettings = async () => {
    try {
      const voice = await AsyncStorage.getItem("voiceEnabled");
      const annotations = await AsyncStorage.getItem("annotationsEnabled");
      const timer = await AsyncStorage.getItem("timerDuration");

      if (voice !== null) {
        setVoiceEnabled(JSON.parse(voice));
      }
      if (annotations !== null) {
        setAnnotationsEnabled(JSON.parse(annotations));
      }
      if (timer !== null) {
        setTimerDuration(JSON.parse(timer));
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>カメラの初期化中...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>カメラの使用許可が必要です</Text>
      </View>
    );
  }

  if (!mediaLibraryPermission?.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>写真の保存に必要な許可が必要です</Text>
      </View>
    );
  }

  async function takePicture() {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        if (photo) {
          await MediaLibrary.saveToLibraryAsync(photo.uri);
        }
      } catch {
        Alert.alert("エラー", "写真の撮影または保存に失敗しました");
      }
    }
  }

  async function takeBurstPhotos() {
    if (!cameraRef.current || isBurstActive) return;

    setIsBurstActive(true);
    setBurstCount(0);

    const totalShots = 5;

    for (let i = 0; i < totalShots; i++) {
      try {
        setBurstCount(i + 1);
        const photo = await cameraRef.current.takePictureAsync();
        if (photo) {
          await MediaLibrary.saveToLibraryAsync(photo.uri);
        }

        if (i < totalShots - 1) {
          await new Promise((resolve) => setTimeout(resolve, 50));
        }
      } catch (error) {
        console.error(error);
      }
    }

    setIsBurstActive(false);
    setBurstCount(0);
  }

  function startCountdown() {
    if (isTimerActive) return;

    if (timerDuration === 0) {
      // タイマーなしの場合は即座に撮影
      burstMode ? takeBurstPhotos() : takePicture();
      return;
    }

    setIsTimerActive(true);
    setCountdown(timerDuration);
    if (voiceEnabled) {
      Speech.stop();
      Speech.speak(timerDuration.toString(), { language: "ja", volume: 1.0 });
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          setIsTimerActive(false);
          setCountdown(null);
          setTimeout(
            () => (burstMode ? takeBurstPhotos() : takePicture()),
            200
          );
          return null;
        }
        const newCount = prev - 1;
        if (voiceEnabled) {
          Speech.stop();
          Speech.speak(newCount.toString(), { language: "ja", volume: 1.0 });
        }
        return newCount;
      });
    }, 1000);
  }

  function toggleZoom() {
    setZoomLevel((prev) => (prev === 0.1 ? 0 : 0.1));
  }

  return (
    <View style={styles.container}>
      <View style={styles.modeToggleContainer}>
        <TouchableOpacity
          style={[
            styles.modeToggleButton,
            shootingMode === "body" && styles.modeToggleButtonActive,
          ]}
          onPress={() => setShootingMode("body")}
          disabled={isTimerActive || isBurstActive}
        >
          <Text
            style={[
              styles.modeToggleText,
              shootingMode === "body" && styles.modeToggleTextActive,
            ]}
          >
            全身撮影
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.modeToggleButton,
            shootingMode === "face" && styles.modeToggleButtonActive,
          ]}
          onPress={() => setShootingMode("face")}
          disabled={isTimerActive || isBurstActive}
        >
          <Text
            style={[
              styles.modeToggleText,
              shootingMode === "face" && styles.modeToggleTextActive,
            ]}
          >
            顔写真
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing="back"
          ref={cameraRef}
          zoom={zoomLevel}
        />
        <View style={styles.gridOverlay}>
          <View style={[styles.gridLine, { left: "33.33%" }]} />
          <View style={[styles.gridLine, { left: "66.66%" }]} />
          <View
            style={[
              styles.gridLine,
              styles.gridLineHorizontal,
              { top: "33.33%" },
            ]}
          />
          <View
            style={[
              styles.gridLine,
              styles.gridLineHorizontal,
              { top: "66.66%" },
            ]}
          />
          {shootingMode === "face" && <View style={styles.faceGuideBox} />}
          {annotationsEnabled && (
            <>
              {shootingMode === "body" ? (
                <>
                  <View style={styles.instructionContainer}>
                    <View style={styles.instructionBubble}>
                      <Text style={styles.cameraInstructionText}>
                        頭のてっぺんがこのラインにくるように🙎
                      </Text>
                      <View style={styles.bubbleTail} />
                    </View>
                  </View>
                  <View style={styles.cameraInstructionContainer}>
                    <View style={styles.cameraInstructionBubble}>
                      <Text style={styles.cameraInstructionText}>
                        カメラはまっすぐ、斜めにならないように✨
                      </Text>
                    </View>
                  </View>
                  <View style={styles.footInstructionContainer}>
                    <View style={styles.footInstructionBubble}>
                      <Text style={styles.cameraInstructionText}>
                        つま先はこの線にピッタリ合わせよう👣
                      </Text>
                      <View style={styles.footBubbleTail} />
                    </View>
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.faceInstructionContainer}>
                    <View style={styles.faceInstructionBubble}>
                      <Text style={styles.cameraInstructionText}>
                        顔が中央の枠に収まるように👤
                      </Text>
                      <View style={styles.faceBubbleTail} />
                    </View>
                  </View>
                  <View style={styles.faceCameraInstructionContainer}>
                    <View style={styles.faceCameraInstructionBubble}>
                      <Text style={styles.cameraInstructionText}>
                        目線をカメラに向けて📸
                      </Text>
                    </View>
                  </View>
                </>
              )}
            </>
          )}
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.zoomButton}
          onPress={toggleZoom}
          disabled={isTimerActive || isBurstActive}
        >
          <View style={styles.zoomButtonInner}>
            <Ionicons
              name={zoomLevel === 0 ? "contract-outline" : "expand-outline"}
              size={24}
              color="#fff"
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.captureButton,
            (isTimerActive || isBurstActive) && styles.captureButtonActive,
          ]}
          onPress={startCountdown}
          disabled={isTimerActive || isBurstActive}
        >
          <View style={styles.captureButtonInner}>
            {countdown ? (
              <Text style={styles.countdownText}>{countdown}</Text>
            ) : isBurstActive ? (
              <Text style={styles.burstCountText}>{burstCount}/5</Text>
            ) : (
              <Ionicons
                name={burstMode ? "albums" : "camera"}
                size={32}
                color="#000"
              />
            )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.burstToggleButton,
            burstMode && styles.burstToggleButtonActive,
          ]}
          onPress={() => setBurstMode(!burstMode)}
          disabled={isTimerActive || isBurstActive}
        >
          <View style={styles.burstToggleButtonInner}>
            <Ionicons
              name="camera-outline"
              size={20}
              color={burstMode ? "#000" : "#fff"}
            />
            <Text
              style={[
                styles.burstToggleText,
                burstMode && styles.burstToggleTextActive,
              ]}
            >
              連写
            </Text>
            <Text
              style={[
                styles.burstToggleText,
                burstMode && styles.burstToggleTextActive,
              ]}
            >
              モード
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const { width } = Dimensions.get("window");
const cameraHeight = (width * 16) / 9;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
    fontSize: 16,
    color: "#fff",
  },
  cameraContainer: {
    width: width,
    height: cameraHeight,
    alignSelf: "center",
    position: "absolute",
    bottom: 80,
  },
  camera: {
    flex: 1,
  },
  gridOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: "none",
  },
  gridLine: {
    position: "absolute",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    width: 1,
    height: "100%",
  },
  gridLineHorizontal: {
    width: "100%",
    height: 1,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 100,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: "transparent",
    paddingHorizontal: 20,
    justifyContent: "space-between",
    alignItems: "center",
  },
  captureButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 36.5,
    width: 73,
    height: 73,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  captureButtonInner: {
    backgroundColor: "white",
    borderRadius: 32.5,
    width: 65,
    height: 65,
    borderWidth: 2,
    borderColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  captureButtonActive: {
    backgroundColor: "#ff6b6b",
  },
  countdownText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  instructionContainer: {
    position: "absolute",
    top: "25%",
    alignSelf: "center",
    alignItems: "center",
  },
  instructionBubble: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    position: "relative",
  },
  instructionText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  bubbleTail: {
    position: "absolute",
    bottom: -8,
    alignSelf: "center",
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "rgba(0, 0, 0, 0.6)",
  },
  arrow: {
    fontSize: 28,
    marginTop: 8,
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  cameraInstructionContainer: {
    position: "absolute",
    top: "60%",
    right: "10%",
    alignItems: "center",
  },
  cameraInstructionBubble: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  cameraInstructionText: {
    color: "white",
    fontSize: 11,
    fontWeight: "500",
    textAlign: "center",
  },
  footInstructionContainer: {
    position: "absolute",
    bottom: 150,
    alignSelf: "center",
    alignItems: "center",
  },
  footInstructionBubble: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    position: "relative",
  },
  footBubbleTail: {
    position: "absolute",
    bottom: -8,
    alignSelf: "center",
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "rgba(0, 0, 0, 0.6)",
  },
  zoomButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 25,
    width: 50,
    height: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  zoomButtonInner: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  spacer: {
    width: 50,
  },
  burstCountText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  burstToggleButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 25,
    width: 50,
    height: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  burstToggleButtonActive: {
    backgroundColor: "#fff",
  },
  burstToggleButtonInner: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  burstToggleText: {
    fontSize: 8,
    fontWeight: "600",
    color: "#fff",
    marginTop: 2,
  },
  burstToggleTextActive: {
    color: "#000",
  },
  modeToggleContainer: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    zIndex: 1,
  },
  modeToggleButton: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  modeToggleButtonActive: {
    backgroundColor: "#fff",
  },
  modeToggleText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  modeToggleTextActive: {
    color: "#000",
  },
  faceGuideBox: {
    position: "absolute",
    left: "33.33%",
    top: "33.33%",
    width: "33.34%",
    height: "33.34%",
    borderWidth: 3,
    borderColor: "#ff6b6b",
    borderRadius: 10,
    backgroundColor: "rgba(255, 107, 107, 0.1)",
  },
  faceInstructionContainer: {
    position: "absolute",
    top: "20%",
    alignSelf: "center",
    alignItems: "center",
  },
  faceInstructionBubble: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    position: "relative",
  },
  faceBubbleTail: {
    position: "absolute",
    bottom: -8,
    alignSelf: "center",
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "rgba(0, 0, 0, 0.6)",
  },
  faceCameraInstructionContainer: {
    position: "absolute",
    top: "75%",
    right: "10%",
    alignItems: "center",
  },
  faceCameraInstructionBubble: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});
