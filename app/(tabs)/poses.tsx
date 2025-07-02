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
    {
      id: 5,
      image: require('@/assets/poses/poses (5).png'),
    },
    {
      id: 6,
      image: require('@/assets/poses/poses (6).png'),
    },
    {
      id: 7,
      image: require('@/assets/poses/poses (7).png'),
    },
    {
      id: 8,
      image: require('@/assets/poses/poses (8).png'),
    },
    {
      id: 9,
      image: require('@/assets/poses/poses (9).png'),
    },
    {
      id: 10,
      image: require('@/assets/poses/poses (10).png'),
    },
    {
      id: 11,
      image: require('@/assets/poses/poses (11).png'),
    },
    {
      id: 12,
      image: require('@/assets/poses/poses (12).png'),
    },
    {
      id: 13,
      image: require('@/assets/poses/poses (13).png'),
    },
    {
      id: 14,
      image: require('@/assets/poses/poses (14).png'),
    },
    {
      id: 15,
      image: require('@/assets/poses/poses (15).png'),
    },
    {
      id: 16,
      image: require('@/assets/poses/poses (16).png'),
    },
    {
      id: 17,
      image: require('@/assets/poses/poses (17).png'),
    },
    {
      id: 18,
      image: require('@/assets/poses/poses (18).png'),
    },
    {
      id: 19,
      image: require('@/assets/poses/poses (19).png'),
    },
    {
      id: 20,
      image: require('@/assets/poses/poses (20).png'),
    },
    {
      id: 21,
      image: require('@/assets/poses/poses (21).png'),
    },
    {
      id: 22,
      image: require('@/assets/poses/poses (22).png'),
    },
    {
      id: 23,
      image: require('@/assets/poses/poses (23).png'),
    },
    {
      id: 24,
      image: require('@/assets/poses/poses (24).png'),
    },
    {
      id: 25,
      image: require('@/assets/poses/poses (25).png'),
    },
    {
      id: 26,
      image: require('@/assets/poses/poses (26).png'),
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
    paddingBottom: 100,
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