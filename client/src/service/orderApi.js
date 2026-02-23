import axios from "./apiClient";
export function postOrder(order) {
  return axios.post("/orders/add_order", order);
}

export function getOrder() {
  return axios.get("/orders/orders");
}

export function editOrder(id, order) {
  return axios.put(`/orders/order/${id}`, order);
}

export function deleteOrder(id) {
  return axios.delete(`/orders/order/${id}`);
}
