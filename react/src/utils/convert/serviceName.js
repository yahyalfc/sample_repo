import { unit_service } from "./quantityUnit";

export const compute_service_data = {
  computeServiceName,
  computeServiceUnit
};

function computeServiceName(serviceID, services) {
  if (services && serviceID) {
    return services.find(({ uid }) => uid === serviceID).serviceName;
  }
}

function computeServiceUnit(serviceID, services) {
  const serviceName = services.find(({ uid }) => uid === serviceID).serviceName;
  return unit_service.convertStatus(serviceName)
}
