export const dataGroupBy = (jsonArray, key) => {
  return jsonArray.reduce((acc, currentValue) => {
    let groupKey = "";
    if (currentValue[key] !== "") {
      groupKey = currentValue[key];
    }
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(currentValue);
    return acc;
  }, []);
};
