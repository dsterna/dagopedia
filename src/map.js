import React from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styled from 'styled-components';

const Wrapper = styled.div`

    width: ${props => props.width};
    height: ${props => props.height};
 
    
`;

export default class Map extends React.Component {
    componentDidMount() {
        this.map = L.map('map', {
                center: [58, 16],
                zoom: 6,
                zoomControl: false
            }
        );
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
            maxZoom: 18,
            id: 'mapbox.streets'
        }).addTo(this.map);
    }
    render(){
        return <Wrapper width= "80%" height= "25rem" id="map"/>
    }
}