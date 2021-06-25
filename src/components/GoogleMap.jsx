import React,{useState,useRef,useEffect} from 'react';
import GoogleMapReact from 'google-map-react'
import useSuperCluster from 'use-supercluster'
import LocationMarker from './LocationMarker'
import LocationInfoBox from './LocationInfoBox'
//Main Context
import {useMainContext} from '../context/Context'


const Map = ({center, eventData}) => {

    const {selectedEvent} =useMainContext()
    const mapRef=useRef()
    const [zoom, setZoom] = useState(1)
    const [bounds,setBounds]=useState(null)
    //Info Box
    const [locationInfo,setLocationInfo]=useState(null)


    //검색창에 'Click here' 클릭했을때 위치 이동
    useEffect(()=>{

        if(selectedEvent !==null && selectedEvent.length !== 0){
            const[longitude,latitude]=selectedEvent?.geometry[0]?.coordinates
            mapRef.current.panTo({lat: latitude, lng:longitude})
            mapRef.current.setZoom(10)
        }
    },[selectedEvent])


    //Index for reference
    const eventDataIndex = {
        8: 'Wildfires',
        10: 'Severe Storms',
        12: 'Volcanoes',
        15: 'Sea and Lake Ice'
    }
    //Create an Array of its keys
    let eventDataIndexNum = Object.keys(eventDataIndex)
    eventDataIndexNum = eventDataIndexNum.map(idx => Number(idx))


    const points = eventData.map(event => {
        let categoriesId = null
        if (event.categories[0].id === 'wildfires') {
            categoriesId = 8
        }
        if (event.categories[0].id === "severeStorms") {
            categoriesId = 10
        }
        if (event.categories[0].id === "volcanoes") {
            categoriesId = 12
        }
        if (event.categories[0].id === "seaLakeIce") {
            categoriesId = 15
        }
        return({
            "type":'Feature',
            'properties':{
                "cluster":false,
                "eventKey":event.id,
                "eventTitle":event.title,
                "eventType":categoriesId
            },
            "geometry":{"type":'Point',"coordinates":[event.geometry[0].coordinates[0],event.geometry[0].coordinates[1]]}

        })
    });



    //Get Clusters
    const{clusters,supercluster} =useSuperCluster({
        points,
        bounds,
        zoom,
        options:{radius:75,maxZoom:20}
    })


    return (
        <div className={'map-container'}>
            <GoogleMapReact
                bootstrapURLKeys={{key: process.env.REACT_APP_GOOGLE_KEY}}
                center={center}
                zoom={zoom}
                yesIWantToUseGoogleMapApiInternals
                onGoogleApiLoaded={({map}) => {
                    mapRef.current = map;
                }}
                onChange={({zoom, bounds}) => {
                    setZoom(zoom)
                    setBounds([
                        bounds.nw.lng,
                        bounds.se.lat,
                        bounds.se.lng,
                        bounds.nw.lat,
                    ])
                }}
                onClick={()=> setLocationInfo((null))}
                onDrag={()=> setLocationInfo((null))}
            >
                {clusters.map(cluster => {
                    const [longitude, latitude] = cluster.geometry.coordinates
                    const {cluster: isCluster, point_count: pointCount} = cluster.properties;

                    //Used for icon type
                    const clusterId = cluster.properties.eventType // 제대로뜸

                    if (isCluster) {
                        let changeSize = Math.round(pointCount / points.length * 100);
                        //Can't exceed 40 px

                        let addSize = Math.min(changeSize * 10, 40)

                        return (
                            <section lat={latitude} lng={longitude} key={cluster.id}>
                                <div className={'cluster-marker'} style={{
                                    width: addSize + changeSize + 'px',
                                    height: addSize + changeSize + 'px'
                                }}
                                     onClick={() => {
                                         const expansionZoom = Math.min(
                                             supercluster.getClusterExpansionZoom(cluster.id), 20
                                         )
                                         mapRef.current.setZoom(expansionZoom)
                                         mapRef.current.panTo({lat: latitude, lng:longitude}) //지도의 중심을 지정된으로 변경합니다 LatLng. 변경 사항이 맵의 너비와 높이보다 작 으면 전환이 부드럽게 애니메이션됩니다.
                                     }}
                                >
                                    {pointCount}
                                </div>
                            </section>
                        )
                    }
                    //Not a cluster,Just a single point
                    if (eventDataIndexNum.indexOf(clusterId) !== -1 && cluster.geometry.coordinates.length === 2) {
                        return (
                            <LocationMarker lat={latitude} lng={longitude} id={clusterId}
                                            key={cluster.properties.eventKey}
                            onClick={()=>{
                                setLocationInfo({id:cluster.properties.eventKey, title:cluster.properties.eventTitle})
                            }}/>
                        )
                    }
                })}
            </GoogleMapReact>
            {locationInfo && <LocationInfoBox info={locationInfo}/> }
        </div>
    );
};
Map.defaultProps ={
    center:{
        lat:37.583330,
        lng:126.997229
    }
    // center:{
    //     lat:29.305561,
    //     lng:-3.981108
    // }
}


export default Map;
