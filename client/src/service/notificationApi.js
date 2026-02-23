import axios from "./apiClient";

export function postNotification(notification) {
  return axios.post("/notification/add_notification", notification);
}

export function getNotification() {
  return axios.get("/notification/notifications");
}

export function editNotification(id, notification) {
  return axios.put(`/notification/edit_notification/${id}`, notification);
}
