import axios from "axios";

export const CREATE_URL = "api/admin/video";
export const UPDATE_URL = "api/admin/video/{id}";
export const DELETE_URL = "api/admin/video/{id}";
export const LOAD_URL = "api/admin/video/{id}";
export const LOAD_ALL_URL = "api/admin/video";

export const LOAD_VIDEO_FILES = "api/admin/video_file/{id}";
export const CHUNK_UPLOAD_URL = "api/admin/video/upload"
export const REMOVE_VIDEO_FILE = "api/admin/video_file/{id}/remove";
export const UPDATE_VIDEO_FILE = "api/admin/video_file/{id}";

export function create(data) {
  return axios.post(CREATE_URL, data);
}

export function update(id, data) {
  return axios.patch(UPDATE_URL.replace("{id}", id), data);
}

export function remove(id) {
  return axios.delete(DELETE_URL.replace("{id}", id));
}

export function load(id) {
  return axios.get(LOAD_URL.replace("{id}", id));
}

export function loadAll() {
  return axios.get(LOAD_ALL_URL);
}

export function upload(formData)
{
  return axios.post(CHUNK_UPLOAD_URL, formData);
}

export function updateFile(id, data) {
  return axios.patch(UPDATE_VIDEO_FILE.replace("{id}", id), data);
}

export function loadVideos(id, lang_id) {
  return axios.get(LOAD_VIDEO_FILES.replace("{id}", id) + "?lang_id=" + lang_id);
}

export function removeFile(id) {
  return axios.delete(REMOVE_VIDEO_FILE.replace("{id}", id));
}