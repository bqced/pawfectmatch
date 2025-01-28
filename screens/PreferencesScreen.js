import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Switch,
  Slider
} from 'react-native';
import { PreferencesService } from '../services/PreferencesService';
import { useAuth } from '../contexts/AuthContext';

const PreferencesScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState({
    petType: 'any',
    breedPreferences: [],
    ageRange: { min: 0, max: 20 },
    size: 'any',
    energyLevel: 'any',
    distance: 50,
    gender: 'any',
  });

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const userPreferences = await PreferencesService.getPreferences(user.id);
      if (userPreferences) {
        setPreferences(userPreferences);
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const savePreferences = async () => {
    try {
      await PreferencesService.setPreferences(user.id, preferences);
      navigation.goBack();
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pet Type</Text>
        <View style={styles.optionsContainer}>
          {['any', 'dog', 'cat', 'other'].map(type => (
            <TouchableOpacity
              key={type}
              style={[
                styles.option,
                preferences.petType === type && styles.selectedOption
              ]}
              onPress={() => setPreferences({...preferences, petType: type})}
            >
              <Text style={[
                styles.optionText,
                preferences.petType === type && styles.selectedOptionText
              ]}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Distance (km): {preferences.distance}</Text>
        <Slider
          value={preferences.distance}
          onValueChange={(value) => setPreferences({...preferences, distance: value})}
          minimumValue={1}
          maximumValue={100}
          step={1}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Age Range</Text>
        <View style={styles.ageRangeContainer}>
          <Slider
            style={styles.ageSlider}
            value={preferences.ageRange.min}
            onValueChange={(value) => setPreferences({
              ...preferences,
              ageRange: {...preferences.ageRange, min: value}
            })}
            minimumValue={0}
            maximumValue={20}
            step={1}
          />
          <Text>Min: {preferences.ageRange.min} years</Text>
          <Slider
            style={styles.ageSlider}
            value={preferences.ageRange.max}
            onValueChange={(value) => setPreferences({
              ...preferences,
              ageRange: {...preferences.ageRange, max: value}
            })}
            minimumValue={0}
            maximumValue={20}
            step={1}
          />
          <Text>Max: {preferences.ageRange.max} years</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={savePreferences}>
        <Text style={styles.saveButtonText}>Save Preferences</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  option: {
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  optionText: {
    color: '#666',
  },
  selectedOptionText: {
    color: '#fff',
  },
  ageRangeContainer: {
    marginTop: 8,
  },
  ageSlider: {
    marginVertical: 8,
  },
  saveButton: {
    margin: 16,
    backgroundColor: '#FF6B6B',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PreferencesScreen; 