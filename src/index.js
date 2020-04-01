import 'leaflet/dist/leaflet.css';
import './index.scss'

import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import React, { Component, createRef } from 'react';

import HeadingMenu from './containers/headingMenu'
import L from 'leaflet';
import { ModalProvider } from 'styled-react-modal'
import ReactDOM from 'react-dom';
import iconMarker from './marker-filled.png'
import wikiLogo from './WikipediaLogo.svg'

// Todo:
//
// Back button:         remove current in visitedPage and
// Custom position:     Trigger by holding map, disable watchPosition and take position from marker, add button
//
//  Article:            Load all elements and pictures
//
const defaultLocation = {
    lat: 59.3264264,
    lng: 18.0707082
}
let markerIcon = L.icon({
    iconUrl: iconMarker,
    iconSize: [40, 40],
    iconAnchor: [12.5, 41],
    popupAnchor: [8, -41]
})

class App extends Component {
    constructor(props) {
        super(props);
        this.mapRef = createRef();
        this.state = {
            position: defaultLocation,
            marker: defaultLocation,
            zoom: 1.5,
            started: false,
            haveUserPosition: false,
            sound: false,
            language: { code: "sv", text: 'Svenska 🇸🇪', speachCode: 'Swedish Female', startText: "Starta" },
            visitedPageIds: [],
            wikiText: "",
            url: ""

        };
        this.wikiFetch = this.wikiFetch.bind(this);
        this.goBack = this.goBack.bind(this);
    }
    componentDidMount() {
        this.updatePosition();
    }

    updatePosition() {
        navigator.geolocation.watchPosition(position => {
            this.setState({
                position: {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                }
                , haveUserPosition: true,
            }
            )
        }
        )
    }
    onChange(e) {
        if (e) {
            this.setState({ language: e, visitedPageIds: [] });
        } else {
            if (this.state.sound) {
                window.responsiveVoice.cancel();
            }
            this.setState({ sound: !this.state.sound });
        }
    }
    updateMarker = (data) => {
        const mapComp = this.mapRef.current;
        this.setState({ marker: { lat: data.lat, lng: data.lon, header: data.title } })
        let wikiURL = "https://" + this.state.language.code + ".wikipedia.org/w/api.php?action=query&format=json&prop=info%7Cextracts&inprop=url&exintro=1&explaintext=1&origin=*&pageids=" + data.pageid;
        mapComp.leafletElement.flyToBounds([
            [this.state.position.lat, this.state.position.lng],
            [data.lat, data.lon]
        ], {
            padding: [60, 60],
            animate: true, duration: 0.70
        }
        );
        fetch(wikiURL)
            .then(response => response.json())
            .then(datas => {
                if (this.state.sound) {
                    window.responsiveVoice.speak(datas.query.pages[data.pageid].extract, this.state.language.speachCode);

                }
                this.setState({ wikiText: datas.query.pages[data.pageid].extract, url: datas.query.pages[data.pageid].fullurl })
            });
    }
    wikiFetch() {
        let limitString = "&gslimit=" + (this.state.visitedPageIds.length + 1);
        this.setState({ started: true });
        let coordStrig = "&gscoord=" + this.state.position.lat + "|" + this.state.position.lng;
        let URL = "https://" + this.state.language.code + ".wikipedia.org/w/api.php?action=query&prop=&list=geosearch&gsradius=10000&format=json&origin=*"
        URL = URL + coordStrig + limitString;
        fetch(URL)
            .then(response => response.json())
            .then(data => {
                let visitedIndexes = [];
                for (let i = 0; i < data.query.geosearch.length; i++) {
                    for (let j = 0; j < this.state.visitedPageIds.length; j++) {
                        if (data.query.geosearch[i].pageid === this.state.visitedPageIds[j].pageid) {
                            visitedIndexes.push(i)
                        }
                    }
                }
                let closesPage = 0;
                for (let i = 0; i < visitedIndexes.length + 1; i++) {
                    if (!visitedIndexes.includes(i)) {
                        closesPage = i;
                        break;
                    }
                }
                if (data.query.geosearch[closesPage] === undefined) {
                    return
                }
                this.setState({
                    visitedPageIds: [...this.state.visitedPageIds, data.query.geosearch[closesPage]]
                });
                this.updateMarker(data.query.geosearch[closesPage]);
            }
            )
    }
    goBack() {
        if (this.state.visitedPageIds.length <= 1) {
            return
        }
        let tempAry = this.state.visitedPageIds.slice(0, -1);

        this.setState({
            visitedPageIds: tempAry
        })
        this.updateMarker(tempAry[tempAry.length - 1])
    }



    render() {
        const position = [this.state.position.lat, this.state.position.lng]
        return (
            <div className="pageWrapper">
                <ModalProvider>
                    <HeadingMenu sound={this.state.sound} language={this.state.language}
                        onChange={this.onChange.bind(this)} ref={this.mapRef} />
                </ModalProvider>
                {this.state.started ? this.state.haveUserPosition ? "" : <div className="locationUnavailableTex"> location unavailable, using default marker </div> : ""}
                <Map
                    ref={this.mapRef}
                    className='map'
                    center={[23.520007, 13.404954]}
                    zoom={this.state.zoom}
                    zoomControl={false}
                    minZoom={1.5}
                    maxZoom={18}
                    zoomSnap={0.1}
                    id={'your.mapbox.project.id'}
                    accessToken={'your.mapbox.public.access.token'}>
                    <TileLayer id='mapbox.streets'
                        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                    />
                    {this.state.started ? <Marker position={position} icon={markerIcon}>
                        <Popup>
                            <span>You are here</span>
                        </Popup>
                    </Marker> : ""}
                    {this.state.started ?
                        <Marker opacity={0.5} icon={markerIcon} position={[this.state.marker.lat, this.state.marker.lng]}>
                            <Popup>
                                <span>{this.state.marker.header}</span>
                            </Popup> </Marker> : ""}
                </Map>

                {
                    this.state.started ?
                        <div>
                            <div className="wikiTitleContainer">
                                <div href="#" className="previous" onClick={this.goBack}>↤ </div>
                                <h1 className="wikiTitle">
                                    {this.state.marker.header}
                                </h1>

                                <div href="#" className="next" onClick={this.wikiFetch}>↦</div>
                            </div>
                            <section style={{ textAlign: "left", paddingBottom: "1rem", marginTop: "0.5rem" }}>{this.state.wikiText}</section>
                            {this.state.wikiText && <a className="wikiLink" rel="noopener noreferrer" target="_blank" href={this.state.url}>  <img style={{ width: "3rem", height: "3rem" }} src={wikiLogo} alt="Logo" /></a>}
                        </div>
                        :
                        <div className="item button-hand buttonWrapper" >
                            <button onClick={this.wikiFetch}>
                                {this.state.language.startText}
                                <div className="hands"></div>
                            </button>
                        </div>
                }

            </div>
        );
    }
}
ReactDOM.render(<App />, document.getElementById('root'));