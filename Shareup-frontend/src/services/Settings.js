const settings = {
  dev: {
    // apiUrl: "http://localhost:8080",
    apiUrl: "http://192.168.100.91:8080",

  },
  staging: {
    // apiUrl: "http://104.43.220.197:8080",
    apiUrl: "http://192.168.100.1:8080",
  },
  prod: {
    apiUrl: "https://shareup.digital/backend",
  },
};

const getCurrentSettings = () => {
  return settings.prod;
};

export default getCurrentSettings();
