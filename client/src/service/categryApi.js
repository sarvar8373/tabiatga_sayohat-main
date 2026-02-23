import axios from "./apiClient";

export function postCategory(category) {
  return axios.post("/category/add_categories", category);
}

export function getCategories() {
  return axios.get("/category/categories");
}

export function deleteCategory(id) {
  return axios.delete(`/category/categories/${id}`);
}

export function putCategory(id, updatedCategory) {
  return axios.put(`/category/categories/${id}`, updatedCategory);
}
