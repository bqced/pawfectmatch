import firestore from '@react-native-firebase/firestore';
import { LocationService } from './LocationService';
import { PreferencesService } from './PreferencesService';

export class MatchingService {
  static getMatchesCollection() {
    return firestore().collection('matches');
  }

  static async findMatches(userId, userLocation) {
    try {
      // Get user's preferences
      const userPreferences = await PreferencesService.getPreferences(userId);
      
      // Get user's profile
      const userProfile = await firestore().collection('users').doc(userId).get();
      const userData = userProfile.data();

      // Get existing matches and passes to exclude
      const existingInteractions = await this.getMatchesCollection()
        .where('userId', '==', userId)
        .get();
      
      const excludeIds = existingInteractions.docs.map(doc => doc.data().targetUserId);
      excludeIds.push(userId); // Exclude self

      // Query potential matches
      let matchQuery = firestore().collection('users')
        .where('id', 'not-in', excludeIds);

      // Apply filters based on preferences
      if (userPreferences.petType !== 'any') {
        matchQuery = matchQuery.where('petType', '==', userPreferences.petType);
      }

      if (userPreferences.size !== 'any') {
        matchQuery = matchQuery.where('size', '==', userPreferences.size);
      }

      const potentialMatches = await matchQuery.get();

      // Score and filter matches
      const scoredMatches = await Promise.all(
        potentialMatches.docs.map(async (doc) => {
          const matchData = doc.data();
          const score = await this.calculateMatchScore(
            userData,
            matchData,
            userPreferences,
            userLocation
          );

          return {
            id: doc.id,
            score,
            ...matchData,
          };
        })
      );

      // Filter out low scores and sort by match score
      return scoredMatches
        .filter(match => match.score > 0.5) // Minimum match threshold
        .sort((a, b) => b.score - a.score);

    } catch (error) {
      console.error('Error finding matches:', error);
      throw error;
    }
  }

  static async calculateMatchScore(user1, user2, preferences, userLocation) {
    let score = 0;
    let factors = 0;

    // Distance score
    if (userLocation && user2.location) {
      const distance = LocationService.calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        user2.location.latitude,
        user2.location.longitude
      );
      
      const distanceScore = Math.max(0, 1 - (distance / preferences.distance));
      score += distanceScore;
      factors++;
    }

    // Breed compatibility
    if (preferences.breedPreferences.length > 0) {
      const breedScore = preferences.breedPreferences.includes(user2.breed) ? 1 : 0;
      score += breedScore;
      factors++;
    }

    // Age compatibility
    if (user2.age) {
      const ageScore = user2.age >= preferences.ageRange.min && 
                      user2.age <= preferences.ageRange.max ? 1 : 0;
      score += ageScore;
      factors++;
    }

    // Energy level compatibility
    if (preferences.energyLevel !== 'any' && user2.energyLevel) {
      const energyScore = preferences.energyLevel === user2.energyLevel ? 1 : 0;
      score += energyScore;
      factors++;
    }

    // Size compatibility
    if (preferences.size !== 'any' && user2.size) {
      const sizeScore = preferences.size === user2.size ? 1 : 0;
      score += sizeScore;
      factors++;
    }

    // Calculate final score (average of all factors)
    return factors > 0 ? score / factors : 0;
  }

  static async createMatch(userId, targetUserId, liked) {
    const matchData = {
      userId,
      targetUserId,
      liked,
      timestamp: firestore.FieldValue.serverTimestamp(),
    };

    await this.getMatchesCollection().add(matchData);

    // Check for mutual match
    if (liked) {
      const mutualMatch = await this.getMatchesCollection()
        .where('userId', '==', targetUserId)
        .where('targetUserId', '==', userId)
        .where('liked', '==', true)
        .get();

      if (!mutualMatch.empty) {
        // Create a chat for the mutual match
        const chatId = await ChatService.createChat(userId, targetUserId);
        return { isMatch: true, chatId };
      }
    }

    return { isMatch: false };
  }
} 