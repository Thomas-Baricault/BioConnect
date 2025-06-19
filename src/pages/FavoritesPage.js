import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import SQLite from "react-native-sqlite-storage";

SQLite.enablePromise(true);

const dbName = "bioconnect.db";
let db;

const FavoritesPage = ({ navigation }) => {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        SQLite.openDatabase({ name: dbName, location: "default" })
            .then(database => {
                db = database;
                return db.executeSql(
                    "CREATE TABLE IF NOT EXISTS favorites (id TEXT PRIMARY KEY NOT NULL, name TEXT, address TEXT);"
                );
            })
            .then(fetchFavorites)
            .catch(error => {
                console.log("Erreur ouverture/creation DB :", error);
            });
    }, []);

    const fetchFavorites = () => {
        if (!db) return;
        db.executeSql("SELECT * FROM favorites;")
            .then(([results]) => {
                const rows = results.rows;
                let items = [];
                for (let i = 0; i < rows.length; i++) {
                    items.push(rows.item(i));
                }
                setFavorites(items);
            })
            .catch(error => {
                console.log("Erreur SELECT favorites :", error);
            });
    };

    const removeFavorite = id => {
        if (!db) return;
        db.executeSql("DELETE FROM favorites WHERE id = ?;", [id])
            .then(fetchFavorites)
            .catch(error => {
                console.log("Erreur DELETE favorite :", error);
            });
    };

    const confirmRemove = id => {
        Alert.alert(
            "Supprimer ce favori ?",
            "Voulez-vous vraiment supprimer ce favori ?",
            [
                { text: "Annuler", style: "cancel" },
                { text: "Supprimer", style: "destructive", onPress: () => removeFavorite(id) }
            ]
        );
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onLongPress={() => confirmRemove(item.id)}
            onPress={() => navigation.navigate("OperatorDetails", { operatorId: item.id })}
        >
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.address}>{item.address}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {favorites.length === 0 ? (
                <Text style={styles.empty}>Aucun favori pour l’instant.</Text>
            ) : (
                <FlatList
                    data={favorites}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                />
            )}
            <Text style={styles.info}>Appui long pour supprimer un favori.</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: "#fff" },
    card: {
        backgroundColor: "#e6ffe6",
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        elevation: 2,
    },
    title: { fontSize: 18, fontWeight: "bold" },
    address: { fontSize: 14, color: "#555" },
    empty: { textAlign: "center", marginTop: 40, color: "#888" },
    info: { textAlign: "center", marginTop: 16, color: "#aaa", fontSize: 12 },
});

export default FavoritesPage;