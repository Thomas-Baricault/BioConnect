import { View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FeatherIcon from 'react-native-vector-icons/Feather';

function Nav() {
    const navigation = useNavigation();

    const buttons = [
        ['Search', 'search'],
        ['Favorites', 'star'],
        ['Preferences', 'settings'],
    ];

    return (
        <View style={{
            boxSizing:            'border-box',
            width:                '100%',
            flexDirection:        'row',
            justifyContent:       'space-evenly',
            alignItems:           'center',
            gap:                  5,
            padding:              10,
            borderTopLeftRadius:  10,
            borderTopRightRadius: 10,
            backgroundColor:      '#eeeeee',
        }}>
            { buttons.map((data, key) => (
                <TouchableOpacity key={ key } onPress={ () => navigation.navigate(data[0]) }>
                    <FeatherIcon
                        name  = { data[1] }
                        size  = { 24 }
                        color = '#111111'
                    />
                </TouchableOpacity>
            )) }
        </View>
    );
}

export default Nav;