const settings = {
  dev: {
    apiUrl: "http://192.168.157.1:8080",

  },
  staging: {
    apiUrl: "http://192.168.100.1:8080",
  },
  prod: {
    apiUrl: "https://shareup.digital/backend",
  },
};

const getCurrentSettings = () => {
  return settings.dev;
};

export default getCurrentSettings();
