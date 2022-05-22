const settings = {
  dev: {
    // apiUrl: "http://34.212.75.111",
    // apiUrl:"http://shareup-env.eba-em9v8zqj.us-east-1.elasticbeanstalk.com"
    apiUrl:"http://localhost:8080"

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
    apiUrl: "https://cors-everywhere.herokuapp.com/http://shareup-env.eba-em9v8zqj.us-east-1.elasticbeanstalk.com/",
  },
};

const getCurrentSettings = () => {
  return settings.dev;
};

export default getCurrentSettings();
