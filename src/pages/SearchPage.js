import { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, Text, TextInput, TouchableOpacity, View, Switch, PermissionsAndroid, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import MapView from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import SQLite from "react-native-sqlite-storage";
import { requestBioAPI } from '../services/API';
import DefaultPage from './DefaultPage';

SQLite.enablePromise(true);

const dbName = "bioconnect.db";
let db;

const SearchPage = ({ navigation }) => {
    const NBPERPAGE = 10;

    const [permission, setPermission] = useState(false);
    const [useCoords, setUseCoords] = useState(false);
    const [address, setAddress] = useState('');
    const [coords, setCoords] = useState({ latitude: 46.76416812552772, longitude: 2.558369667859457 });
    const [name, setName] = useState('');
    const [product, setProduct] = useState('');
    const [filter, setFilter] = useState('');
    const [operators, setOperators] = useState({ nbTotal: 0 });
    const [page, setPage] = useState(0);

    const search = () => {
        const params = {
            nb: NBPERPAGE,
            debut: page
        };
        if (useCoords || true) {
            params.lat = coords.latitude;
            params.lng = coords.longitude;
        } else {}
        if (name) {
            params.nom = name;
        }
        if (product) {
            params.produit = product;
        }
        if (filter !== 'all') {
            params[filter] = '1';
        }
        requestBioAPI(params, setOperators);
    };

    const requestPermission = async () => {
        if (!permission) {
            setPermission(
                Platform.OS === 'android'
                ? (await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)) === PermissionsAndroid.RESULTS.GRANTED
                : true
            );
        }
    };

    useEffect(search, [useCoords, address, coords, name, product, filter, page]);

    useEffect(() => {
        SQLite.openDatabase({ name: dbName, location: "default" })
            .then(database => {
                db = database;
                return db.executeSql(
                    "CREATE TABLE IF NOT EXISTS preferences (key TEXT PRIMARY KEY NOT NULL, value TEXT);"
                );
            })
            .then(() => {
                if (!db) return;
                db.executeSql("SELECT * FROM preferences;")
                    .then(([results]) => {
                        const rows = results.rows;
                        for (let i = 0; i < rows.length; i++) {
                            const { key, value } = rows.item(i);
                            switch (key) {
                                case 'defaultAddress': setAddress(value); break;
                                case 'useGeolocation': setUseCoords(value === 'true'); break;
                                case 'selectedType': setFilter(value); break;
                                default: break;
                            }
                        }
                    })
                    .catch(error => {
                        console.log("Erreur SELECT preferences :", error);
                    });
            })
            .catch(error => {
                console.log("Erreur ouverture/creation DB preferences :", error);
            });
    }, []);

    // useEffect(() => {
    //     if (useCoords) {
    //         Geolocation.getCurrentPosition(
    //             pos => setCoords(pos.coords),
    //             err => setUseCoords(false),
    //             { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    //         );
    //     }
    // }, [useCoords]);

    return (
        <DefaultPage padding={ 0 }>
            <ScrollView style={{
                padding: 20
            }}>
                <View style={{
                    marginBottom: 40
                }}>
                    <TextInput
                        style={ styles.input }
                        placeholderTextColor='grey'
                        editable={ !useCoords }
                        placeholder='Adresse'
                        onChangeText={ address => setAddress(address) }
                        value={ useCoords ? 'Moi' : address }
                    />
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 10,
                        marginBottom: 20
                    }}>
                        <Switch
                            trackColor={{false: '#767577', true: '#81b0ff'}}
                            thumbColor={useCoords ? '#f5dd4b' : '#f4f3f4'}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={ async () => {
                                await requestPermission();
                                setUseCoords(permission && !useCoords);
                            } }
                            value={ useCoords }
                        />
                        <Text>Utiliser ma position</Text>
                    </View>
                    <TextInput
                        style={ styles.input }
                        placeholderTextColor='grey'
                        placeholder='Nom'
                        onChangeText={ name => setName(name) }
                        value={ name }
                    />
                    <TextInput
                        style={ styles.input }
                        placeholderTextColor='grey'
                        placeholder='Produit'
                        onChangeText={ product => setProduct(product) }
                        value={ product }
                    />
                    <Picker
                        style={ styles.select }
                        selectedValue={ filter }
                        onValueChange={ filter => setFilter(filter) }
                    >
                        <Picker.Item label="Filtrer par: Tout" value="all"/>
                        <Picker.Item label="Filtrer par: Vente au détail" value="filtrerVenteDetail"/>
                        <Picker.Item label="Filtrer par: Restaurants" value="filtrerRestaurants"/>
                        <Picker.Item label="Filtrer par: Grossistes" value="filtrerGrossistes"/>
                        <Picker.Item label="Filtrer par: Grande surface" value="filtrerGrandeSurface"/>
                        <Picker.Item label="Filtrer par: Commerçants et artisans" value="filtrerCommercantsEtArtisans"/>
                        <Picker.Item label="Filtrer par: Magasin spécialisés" value="filtrerMagasinSpec"/>
                    </Picker>
                    <TouchableOpacity
                        style={ styles.button }
                        onPress={ search }
                    >
                        <Text style={{
                            color: 'white',
                            textAlign: 'center',
                            fontSize: 16
                        }}>Rechercher</Text>
                    </TouchableOpacity>
                </View>
                {/* <MapView initialRegion={{
                    latitude: coords.lat,
                    longitude: coords.lng
                }}>
                    {
                        operators.nbTotal > 0
                        ? operators.items.map((item, key) => (
                            <Marker
                                key={ key }
                                coordinate={{
                                    latitude: item.adressesOperateurs.lat,
                                    longitude: item.adressesOperateurs.long
                                }}
                                title={ item.denominationcourante }
                                description={ item.productions.map(item => item.nom).join('\n') }
                            />
                        ))
                        : null
                    }
                </MapView> */}
                <Text style={{
                    fontSize: 16,
                    color: 'black',
                    textAlign: 'center',
                    marginBottom: 20
                }}>{ operators.nbTotal } résultat{ operators.nbTotal === 1 ? '' : 's' }</Text>
                {
                    operators.nbTotal === 0
                    ? null
                    : (
                        <View>
                            { operators.items.map((item, key) => (
                                <TouchableOpacity
                                    style={{
                                        padding: 20,
                                        backgroundColor: '#eeeeee',
                                        marginBottom: 10,
                                        borderRadius: 10,
                                        flexDirection: 'column',
                                        gap: 5
                                    }}
                                    key={ key }
                                    onPress={ () => navigation.navigate('Details', { operator: item }) }
                                >
                                    <Text>{ item.denominationcourante }</Text>
                                    <Text>{ item.adressesOperateurs.lieu } { item.adressesOperateurs.codePostal } { item.adressesOperateurs.ville }</Text>
                                </TouchableOpacity>
                            )) }
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: 20,
                                marginTop: 20,
                                marginBottom: 40
                            }}>
                                <TouchableOpacity
                                    style={ styles.button }
                                    disabled={ page === 0 }
                                    onPress={ () => setPage(page-1) }
                                >
                                    <Text style={{
                                        fontSize: 20,
                                        color: 'white'
                                    }}>&lt;</Text>
                                </TouchableOpacity>
                                <Text style={{
                                    color: 'black'
                                }}>{ page+1 } / { parseInt((operators.nbTotal-1)/NBPERPAGE) }</Text>
                                <TouchableOpacity
                                    style={ styles.button }
                                    disabled={ page === parseInt((operators.nbTotal-1)/NBPERPAGE) }
                                    onPress={ () => setPage(page+1) }
                                >
                                    <Text style={{
                                        fontSize: 20,
                                        color: 'white'
                                    }}>&gt;</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )
                }
            </ScrollView>
        </DefaultPage>
    );
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: '#7777ff',
        borderRadius: 5
    },
    input: {
        fontSize: 16,
        color: 'black',
        padding: 10,
        backgroundColor: '#eeeeee',
        marginBottom: 20
    },
    select: {
        fontSize: 16,
        color: 'black',
        backgroundColor: '#eeeeee',
        marginBottom: 20
    }
});

export default SearchPage;