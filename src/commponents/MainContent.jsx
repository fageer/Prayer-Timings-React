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
    const [nextPrayerIndex, setNextPrayerIndex] = useState(2);
    const[timings, setTimings] = useState({
        Fajr: "04:02",
        Dhuhr: "11:58",
        Asr: "15:26",
        Sunset: "18:33",
        Isha: "20:03",
    });
    const [remainingTime, setRemainingTime] = useState("");
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
    const prayersArray = [
		{ key: "Fajr", displayName: "الفجر" },
		{ key: "Dhuhr", displayName: "الظهر" },
		{ key: "Asr", displayName: "العصر" },
		{ key: "Sunset", displayName: "المغرب" },
		{ key: "Isha", displayName: "العشاء" },
	];

    const getTimings = async () => {
        const response = await axios.get(`https://api.aladhan.com/v1/timingsByCity?country=SA&city=${selectedCity.apiName}`);
        setTimings(response.data.data.timings);
    };

    // EFFECT SIDE
    useEffect(() =>{
        getTimings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCity]);
    useEffect(() =>{
        let interval = setInterval(() => {
            setupCountdownTimer();
        }, 1000);
        // END EFFECT SIDE
        const today = moment();
        setToday(today.format('MMMM Do YYYY | h:mm a'));

        return () => {
            clearInterval(interval);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timings]);
    // END EFFECT SIDE

    const setupCountdownTimer = () => {
        const momentNow = moment();

		let prayerIndex = 2;

		if (
			momentNow.isAfter(moment(timings["Fajr"], "hh:mm")) &&
			momentNow.isBefore(moment(timings["Dhuhr"], "hh:mm"))
		) {
			prayerIndex = 1;
		} else if (
			momentNow.isAfter(moment(timings["Dhuhr"], "hh:mm")) &&
			momentNow.isBefore(moment(timings["Asr"], "hh:mm"))
		) {
			prayerIndex = 2;
		} else if (
			momentNow.isAfter(moment(timings["Asr"], "hh:mm")) &&
			momentNow.isBefore(moment(timings["Sunset"], "hh:mm"))
		) {
			prayerIndex = 3;
		} else if (
			momentNow.isAfter(moment(timings["Sunset"], "hh:mm")) &&
			momentNow.isBefore(moment(timings["Isha"], "hh:mm"))
		) {
			prayerIndex = 4;
		} else {
			prayerIndex = 0;
		}

		setNextPrayerIndex(prayerIndex);

		// now after knowing what the next prayer is, we can setup the countdown timer by getting the prayer's time
		const nextPrayerObject = prayersArray[prayerIndex];
		const nextPrayerTime = timings[nextPrayerObject.key];
		const nextPrayerTimeMoment = moment(nextPrayerTime, "hh:mm");

		let remainingTime = moment(nextPrayerTime, "hh:mm").diff(momentNow);

		if (remainingTime < 0) {
			const midnightDiff = moment("23:59:59", "hh:mm:ss").diff(momentNow);
			const fajrToMidnightDiff = nextPrayerTimeMoment.diff(
				moment("00:00:00", "hh:mm:ss")
			);

			const totalDiffernce = midnightDiff + fajrToMidnightDiff;

			remainingTime = totalDiffernce;
		}
		console.log(remainingTime);

		const durationRemainingTime = moment.duration(remainingTime);

		setRemainingTime(
			`${durationRemainingTime.seconds()} : ${durationRemainingTime.minutes()} : ${durationRemainingTime.hours()}`
		);
		console.log(
			"duration issss ",
			durationRemainingTime.hours(),
			durationRemainingTime.minutes(),
			durationRemainingTime.seconds()
		);
    };
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
                        <h2>متبقي حتي صلاة {prayersArray[nextPrayerIndex].displayName}</h2>
                        <h1>{remainingTime}</h1>
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
