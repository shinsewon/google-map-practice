import React,{useState,useEffect} from 'react'
import {useMainContext} from './context/Context'
import axios from "axios";
import Map from './components/GoogleMap'
import Header from './components/Header'
import Loader from './components/Loader'
import Search from './components/Search'


function App() {
    const {setEventData,reRenderMarkers}=useMainContext()
    const [loading, setLoading] = useState(false)
    const [renderEvent, setRenderEvent] = useState([])

    useEffect(()=>{
        const fetchEvents =async ()=>{
            setLoading(false)
            const response = await axios.get('https://eonet.sci.gsfc.nasa.gov/api/v3/events')
            const {events} =response.data
            setEventData(events)
            setRenderEvent(events)
            setLoading(true)
        }
        fetchEvents()

    },[ ])

    useEffect(()=>{
        if(reRenderMarkers !==null){
            setRenderEvent(reRenderMarkers)
        }
    },[reRenderMarkers])

    return (
        <div>
            <Header/>
            {loading? <Map eventData={renderEvent}/>: <Loader/>}
            {loading && <Search/>}
        </div>
    );
}


export default App;
