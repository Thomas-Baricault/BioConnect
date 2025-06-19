/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { initDatabase, closeDatabase } from './src/services/migrations/index.js';
import DetailsPage from './src/pages/DetailsPage.js';
import FavoritesPage from './src/pages/FavoritesPage.js';
import PreferencesPage from './src/pages/PreferencesPage.js';
import SearchPage from './src/pages/SearchPage.js';
import SplashPage from './src/pages/SplashPage.js';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  // useEffect(() => {
  //   // Ouvrir la base de données au montage de l'application
  //   initDatabase()
  //     .then(() => console.log('Database initialized successfully.'))
  //     .catch(error => console.error('Failed to initialize database:', error));

  //   // Fermer la base de données à la fin de vie de l'application (optionnel, mais bonne pratique)
  //   return () => {
  //     closeDatabase();
  //   };
  // }, []); // Le tableau vide assure que cela ne s'exécute qu'une fois

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen
          name="Details"
          component={DetailsPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Favorites"
          component={FavoritesPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Preferences"
          component={PreferencesPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Search"
          component={SearchPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Splash"
          component={SplashPage}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;