const settings = {
  dev: {
    apiUrl: "http://192.168.100.91:8080",

  },
  staging: {
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
