import axios from "axios";

const getAll = (url) => axios.get(`${url}`)

const getUserData = (url, id) => axios.get(`${url}/${id}`);

const getUserTodos = (url, id) => axios.get(`${url}?userId=${id}`);

const getUserPosts = (url, id) => axios.get(`${url}?userId=${id}`);

export {getUserData,getUserTodos,getUserPosts,getAll};