const settings = {
  dev: {
    // apiUrl: "http://34.212.75.111",
    // apiUrl:"http://shareup-env.eba-em9v8zqj.us-east-1.elasticbeanstalk.com"
    apiUrl:"http://192.168.100.22:8080"

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
    apiUrl: "https://shareup-env.eba-em9v8zqj.us-east-1.elasticbeanstalk.com/",
  },
};

const getCurrentSettings = () => {
  return settings.aws;
};

export default getCurrentSettings();
