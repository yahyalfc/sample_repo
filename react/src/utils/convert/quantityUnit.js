export const unit_service = {
  convertStatus,
  convertStatusString
};

function convertStatus(serviceName) {
  if (serviceName === 'Premix Concrete') return (<>m<sup>3</sup></>)
  else if (serviceName === 'Bricks') return (<>ea</>)
  else if (serviceName === 'Sand') return (<>m<sup>3</sup></>)
  else if (serviceName === 'Rock/Gravel') return (<>m<sup>3</sup></>)
  else return (<>kg/m<sup>3</sup></>)
}


function convertStatusString(serviceName) {
  if (serviceName === 'Premix Concrete') return 'm³'
  else if (serviceName === 'Bricks') return 'ea'
  else if (serviceName === 'Sand') return 'm³'
  else if (serviceName === 'Rock/Gravel') return 'm³'
  else return 'kg/m³'
}
