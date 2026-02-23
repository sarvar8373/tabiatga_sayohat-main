import axios from "./apiClient";

export function postPosts(formData) {
  return axios.post("/posts/add_posts", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export function getPosts() {
  return axios.get("/posts/posts");
}

export function getCategories() {
  return axios.get("/category/categories");
}

export function deletePosts(id) {
  return axios.delete(`/posts/post/${id}`);
}

export function putPost(id, updatedPost) {
  return axios.put(`/posts/post/${id}`, updatedPost, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
