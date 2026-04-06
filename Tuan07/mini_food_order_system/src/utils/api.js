import axios from "axios";

const USER_SERVICE = 'http://172.16.40.1:9901';      // User Service
const FOOD_SERVICE = 'http://172.16.40.1:9902';      // Food Service

export const validateUser = async (userId) => {
  const res = await axios.get(`${USER_SERVICE}/users/${userId}`);
  return res.data;
};

export const getFoods = async (foodIds) => {
  const res = await axios.post(`${FOOD_SERVICE}/foods/batch`, foodIds);
  return res.data;
};