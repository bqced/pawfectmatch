import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext'; // We'll create this next

const SettingsScreen = ({ navigation }) => {
  const { signOut } = useAuth();
  const [notifications, setNotifications] = React.useState(true);
  const [locationServices, setLocationServices] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);

  const SettingItem = ({ icon, title, value, onPress, isSwitch }) => (
    <TouchableOpacity 
      style={styles.settingItem}
      onPress={isSwitch ? null : onPress}
    >
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={24} color="#666" />
        <Text style={styles.settingText}>{title}</Text>
      </View>
      {isSwitch ? (
        <Switch
          value={value}
          onValueChange={onPress}
          trackColor={{ false: "#767577", true: "#FF6B6B" }}
          thumbColor={value ? "#fff" : "#f4f3f4"}
        />
      ) : (
        <Ionicons name="chevron-forward" size={24} color="#666" />
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <SettingItem
          icon="person-outline"
          title="Edit Profile"
          onPress={() => navigation.navigate('EditProfile')}
        />
        <SettingItem
          icon="lock-closed-outline"
          title="Privacy Settings"
          onPress={() => navigation.navigate('Privacy')}
        />
        <SettingItem
          icon="notifications-outline"
          title="Notifications"
          value={notifications}
          onPress={() => setNotifications(!notifications)}
          isSwitch
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <SettingItem
          icon="location-outline"
          title="Location Services"
          value={locationServices}
          onPress={() => setLocationServices(!locationServices)}
          isSwitch
        />
        <SettingItem
          icon="moon-outline"
          title="Dark Mode"
          value={darkMode}
          onPress={() => setDarkMode(!darkMode)}
          isSwitch
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <SettingItem
          icon="help-circle-outline"
          title="Help Center"
          onPress={() => navigation.navigate('Help')}
        />
        <SettingItem
          icon="document-text-outline"
          title="Terms of Service"
          onPress={() => navigation.navigate('Terms')}
        />
        <SettingItem
          icon="shield-outline"
          title="Privacy Policy"
          onPress={() => navigation.navigate('Privacy')}
        />
      </View>

      <TouchableOpacity 
        style={styles.signOutButton}
        onPress={signOut}
      >
        <Text style={styles.signOutText}>Sign Out</Text>
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
    color: '#666',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    marginLeft: 12,
    color: '#333',
  },
  signOutButton: {
    margin: 16,
    padding: 16,
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    alignItems: 'center',
  },
  signOutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SettingsScreen; 