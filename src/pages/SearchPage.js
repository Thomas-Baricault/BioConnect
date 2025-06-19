import { useState } from 'react';
import { View } from 'react-native';
import MapView from 'react-native-maps';

const SearchPage = ({ navigation }) => {
    const [coords, setCoords] = useState({ latitude: 46.76416812552772, longitude: 2.558369667859457 });
    const []

    return <View>
        <MapView initialRegion={coords}>
            {this.state.markers.map((marker, index) => (
                <Marker
                    key={index}
                    coordinate={marker.latlng}
                    title={marker.title}
                    description={marker.description}
                />
            ))}
        </MapView>
    </View>;
}

export default SearchPage;