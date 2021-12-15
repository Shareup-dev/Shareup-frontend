const settings = {
  dev: {
    apiUrl: "http://192.168.100.244:8080",

  },
  staging: {
    apiUrl: "http://192.168.100.2:8080",
  },
  prod: {
    apiUrl: "https://shareup.digital/backend",
  },
};

const getCurrentSettings = () => {
  return settings.staging;
};

export default getCurrentSettings();
