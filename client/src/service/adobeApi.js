import axios from "./apiClient";

const AdobeService = {
  async postTour(tour) {
    const response = await axios.post("/tours/add_tour", { tour });
    return response.data;
  },
};

export function postTour(credentials) {
  return axios.post("/tours/add_tour", credentials, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
export function getTours() {
  return axios.get("/tours");
}
export function getCategories() {
  return axios.get("/category/categories");
}
export function deleteTours(id) {
  return axios.delete(`/tours/tour/${id}`);
}
export function putTour(id, updatedPost) {
  return axios.put(`/tours/tour/${id}`, updatedPost, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export function updateTourCause(id, cause) {
  return axios.put(`/tours/tour/cause/${id}`, { cause });
}
export function updateTourStatus(id, status) {
  return axios.put(`/tours/tour/status/${id}`, { status });
}
