const settings = {
  dev: {
    apiUrl: "http://localhost:8080",
  },
  staging: {
    apiUrl: "http://104.43.220.197:8080",
  },
  prod: {
    apiUrl: "http://backend.shareup.digital",
  },
};

const getCurrentSettings = () => {
  return settings.prod;
};

export default getCurrentSettings();
