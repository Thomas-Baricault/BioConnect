import { useEffect, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MapView from 'react-native-maps';
import { requestBioAPI } from '../services/API';
import DefaultPage from './DefaultPage';

const SearchPage = ({ navigation }) => {
    const NBPERPAGE = 10;

    const [useCoords, setUseCoords] = useState(false);
    const [address, setAddress] = useState('');
    const [coords, setCoords] = useState({ lat: 46.76416812552772, lng: 2.558369667859457 });
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
            params.lat = coords.lat;
            params.lng = coords.lng;
        } else {}
        if (name) {
            params.nom = name;
        }
        if (product) {
            params.produit = product;
        }
        if (filter) {
            params[filter] = '1';
        }
        requestBioAPI(params, setOperators);
    };

    useEffect(search, []);

    return (
        <DefaultPage>
            <ScrollView>
                <View>
                    <TextInput
                        editable={ !useCoords }
                        placeholder='Adresse'
                    >{ useCoords ? 'Moi' : address }</TextInput>
                    <View>
                        <Switch
                            trackColor={{false: '#767577', true: '#81b0ff'}}
                            thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={ () => setUseCoords(!useCoords) }
                            value={ useCoords }
                        />
                        <Text>Utiliser ma position</Text>
                    </View>
                    <TextInput
                        placeholder='Nom'
                        onChangeText={ name => setName(name) }
                    >{ name }</TextInput>
                    <TextInput
                        placeholder='Produit'
                        onChangeText={ product => setProduct(product) }
                    >{ product }</TextInput>
                    <RNPickerSelect
                        items={[
                            { label: 'Tout', value: '' },
                            { label: 'Vente au détail', value: 'filtrerVenteDetail' },
                            { label: 'Restaurants', value: 'filtrerRestaurants' },
                            { label: 'Grossistes', value: 'filtrerGrossistes' },
                            { label: 'Grande surface', value: 'filtrerGrandeSurface' },
                            { label: 'Commerçants et artisans', value: 'filtrerCommercantsEtArtisans' },
                            { label: 'Magasin spécialisés', value: 'filtrerMagasinSpec' },
                        ]}
                        onValueChange={filter => setFilter(filter)}
                    />
                    <TouchableOpacity onPress={ search }>Rechercher</TouchableOpacity>
                </View>
                <MapView initialRegion={{
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
                </MapView>
                <Text>{ operators.nbTotal } résultat{ operators.nbTotal === 1 ? '' : 's' }</Text>
                {
                    operators.nbTotal === 0
                    ? null
                    : (
                        <View>
                            { operators.items.map((item, key) => (
                                <TouchableOpacity
                                    key={ key }
                                    onPress={ () => navigation.navigate('Details', { id: item.id }) }
                                >
                                    <Text>{ item.denominationcourante }</Text>
                                    <Text>{ item.adressesOperateurs.lieu } { item.adressesOperateurs.codePostal } { item.adressesOperateurs.ville }</Text>
                                </TouchableOpacity>
                            )) }
                            <View>
                                <TouchableOpacity
                                    disabled={ page === 0 }
                                    onPress={ () => setPage(page-1) }
                                >&lt;</TouchableOpacity>
                                <Text>{ page } / { parseInt((operators.nbTotal-1)/NBPERPAGE) }</Text>
                                <TouchableOpacity
                                    disabled={ page === parseInt((operators.nbTotal-1)/NBPERPAGE) }
                                    onPress={ () => setPage(page+1) }
                                >&lt;</TouchableOpacity>
                            </View>
                        </View>
                    )
                }
            </ScrollView>
        </DefaultPage>
    );
}

export default SearchPage;