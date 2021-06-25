import React, {createContext, useContext, useState} from 'react';

const mainContext=createContext();

export const useMainContext=()=>{
    return useContext(mainContext)
}

export const ContextProvider = ({children}) => {
    //All of the data from NASA EONET
    const [eventData,setEventData]=useState([])
    //Used to store the event that the user wants to go to
    const [selectedEvent,setSelectedEvent]=useState([])
    //Need re-render markers because user has changed filter option
    const [reRenderMarkers,setReRenderMarkers]=useState([])

    const value={
        eventData,
        selectedEvent,
        reRenderMarkers,
        setEventData,
        setSelectedEvent,
        setReRenderMarkers
    }

    return (
        <mainContext.Provider value={value}>
            {children}
        </mainContext.Provider>
    );
};

