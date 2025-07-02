import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { Colors } from '@/constants/Colors';

const { width } = Dimensions.get('window');
const imageWidth = (width - 60) / 2;

export default function PosesScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const poses = [
    {
      id: 1,
      image: require('@/assets/poses/poses (1).png'),
    },
    {
      id: 2,
      image: require('@/assets/poses/poses (2).png'),
    },
    {
      id: 3,
      image: require('@/assets/poses/poses (3).png'),
    },
    {
      id: 4,
      image: require('@/assets/poses/poses (4).png'),
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.grid}>
          {poses.map((pose) => (
            <TouchableOpacity key={pose.id} style={[styles.poseCard, { backgroundColor: colors.background }]}>
              <Image source={pose.image} style={styles.poseImage} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  poseCard: {
    width: imageWidth,
    marginBottom: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  poseImage: {
    width: '100%',
    height: imageWidth * 1.3,
    resizeMode: 'cover',
    backgroundColor: '#e9ecef',
  },
});