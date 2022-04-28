const settings = {
  dev: {
    apiUrl: "http://34.212.75.111",

  },
  staging: {
    apiUrl: "http://192.168.100.2:8080",

  },
  prod: {
    apiUrl: "https://shareup.digital/backend",
  },
  lokee: {
    apiUrl: "http://192.168.100.88:8080",
  },
};

const getCurrentSettings = () => {
  return settings.dev;
};

export default getCurrentSettings();
