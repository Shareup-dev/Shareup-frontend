const settings = {
  dev: {
    apiUrl: "http://localhost:8081",
  },
  staging: {
    apiUrl: "http://104.43.220.197:8081",
  },
  prod: {
    apiUrl: "http://backend.shareup.digital",
  },
};

const getCurrentSettings = () => {
  return settings.prod;
};

export default getCurrentSettings();
