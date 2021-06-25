import React, {useEffect, useRef, useState} from 'react';
import {useMainContext} from '../context/Context'

function Search(props) {
    const{eventData,setSelectedEvent,setReRenderMarkers} =useMainContext()
    //Matching results
    const [matchEvent,setMatchEvent]=useState(eventData)
    //Handle Drop Down
    const [storeSelection,setStoreSelection]=useState('All')

    const searchBox = useRef(null)
    const optionBox =useRef(null)


const filterEventData=eventData=>{
        //스프레드 연산자로 참조 데이터를 덮어 쓰지 않습니다.
    let filteredEventData =[...eventData]

    if(storeSelection !=='All'){
        filteredEventData = filteredEventData.filter(event => event.categories[0].title ===storeSelection)
    }
    return filteredEventData
}


    const userSearch=(searchQuery,eventData)=>{
        let eventMatch=[]
        let filteredEventData =filterEventData(eventData)


        if(searchQuery.length>0 && filteredEventData){
            for(const event in filteredEventData){
                let eventTitle = filteredEventData[event].title.toLowerCase()

                if(eventTitle.indexOf(searchQuery) !== -1){
                    eventMatch.push(filteredEventData[event])
                }
            }
            //if they have typed in something but it didn't match(입력한 내용이 일치하지 않는 경우)
            if(eventMatch.length === 0){
                eventMatch =[{title:'결과가 없습니다!',categories:[{title:''}]}]
            }
            setMatchEvent(eventMatch)
        }else{
            setMatchEvent(filteredEventData)
        }
    }

    useEffect(()=>{
        //필터 옵션을 변경했습니다. 마커도 변경되기를 원합니다.
        let filteredEventData =filterEventData(eventData)
        console.log('filteredEventData>>>>>>',filteredEventData)
        setReRenderMarkers(filteredEventData)
        userSearch(searchBox.current.value.toLowerCase(),filteredEventData)
    },[storeSelection])

    return (
        <><section className={'option-container'}>
            <p>Type:</p>
            <select ref={optionBox} onChange={()=>{setStoreSelection(optionBox.current.value)}}>
                <option value="All">All</option>
                <option value="Wildfires">Wildfires</option>
                <option value="Severe Storms">Severe Storms</option>
                <option value="Volcanoes">Volcanoes</option>
                <option value="Sea and Lake Ice">Sea and Lake Ice</option>
            </select>
        </section>
            <section className={'search-container'}>
                <p>Search : </p>
                <input type={'text'} ref={searchBox}
                onKeyUp={()=>{
                    let searchQuery = searchBox.current.value.toLowerCase()
                    setTimeout(()=>{
                        if(searchQuery ===searchBox.current.value.toLowerCase()){
                            userSearch(searchQuery,eventData)
                        }
                    },300)
                }}
                />
            </section>
            <table className={'search-table'}>
                <tr >
                    <th style={{width:'60%'}}>Title</th>
                    <th>Type</th>
                    <th>Location</th>
                </tr>
                {matchEvent.map(ev=>{
                    return(
                        <tr key={ev.id}>
                            <td>{ev.title}</td>
                            <td>{ev.categories[0].title}</td>
                            {ev.categories[0].title ? <td><a href={'#'} onClick={()=>{setSelectedEvent(ev)}}>Click Here</a></td> : <td></td>}
                        </tr>
                    )
                })}
            </table>
        </>
    );
}

export default Search;