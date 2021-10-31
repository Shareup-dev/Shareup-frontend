const settings = {
  dev: {
    apiUrl: process.env.REACT_APP_URL_DEV,
  },
  staging: {
    apiUrl: process.env.REACT_APP_URL_STAGE,
  },
  prod: {
    apiUrl: process.env.REACT_APP_URL_PROD,
  },
};

const getCurrentSettings = () => {
  if (process.env.NODE_ENV === 'development') return settings.dev;
  if (process.env.NODE_ENV === 'production') return settings.prod;
};

export default getCurrentSettings();
