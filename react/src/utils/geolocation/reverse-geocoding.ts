export const location_service = {
  getAddressFromLocation,
  getAdressFromTextInput,
  getLocationDetails
};
const allowcors = "https://stygianlgdonic-allowcors.herokuapp.com/";

async function getAddressFromLocation(latitude: any, longitude: any) {  
  try {
    const apiURL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.REACT_APP_GOOGLE_MAP_API_KEY}`;
    const result = await fetch(allowcors + apiURL);
    const response = await result.json();
    return response.results[0].formatted_address;
  } catch (err) {
    console.log(err);
    return err;
  }
}

async function getAdressFromTextInput(input: any, latitude: any, longitude:any) {
  try {
      const apiURL = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${process.env.REACT_APP_GOOGLE_MAP_API_KEY}&input=${input}&location=${latitude},${longitude}`;
      const result = await fetch(allowcors + apiURL);
      return result.json();
  }
  catch (err) {
      return err;
  }
}

async function getLocationDetails(placeID: any) {
  
  try {
      const apiURL = `https://maps.googleapis.com/maps/api/place/details/json?key=${process.env.REACT_APP_GOOGLE_MAP_API_KEY}&fields=geometry&place_id=${placeID}`;
      const result = await fetch(allowcors + apiURL);
      return result.json();
  }
  catch (err) {
      return err;
  }
}