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
  lokee: {
    apiUrl: "http://192.168.100.239:8080",
  },
};

const getCurrentSettings = () => {
  return settings.lokee;
};

export default getCurrentSettings();
