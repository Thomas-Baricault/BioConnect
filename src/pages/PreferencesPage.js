import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Switch, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import SQLite from "react-native-sqlite-storage";
import DefaultPage from './DefaultPage';

SQLite.enablePromise(true);

const dbName = "bioconnect.db";
let db;

function PreferencesPage() {
    const [defaultAddress, setDefaultAddress] = useState('');
    const [selectedType, setSelectedType] = useState('all');
    const [useGeolocation, setUseGeolocation] = useState(false);

    const setAndSaveDefaultAddress = val => {
        setDefaultAddress(val);
        savePreference('defaultAddress', val);
    };
    const setAndSaveUseGeolocation = val => {
        setUseGeolocation(val);
        savePreference('useGeolocation', val);
    };
    const setAndSaveSelectedType = val => {
        setSelectedType(val);
        savePreference('selectedType', val);
    };

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

    const loadPreferences = () => {
        if (!db) return;
        db.executeSql("SELECT * FROM preferences;")
            .then(([results]) => {
                const rows = results.rows;
                for (let i = 0; i < rows.length; i++) {
                    const { key, value } = rows.item(i);
                    switch (key) {
                        case 'defaultAddress': setDefaultAddress(value); break;
                        case 'useGeolocation': setUseGeolocation(value === 'true'); break;
                        case 'selectedType': setSelectedType(value); break;
                        default: break;
                    }
                }
            })
            .catch(error => {
                console.log("Erreur SELECT preferences :", error);
            });
    };

    const savePreference = (key, value) => {
        if (!db) return;
        db.executeSql(
            "INSERT OR REPLACE INTO preferences (key, value) VALUES (?, ?);",
            [key, value.toString()]
        ).catch(error => {
            console.log("Erreur SAVE preference :", error);
        });
    };

    return (
        <DefaultPage>
            <Text style={styles.label}>Adresse par défaut :</Text>
            <TextInput
                style={styles.input}
                value={defaultAddress}
                onChangeText={setAndSaveDefaultAddress}
                placeholder="Entrez une adresse"
            />

            <View style={styles.switchRow}>
                <Text style={styles.label}>Utiliser la géolocalisation :</Text>
                <Switch
                    value={useGeolocation}
                    onValueChange={setAndSaveUseGeolocation}
                />
            </View>

            <Text style={styles.label}>Type de filtre par défaut :</Text>
            <Picker
                selectedValue={selectedType}
                onValueChange={setAndSaveSelectedType}
                style={styles.picker}
            >
                <Picker.Item label="Tout" value="all" />
                <Picker.Item label="Vente au détail" value="filtrerGrandeSurface" />
                <Picker.Item label="Restaurants" value="filtrerRestaurants" />
                <Picker.Item label="Grossistes" value="filtrerGrossistes" />
                <Picker.Item label="Grande surface" value="filtrerGrandeSurface" />
                <Picker.Item label="Commerçants et artisans" value="filtrerCommercantsEtArtisans" />
                <Picker.Item label="Magasin spécialisés" value="filtrerMagasinSpec" />
            </Picker>
        </DefaultPage>
    );
};

const styles = StyleSheet.create({
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

export default PreferencesPage;