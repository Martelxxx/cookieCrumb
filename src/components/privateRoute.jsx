import { Route, Navigate } from 'react-router-dom';

function PrivateRoute({ isLoggedIn, ...props }) {
  return isLoggedIn ? <Route {...props} /> : <Navigate to="/login" />;
}

export default PrivateRoute;