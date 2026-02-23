export const setItem = (key, data) => {
  try {
    localStorage.setItem(key, data);
  } catch (error) {
    console.log("error setitem");
  }
};

export const getItem = (key) => {
  try {
    const get = localStorage.getItem(key);
    return get;
  } catch (error) {
    console.log("error setitem");
  }
};

export const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.log(error);
  }
};
