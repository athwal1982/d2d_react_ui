const CentralServiceProvider = () => {
  if (process.env.NODE_ENV !== "development") {
    console.log = () => {};
  }
  if (process.env.NODE_ENV) {
    console.warn = () => {};
  }
};
export default CentralServiceProvider;
