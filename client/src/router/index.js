import { Typography } from 'antd';
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';

import Home from '../components/Home';
import Login from '../components/Login';

const { Title } = Typography;

const PrivateRoute = (props) => {
  const { isAuthenticated, Component } = props;
  if (isAuthenticated) {
    return (Component || <Outlet />);
  }
  return <Navigate to="/login" />;
};

const Router = (props) => {
  const { isAuthenticated, user, storeUserState } = props;

  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="/" element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
        <Route index element={<Home user={user} storeUserState={storeUserState} />} />
      </Route>
      
      <Route
        path="*"
        element={
          <Title
            level={3}
            style={{
              display: 'inline-block',
              margin: 'auto',
              padding: 0,
              width: '100%',
              textAlign: 'center'
            }}
          >
            There is nothing on this page 😥 <br />
            Go back to <a href="/">sacred timeline</a>.
          </Title>
        }
      />
    </Routes>
  );
};

export { Router };
