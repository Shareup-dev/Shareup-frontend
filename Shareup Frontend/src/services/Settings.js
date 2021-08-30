
    const settings = {
        dev: {
          apiUrl: "http://195.110.59.203:8081",
        },
        staging: {
          apiUrl: "http://192.168.100.2:8080",
        },
        prod: {
          apiUrl: "http://localhost:8080",
        },
      };
      
      const getCurrentSettings = () => {
        return settings.prod;
      };
      
      export default getCurrentSettings();
