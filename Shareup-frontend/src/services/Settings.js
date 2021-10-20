const settings = {
  dev: {
    apiUrl: 'http://localhost:8080',
  },
  staging: {
    apiUrl: 'http://104.43.220.197:8080',
  },
  prod: {
    apiUrl: 'https://shareup.digital/backend',
  },
};

const getCurrentSettings = () => {
  return settings.dev;
};

export default getCurrentSettings();
