import axios from "./apiClient";

export function postOrganization(credentials) {
  return axios.post("/organization/add_organization", credentials);
}
export function getOrganizations() {
  return axios.get("/organization/organizations");
}
export function getOrganization(id) {
  return axios.get(`/organization/organizations/${id}`);
}
export function deleteOrganization(id) {
  return axios.delete(`organization/organizations/${id}`);
}
export function putOrganization(id, updatedPost) {
  return axios.put(`/organization/organizations/${id}`, updatedPost);
}
export function updateOrganizationCause(id, cause) {
  return axios.put(`/organization/organization/cause/${id}`, { cause });
}
export function updateOrganizationStatus(id, status) {
  return axios.put(`/organization/organization/status/${id}`, { status });
}
