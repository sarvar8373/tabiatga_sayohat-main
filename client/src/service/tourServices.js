import axios from "./apiClient";

export function postTourService(category) {
  return axios.post("/services/add_service", category);
}

export function getTourService() {
  return axios.get("/services/tour_services");
}

export function deleteTourService(id) {
  return axios.delete(`/services/tour_services/${id}`);
}

export function putTourService(id, updatedCategory) {
  return axios.put(`/services/tour_services/${id}`, updatedCategory);
}
