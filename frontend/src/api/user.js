import axiosClient from "../axios-client.js";

export const fetchAllStations = async (page=1) => {
    try{
        const response =  await axiosClient.get(`/stations?page=${page}`);
        return response.data;
    }catch (error){
        console.log("Greska pri dohvatu stanica: ", error);
        throw error;
    }
};

export const fetchAllLines = async (stationId) => {
    try {

        const response = await axiosClient.get(`/stations/${stationId}/lines`);


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
        if (!query || query.trim().length === 0) return [];
        const response = await axiosClient.get(`/station/search?q=${encodeURIComponent(query)}`);
        return response.data.stations || [];
    } catch (error) {
        // Ako backend vrati 404, samo vrati prazan niz umesto da baciš Error
        if (error.response && error.response.status === 404) {
            return [];
        }
        console.error(`Greška pri pretrazi:`, error);
        throw error;
    }
};
