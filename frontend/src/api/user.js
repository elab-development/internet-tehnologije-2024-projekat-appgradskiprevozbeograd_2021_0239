import axiosClient from "../axios-client.js";

export const fetchAllStations = async (page=1) => {
    try{
        const response =  await axiosClient.get(`/stations?page=${page}`);
        console.log(response.data);
        return response.data;
    }catch (error){
        console.log("Greska pri dohvatu stranica: ", error);
        throw error;
    }
};

export const fetchAllLines = async () => {
    try {

        const response = await axiosClient.get("/line/mode/bus");


        return response.data;
    } catch (error) {
        console.error("Greška pri dohvatu linija:", error);
        throw error;
    }
};


export const fetchVehiclesOnLine = async (lineId) => {
    try {
        const response = await axiosClient.get(`/vehicle_positions/line/${lineId}`);
        return response.data;
    } catch (error) {
        console.error(`Greška pri dohvatu vozila za liniju ${lineId}:`, error);
        throw error;
    }
};

export const fetchArrivalsForStation = async (stationId) => {
    try {
        const response = await axiosClient.get(`/tripstop/station/${stationId}`);
        console.log(`Odgovor sa bekenda ${response.data}`);
        return response.data;
    } catch (error) {
        console.error(`Greška pri dohvatu dolazaka za stanicu ${stationId}:`, error);
        return [];
    }
};


export const searchStations = async (query) => {
    try {
        if (!query || query.length < 1) return [];
        const response = await axiosClient.get(`/station/search/${query}`);
        return response.data;
    } catch (error) {
        console.error(`Greška pri pretrazi stanica za '${query}':`, error);
        throw error;
    }
};