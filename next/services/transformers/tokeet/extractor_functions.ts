export const extractFunctions: any = {
    extractAmenities(detailObj: any ){
        if (detailObj) {
            return Object.entries(detailObj).map((keyValuePairArray:any)=>{
                if(keyValuePairArray[1] === 1 || keyValuePairArray[1] === true){
                    return keyValuePairArray[0]
                }
                return null
            }).filter((value: any) => value !== null)
        } else {
            return []
        }
        

    },
    extractPolicy(allowed:any){
        if(allowed){
            return "allowed"
        }
        else{
            return "not allowed"
        }
    },
    extractReservationTime(hour:any, min:any){
        return convertTimeToParts(`${hour}:${min}`)
    }
    // Add other extraction functions as needed
};

function convertTimeToParts(timeString:string) {
    if(timeString) {
        const [hour, minutes] = timeString.split(':').map(Number);
        return {
            hour: ((hour % 12) || 12).toString(),
            minutes: minutes.toString().padStart(2, '0'),
            am_pm: hour >= 12 ? 'PM' : 'AM'
        };
    } else {
        return {
            hour: "0",
            minutes: "0",
            am_pm: ""
        }
    }
    
}