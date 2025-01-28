import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { Ionicons } from '@expo/vector-icons';

const SCREEN_WIDTH = Dimensions.get('window').width;

const MatchScreen = () => {
  const [pets] = useState([
    {
      id: 1,
      name: 'Luna',
      age: '2 years',
      breed: 'Golden Retriever',
      distance: '2.5 km away',
      images: ['https://example.com/pet1.jpg'], // Replace with actual image URLs
    },
    // Add more pet data
  ]);

  const renderCard = (card) => {
    return (
      <View style={styles.card}>
        <Image
          source={{ uri: card.images[0] }}
          style={styles.cardImage}
        />
        <View style={styles.cardInfo}>
          <Text style={styles.petName}>{card.name}</Text>
          <Text style={styles.petDetails}>{card.breed}</Text>
          <Text style={styles.petDetails}>{card.age}</Text>
          <Text style={styles.distance}>{card.distance}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Swiper
        cards={pets}
        renderCard={renderCard}
        onSwipedLeft={(cardIndex) => {console.log('Nope')}}
        onSwipedRight={(cardIndex) => {console.log('Match!')}}
        cardIndex={0}
        backgroundColor={'#fff'}
        stackSize={2}
        cardVerticalMargin={80}
        overlayLabels={{
          left: {
            title: 'NOPE',
            style: {
              label: {
                backgroundColor: '#FF6B6B',
                color: '#fff',
                fontSize: 24
              }
            }
          },
          right: {
            title: 'MATCH',
            style: {
              label: {
                backgroundColor: '#4CCC93',
                color: '#fff',
                fontSize: 24
              }
            }
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  card: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_WIDTH * 1.2,
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
  },
  cardImage: {
    width: '100%',
    height: '70%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  cardInfo: {
    padding: 20,
  },
  petName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  petDetails: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  distance: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
});

export default MatchScreen; 