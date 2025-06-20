import React from "react";
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from "react-native";
import DefaultPage from "./DefaultPage";
import SQLite from "react-native-sqlite-storage";

SQLite.enablePromise(true);
const dbName = "bioconnect.db";
let db;

const DetailsPage = ({ route, navigation }) => {
    const { operator } = route.params;

    React.useEffect(() => {
        SQLite.openDatabase({ name: dbName, location: "default" })
            .then(database => {
                db = database;
                return db.executeSql(
                    "CREATE TABLE IF NOT EXISTS favorites (id TEXT PRIMARY KEY NOT NULL, data TEXT);"
                );
            })
            .catch(error => {
                console.log("Erreur ouverture/creation DB :", error);
            });
    }, []);

    const addToFavorites = () => {
        if (!db) return;
        db.executeSql(
            "INSERT OR REPLACE INTO favorites (id, data) VALUES (?, ?);",
            [operator.id, JSON.stringify(operator)]
        )
            .then(() => Alert.alert("Ajouté aux favoris"))
            .catch(() => Alert.alert("Erreur lors de l'ajout aux favoris"));
    };

    const openWeb = url => {
        if (url) Linking.openURL(url);
    };

    const callPhone = phone => {
        if (phone) Linking.openURL(`tel:${phone}`);
    };

    return (
        <DefaultPage>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>{operator.denominationcourante}</Text>
                <Text style={styles.label}>Adresse :</Text>
                <Text style={styles.value}>
                    {operator.adressesOperateurs?.lieu} {operator.adressesOperateurs?.codePostal} {operator.adressesOperateurs?.ville}
                </Text>
                <Text style={styles.label}>SIRET :</Text>
                <Text style={styles.value}>{operator.siret || "Non renseigné"}</Text>
                <Text style={styles.label}>Numéro Bio :</Text>
                <Text style={styles.value}>{operator.numeroBio || "Non renseigné"}</Text>
                <Text style={styles.label}>Activités :</Text>
                <Text style={styles.value}>
                    {operator.activites?.map(a => a.libelle).join(", ") || "Non renseigné"}
                </Text>
                <Text style={styles.label}>Produits :</Text>
                <Text style={styles.value}>
                    {operator.productions?.map(p => p.nom).join(", ") || "Non renseigné"}
                </Text>
                {operator.siteWeb ? (
                    <TouchableOpacity onPress={() => openWeb(operator.siteWeb)}>
                        <Text style={styles.link}>Visiter le site web</Text>
                    </TouchableOpacity>
                ) : null}
                {operator.telephone ? (
                    <TouchableOpacity onPress={() => callPhone(operator.telephone)}>
                        <Text style={styles.link}>Appeler : {operator.telephone}</Text>
                    </TouchableOpacity>
                ) : null}
                <TouchableOpacity style={styles.button} onPress={addToFavorites}>
                    <Text style={styles.buttonText}>Ajouter aux favoris</Text>
                </TouchableOpacity>
            </ScrollView>
        </DefaultPage>
    );
};

const styles = StyleSheet.create({
    container: { padding: 20, backgroundColor: "#f6f2db", flexGrow: 1 },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 16, color: "#13472e" },
    label: { fontWeight: "bold", marginTop: 12, color: "#13472e" },
    value: { marginBottom: 8, color: "#13472e" },
    link: { color: "#13472e", marginVertical: 8, textDecorationLine: "underline" },
    button: {
        backgroundColor: "#13472e",
        padding: 14,
        borderRadius: 8,
        marginTop: 24,
        alignItems: "center"
    },
    buttonText: { color: "#f6f2db", fontWeight: "bold" }
});

export default DetailsPage;