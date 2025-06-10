import { CameraView, useCameraPermissions } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { useEffect, useRef } from "react";
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
        console.error("Permission setup failed:", error);
        Alert.alert("エラー", "カメラの設定に失敗しました");
      }
    };

    setupPermissions();
  }, []); // 依存配列を空にして初回のみ実行

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
          Alert.alert("写真撮影完了", "写真がアルバムに保存されました");
        }
      } catch (error) {
        Alert.alert("エラー", "写真の撮影または保存に失敗しました");
      }
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing="back"
          ref={cameraRef}
          zoom={0}
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
          <View style={styles.instructionContainer}>
            <View style={styles.instructionBubble}>
              <Text style={styles.cameraInstructionText}>
                頭をこのラインに合わせよう
              </Text>
              <View style={styles.bubbleTail} />
            </View>
          </View>
          <View style={styles.cameraInstructionContainer}>
            <View style={styles.cameraInstructionBubble}>
              <Text style={styles.cameraInstructionText}>
                カメラは被写体と平行に
              </Text>
            </View>
          </View>
          <View style={styles.footInstructionContainer}>
            <View style={styles.footInstructionBubble}>
              <Text style={styles.cameraInstructionText}>
                足先は一番下のラインと合わせる
              </Text>
              <View style={styles.footBubbleTail} />
            </View>
          </View>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
          <View style={styles.captureButtonInner} />
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
    justifyContent: "center",
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
});
