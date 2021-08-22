import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import AuthService from '../services/auth.services';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  return (
    <Route {...rest} render={
      props => {
          if(AuthService.isLoggedIn()) {
              return <Component {...rest} {...props} />
          }else{
            return <Redirect to="/" />
          }
        }
      
    } />
  )
}


export default ProtectedRoute;