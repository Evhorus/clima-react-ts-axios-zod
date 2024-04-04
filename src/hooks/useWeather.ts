import axios from "axios";
import { SearchType } from "../types";
// import { object, string, number, Output, parse } from "valibot";
import { z } from "zod";
import { useMemo, useState } from "react";

// TYPE GUARD o ASSERTION = comporar respuesta de una api sin librerias
// const isWeatherReponse = (weather: unknown): weather is Weather => {
//   return (
//     Boolean(weather) &&
//     typeof weather === "object" &&
//     typeof (weather as Weather).name === "string" &&
//     typeof (weather as Weather).main.temp === "number" &&
//     typeof (weather as Weather).main.temp_min === "number" &&
//     typeof (weather as Weather).main.temp_max === "number"
//   );
// };

// Con zod
export type Weather = z.infer<typeof Weather>;
const Weather = z.object({
  name: z.string(),
  main: z.object({
    temp: z.number(),
    temp_min: z.number(),
    temp_max: z.number(),
  }),
});

// Con valibot
// type Weather = Output<typeof WeatherSchema>;

// const WeatherSchema = object({
//   name: string(),
//   main: object({
//     temp: number(),
//     temp_min: number(),
//     temp_max: number(),
//   }),
// });

const initialState = {
  name: "",
  main: {
    temp: 0,
    temp_min: 0,
    temp_max: 0,
  },
};
export default function useWeather() {
  const [weather, setWeather] = useState<Weather>(initialState);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const fetchWeather = async (search: SearchType) => {
    const appId = import.meta.env.VITE_API_KEY;
    setLoading(true);
    setWeather(initialState);
    try {
      const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${search.city},${search.country}&appid=${appId}`;
      const { data } = await axios(geoUrl);

      //comporbar si existe

      if (!data[0]) {
        setNotFound(true);
        return;
      }
      const lat = data[0].lat;
      const lon = data[0].lon;
      console.log(data);

      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appId}`;

      const { data: weatherResults } = await axios(weatherUrl);
      console.log(weatherResults);
      //   const result = isWeatherReponse(weatherResults); -> TYPE GUARD o ASSERTION

      //   const result = Weather.safeParse(weatherResults); -> Con zod

      // const result = parse(WeatherSchema, weatherResults);  -> Con valibot

      const result = Weather.safeParse(weatherResults);
      if (result.success) {
        setWeather(result.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const hasWeatherData = useMemo(() => weather.name, [weather]);
  return {
    fetchWeather,
    weather,
    hasWeatherData,
    loading,
    notFound,
  };
}
