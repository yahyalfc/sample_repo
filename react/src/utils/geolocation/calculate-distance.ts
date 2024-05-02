export const distance_service = {
    getDistanceBetweenTwoPoints,
  };
const allowcors = "https://stygianlgdonic-allowcors.herokuapp.com/";

async function getDistanceBetweenTwoPoints (supplierLocation: any, customerLocation: any){
    try {
        const apiURL = `https://maps.googleapis.com/maps/api/directions/json?origin=${supplierLocation.lat},${supplierLocation.lng}&destination=${customerLocation.lat},${customerLocation.lng}&mode=DRIVING&key=${process.env.REACT_APP_GOOGLE_MAP_API_KEY}`;
        const result = await fetch(allowcors + apiURL);
        return (await result.json()).routes[0].legs[0].distance.value
    } catch (err) {
        console.log(err)
        return err
    }
}


 