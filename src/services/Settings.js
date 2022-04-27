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
  localRaouf: {
    apiUrl: "http://192.168.100.88:8080",
  },
  aws: {
    apiUrl: " https://cors-everywhere.herokuapp.com/http://shareup-env.eba-dzqdjugb.us-west-2.elasticbeanstalk.com",
  },
};

const getCurrentSettings = () => {
  return settings.localRaouf;
};

export default getCurrentSettings();
