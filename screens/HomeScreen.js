import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  Dimensions,
  Animated,
  PanResponder,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SWIPE_THRESHOLD = 120;

const dummyData = [
  {
    id: 1,
    name: 'Mochi',
    age: '2 years',
    breed: 'Shiba Inu',
    distance: '2 miles away',
    bio: 'Friendly and calm pup looking for playmates! Loves to cuddle on fluffy carpets.',
    images: [require('../assets/images/shiba.jpg')],
  },
  {
    id: 2,
    name: 'Charlie',
    age: '1 year',
    breed: 'French Bulldog',
    distance: '4 miles away',
    bio: 'Energetic and playful! Always ready for adventures with that signature Frenchie smile.',
    images: [require('../assets/images/frenchie.jpg')],
  },
  {
    id: 3,
    name: 'Oliver',
    age: '3 years',
    breed: 'Ginger Cat',
    distance: '1 mile away',
    bio: 'Dapper gentleman in a festive bandana. Looking for friends to share sunny spots with.',
    images: [require('../assets/images/ginger-cat.jpg')],
  },
  {
    id: 4,
    name: 'Max & Leo',
    age: '1 year',
    breed: 'Tabby Cats',
    distance: '3 miles away',
    bio: 'Inseparable siblings who love to nap together. Looking for more furry friends to join their cuddle parties!',
    images: [require('../assets/images/tabby-cats.jpg')],
  },
];

const HomeScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const position = new Animated.ValueXY();

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      position.setValue({ x: gesture.dx, y: gesture.dy });
    },
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx > SWIPE_THRESHOLD) {
        swipeRight();
      } else if (gesture.dx < -SWIPE_THRESHOLD) {
        swipeLeft();
      } else {
        resetPosition();
      }
    },
  });

  const swipeRight = () => {
    Animated.timing(position, {
      toValue: { x: SCREEN_WIDTH + 100, y: gesture.dy },
      duration: 250,
      useNativeDriver: false,
    }).start(() => nextCard());
  };

  const swipeLeft = () => {
    Animated.timing(position, {
      toValue: { x: -SCREEN_WIDTH - 100, y: gesture.dy },
      duration: 250,
      useNativeDriver: false,
    }).start(() => nextCard());
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();
  };

  const nextCard = () => {
    setCurrentIndex(currentIndex + 1);
    position.setValue({ x: 0, y: 0 });
  };

  const getCardStyle = () => {
    const rotate = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: ['-10deg', '0deg', '10deg'],
    });

    return {
      ...position.getLayout(),
      transform: [{ rotate }],
    };
  };

  const renderCard = () => {
    if (currentIndex >= dummyData.length) {
      return (
        <View style={styles.noMoreCards}>
          <Text style={styles.noMoreCardsText}>No More Pets Nearby 😢</Text>
          <Text style={styles.noMoreCardsSubText}>Check back later for new matches!</Text>
        </View>
      );
    }

    const pet = dummyData[currentIndex];

    return (
      <Animated.View
        {...panResponder.panHandlers}
        style={[styles.card, getCardStyle()]}
      >
        <Image source={pet.images[0]} style={styles.image} />
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.name}>{pet.name}, {pet.age}</Text>
            <Text style={styles.breed}>{pet.breed}</Text>
          </View>
          <Text style={styles.distance}>{pet.distance}</Text>
          <Text style={styles.bio}>{pet.bio}</Text>
        </View>

        {/* Swipe Indicators */}
        {position.x.interpolate({
          inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
          outputRange: [1, 0, 0],
        }).map(opacity => (
          <Animated.View style={[styles.nopeTag, { opacity }]}>
            <Text style={styles.tagText}>NOPE</Text>
          </Animated.View>
        ))}
        
        {position.x.interpolate({
          inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
          outputRange: [0, 0, 1],
        }).map(opacity => (
          <Animated.View style={[styles.likeTag, { opacity }]}>
            <Text style={styles.tagText}>LIKE</Text>
          </Animated.View>
        ))}
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Pawfect Match</Text>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="filter" size={24} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.featuredSection}>
          <Text style={styles.sectionTitle}>Featured Pets</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {/* Featured pets will be mapped here */}
          </ScrollView>
        </View>

        <View style={styles.nearbySection}>
          <Text style={styles.sectionTitle}>Nearby Pets</Text>
          <View style={styles.cardContainer}>
            {renderCard()}
          </View>
        </View>
      </ScrollView>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={[styles.actionButton, styles.nopeButton]}>
          <Ionicons name="close" size={30} color="#F76C6B" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.likeButton]}>
          <Ionicons name="heart" size={30} color="#4CCC93" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  filterButton: {
    padding: 8,
  },
  featuredSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  nearbySection: {
    padding: 16,
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  card: {
    width: SCREEN_WIDTH - 40,
    height: SCREEN_HEIGHT - 300,
    borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: 'absolute',
  },
  image: {
    width: '100%',
    height: '70%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  cardContent: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#363636',
  },
  breed: {
    fontSize: 16,
    color: '#757E90',
  },
  distance: {
    fontSize: 14,
    color: '#757E90',
    marginTop: 4,
  },
  bio: {
    fontSize: 16,
    color: '#363636',
    marginTop: 12,
    lineHeight: 22,
  },
  noMoreCards: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noMoreCardsText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#363636',
    textAlign: 'center',
  },
  noMoreCardsSubText: {
    fontSize: 16,
    color: '#757E90',
    marginTop: 8,
    textAlign: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 20,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  nopeTag: {
    position: 'absolute',
    top: 50,
    right: 40,
    transform: [{ rotate: '30deg' }],
  },
  likeTag: {
    position: 'absolute',
    top: 50,
    left: 40,
    transform: [{ rotate: '-30deg' }],
  },
  tagText: {
    fontSize: 32,
    fontWeight: 'bold',
    padding: 10,
    borderWidth: 4,
    borderRadius: 10,
  },
});

export default HomeScreen; 