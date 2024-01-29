import React, { useMemo } from 'react'
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

function MapComponent({ width, height, lat, lng }) {
  console.log("LAT LONG",lng,lat)
    let containerStyle = {
        width: width || '400px',
        height: height || '400px'
      };
    
    const center = useMemo(() => ({
        lat: lat || -3.745,
        lng: lng || -38.523
      }), [lat, lng]);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
  })

  // const [map, setMap] = React.useState(null)

  // const onLoad = React.useCallback(function callback(map) {
  //   // This is just an example of getting and using the map instance!!! don't just blindly copy!
  //   const bounds = new window.google.maps.LatLngBounds(center);
  //   map.fitBounds(bounds);

  //   setMap(map)
  // }, [center])

  // const onUnmount = React.useCallback(function callback(map) {
  //   setMap(null)
  // }, [])

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={14}
      options={{streetViewControl: false }}
      // mapTypeId={.ROADMAP}
      // onLoad={onLoad}
      // onUnmount={onUnmount}
      >
      {<Marker position={center} />}
      { /* Child components, such as markers, info windows, etc. */ }
      <></>
    </GoogleMap>
  ) : <></>
}

export default React.memo(MapComponent)