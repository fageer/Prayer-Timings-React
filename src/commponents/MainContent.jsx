import { useState, useEffect } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Prayer from './Prayer';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import axios from "axios";
import moment from "moment";


export default function MainContent() {
    // STATES
    const[timings, setTimings] = useState({
        Fajr: "04:02",
        Dhuhr: "11:58",
        Asr: "15:26",
        Sunset: "18:33",
        Isha: "20:03",
    });
    const[selectedCity, setSelectedCity] = useState({
        displayName: "مكه المكرمة",
        apiName: "Makkah al Mukarramah"
    });
    const[today, setToday] = useState("");
    // END STATES
    
    const avilableCities = [
        {
            displayName: "مكه المكرمة",
            apiName: "Makkah al Mukarramah"
        },
        {
            displayName: "الرياض",
            apiName: "Riyadh"
        },
        {
            displayName: "الدمام",
            apiName: "Dammam"
        }
    ];

    const getTimings = async () => {
        const response = await axios.get(`https://api.aladhan.com/v1/timingsByCity?country=SA&city=${selectedCity.apiName}`);
        setTimings(response.data.data.timings);
    };

    useEffect(() =>{
        getTimings();
        const today = moment();
        setToday(today.format('MMMM Do YYYY | h:mm a'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCity]);


    const handleChangeCity = (event) => {
        const objectCity = avilableCities.find((city) =>{
            return city.apiName === event.target.value;
        });
        setSelectedCity(objectCity);
    };
    
    return (
        <>
            {/* Top Row */}
            <Grid container>
                <Grid xs={6}>
                    <div>
                        <h2>{today}</h2>
                        <h1>{selectedCity.displayName}</h1>
                    </div>
                </Grid>

                <Grid xs={6}>
                    <div>
                        <h2>متبقي حتي صلاة العصر</h2>
                        <h1>00:10:20</h1>
                    </div>
                </Grid>
            </Grid>
            {/*== Top Row ==*/}

            <Divider style={{borderColor: "white", opacity: "0.1"}} />

            {/*== Prayers Cards ==*/}
            <Stack direction="row" justifyContent={"space-around"} style={{marginTop: "50px"}}>
                <Prayer name="الفجر" time={timings.Fajr} image="../../public/fajr-prayer.png" />
                <Prayer name="الظهر" time={timings.Dhuhr} image="../../public/dhhr-prayer-mosque.png" />
                <Prayer name="العصر" time={timings.Asr} image="../../public/asr-prayer-mosque.png" />
                <Prayer name="المغرب" time={timings.Sunset} image="../../public/sunset-prayer-mosque.png" />
                <Prayer name="العشاء" time={timings.Isha} image="../../public/night-prayer-mosque.png" />
            </Stack>
            {/*== Prayers Cards ==*/}

            {/* Select City */}
            <Stack direction="row" justifyContent={"center"} style={{marginTop: "40px"}}>
                <FormControl style={{width: "20%"}} >
                    <InputLabel id="demo-simple-select-label">
                    <span style={{color: "white"}}>المدينة</span>
                    </InputLabel>
                    <Select style={{color: "white"}} labelId="demo-simple-select-label" id="demo-simple-select" label="Age" onChange={handleChangeCity}>
                        {avilableCities.map((city) => (
                            <MenuItem key={city.apiName} value={city.apiName}>
                                {city.displayName}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Stack>
            {/*== Select City ==*/}
        </>
    );
}
