import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navigation from './components/Navigation';
import * as sessionActions from './store/session'
import SpotsIndex from './components/SpotsList/SpotsIndex';
import SingleSpot from './components/SingleSpot/SingleSpot';
import { Navigate } from 'react-router-dom';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    })
  }, [dispatch])

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <SpotsIndex/>
      },
      {
        path: '/spots/:spotId',
        element: <SingleSpot />
      }
    ]
  },
  {
    path: '*',
    element: <Navigate to='/' replace={true} />
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
