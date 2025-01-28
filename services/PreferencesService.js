import firestore from '@react-native-firebase/firestore';

export class PreferencesService {
  static getPreferencesCollection() {
    return firestore().collection('preferences');
  }

  static async setPreferences(userId, preferences) {
    const preferencesData = {
      userId,
      petType: preferences.petType || 'any',
      breedPreferences: preferences.breedPreferences || [],
      ageRange: preferences.ageRange || { min: 0, max: 20 },
      size: preferences.size || 'any',
      energyLevel: preferences.energyLevel || 'any',
      distance: preferences.distance || 50, // in kilometers
      gender: preferences.gender || 'any',
      updatedAt: firestore.FieldValue.serverTimestamp(),
    };

    await this.getPreferencesCollection().doc(userId).set(preferencesData);
    return preferencesData;
  }

  static async getPreferences(userId) {
    const doc = await this.getPreferencesCollection().doc(userId).get();
    return doc.exists ? doc.data() : null;
  }
} 