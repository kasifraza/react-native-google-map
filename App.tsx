/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import { Alert, PermissionsAndroid, Platform, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';



function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [loading, setLoading] = useState(false);
  const [iosLocation, setIosLocation] = useState("");
  const [latLong, setLatLong] = useState({lat:0,long:0});
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: `Allow Yarrow to access this devices's location.`,
            message: '',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('You can use the location');
        } else {
          console.log('location permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      const auth = await Geolocation.requestAuthorization('whenInUse');
      setIosLocation(auth);
      console.log(auth);
    }
  };


  useEffect(() => {
    requestCameraPermission();
    locationGet();
  }, []);


  const locationGet = async () => {
    setLoading(true);
    if (Platform.OS === 'ios') {
      if (iosLocation !== 'granted') {
        return Alert.alert(
          'Alert!',
          `We're unable to connect to your location. Please provide the location access.`,
          [{ text: 'Ok' }],
          { cancelable: true },
        );
      }
    }
    Geolocation.getCurrentPosition(
      position => {
        setLatLong({lat: position.coords.latitude, long: position.coords.longitude})
        console.log(position.coords.latitude);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      },
      error => {
        // See error code charts below.
        console.log('error in location :->> ', error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };




  const styles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      height: "100%",
      width: "100%",
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
  });

  return (
    <View style={styles.container}>
      <Text>{JSON.stringify(latLong)}</Text>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={{
          // latitude: 37.78825,
          // longitude: -122.4324,
          latitude: latLong.lat,
          longitude: latLong.long,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}
        showsUserLocation={true}
        showsMyLocationButton

      >
        <Marker coordinate={{ 
          latitude: latLong.lat, longitude: latLong.long
         }}
          pinColor={"purple"} // any color
          title={"Kasif Raza"}
          description={"I am here!"} />
      </MapView>
    </View>
  );
}

export default App;
