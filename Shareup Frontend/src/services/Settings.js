
    const settings = {
        dev: {
          apiUrl: "http://localhost:8080",
        },
        staging: {
          apiUrl: "http://195.110.59.203:8081",
        },
        prod: {
          apiUrl: "http://195.110.59.203:8081",
        },
      };
      
      const getCurrentSettings = () => {
        return settings.prod;
      };
      
      export default getCurrentSettings();
