import React, { createContext, useContext, useState, useEffect } from 'react';
import SQLite from "react-native-sqlite-storage";

SQLite.enablePromise(true);

const dbName = "bioconnect.db";
let db;

const PreferencesContext = createContext();

export const PreferencesProvider = ({ children }) => {
    const [defaultAddress, setDefaultAddress] = useState('');
    const [defaultRadius, setDefaultRadius] = useState('10');
    const [selectedType, setSelectedType] = useState('all');
    const [useGeolocation, setUseGeolocation] = useState(true);

    // Charger et initialiser la BDD + préférences
    useEffect(() => {
        SQLite.openDatabase({ name: dbName, location: "default" })
            .then(database => {
                db = database;
                return db.executeSql(
                    "CREATE TABLE IF NOT EXISTS preferences (key TEXT PRIMARY KEY NOT NULL, value TEXT);"
                );
            })
            .then(loadPreferences)
            .catch(error => {
                console.log("Erreur ouverture/creation DB preferences :", error);
            });
    }, []);

    // Charger les préférences depuis la BDD
    const loadPreferences = () => {
        if (!db) return;
        db.executeSql("SELECT * FROM preferences;")
            .then(([results]) => {
                const rows = results.rows;
                for (let i = 0; i < rows.length; i++) {
                    const { key, value } = rows.item(i);
                    switch (key) {
                        case 'defaultAddress': setDefaultAddress(value); break;
                        case 'defaultRadius': setDefaultRadius(value); break;
                        case 'selectedType': setSelectedType(value); break;
                        case 'useGeolocation': setUseGeolocation(value === 'true'); break;
                        default: break;
                    }
                }
            })
            .catch(error => {
                console.log("Erreur SELECT preferences :", error);
            });
    };

    // Sauvegarder une préférence dans la BDD
    const savePreference = (key, value) => {
        if (!db) return;
        db.executeSql(
            "INSERT OR REPLACE INTO preferences (key, value) VALUES (?, ?);",
            [key, value.toString()]
        ).catch(error => {
            console.log("Erreur SAVE preference :", error);
        });
    };

    // Wrappers pour setter + sauvegarder
    const setAndSaveDefaultAddress = val => {
        setDefaultAddress(val);
        savePreference('defaultAddress', val);
    };
    const setAndSaveDefaultRadius = val => {
        setDefaultRadius(val);
        savePreference('defaultRadius', val);
    };
    const setAndSaveSelectedType = val => {
        setSelectedType(val);
        savePreference('selectedType', val);
    };
    const setAndSaveUseGeolocation = val => {
        setUseGeolocation(val);
        savePreference('useGeolocation', val);
    };

    return (
        <PreferencesContext.Provider value={{
            defaultAddress, setDefaultAddress: setAndSaveDefaultAddress,
            defaultRadius, setDefaultRadius: setAndSaveDefaultRadius,
            selectedType, setSelectedType: setAndSaveSelectedType,
            useGeolocation, setUseGeolocation: setAndSaveUseGeolocation
        }}>
            {children}
        </PreferencesContext.Provider>
    );
};

export const usePreferences = () => useContext(PreferencesContext);

import { View, Text, TextInput, Switch, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export const PreferencesPage = () => {
    const {
        defaultAddress, setDefaultAddress,
        defaultRadius, setDefaultRadius,
        selectedType, setSelectedType,
        useGeolocation, setUseGeolocation
    } = usePreferences();

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Adresse par défaut :</Text>
            <TextInput
                style={styles.input}
                value={defaultAddress}
                onChangeText={setDefaultAddress}
                placeholder="Entrez une adresse"
            />

            <Text style={styles.label}>Rayon de recherche (km) :</Text>
            <TextInput
                style={styles.input}
                value={defaultRadius}
                onChangeText={setDefaultRadius}
                keyboardType="numeric"
                placeholder="10"
            />

            <Text style={styles.label}>Type de filtre par défaut :</Text>
            <Picker
                selectedValue={selectedType}
                onValueChange={setSelectedType}
                style={styles.picker}
            >
                <Picker.Item label="Tous" value="all" />
                <Picker.Item label="VenteDetail" value="filtrerGrandeSurface" />
                <Picker.Item label="Restaurants" value="filtrerRestaurants" />
                <Picker.Item label="Grossistes" value="filtrerGrossistes" />
                <Picker.Item label="GrandeSurface" value="filtrerGrandeSurface" />
                <Picker.Item label="CommercantsEtArtisans" value="filtrerCommercantsEtArtisans" />
                <Picker.Item label="MagasinSpec" value="filtrerMagasinSpec" />
            </Picker>

            <View style={styles.switchRow}>
                <Text style={styles.label}>Utiliser la géolocalisation :</Text>
                <Switch
                    value={useGeolocation}
                    onValueChange={setUseGeolocation}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    label: { fontSize: 16, marginTop: 16 },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        padding: 8,
        marginTop: 4,
    },
    picker: { marginTop: 4 },
    switchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 24,
    },
});