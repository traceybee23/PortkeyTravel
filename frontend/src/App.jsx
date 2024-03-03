import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navigation from './components/Navigation';
import * as sessionActions from './store/session'
import SpotsIndex from './components/SpotsList/SpotsIndex';
import SingleSpot from './components/SingleSpot/SingleSpot';
import { Navigate } from 'react-router-dom';
import SpotReviews from './components/SpotReviews';
import CreateSpotForm from './components/CreateSpotForm/CreateSpotForm';
import CurrUserSpots from './components/CurrUserSpots';
import UpdateSpotForm from './components/UpdateSpotForm';
import CurrUserReviews from './components/CurrUserReviews';

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
        element: <SpotsIndex />
      },
      {
        path: '/spots/:spotId',
        element: <SingleSpot />
      },
      {
        path: '/spots/:spotId/reviews',
        element: <SpotReviews />
      },
      {
        path: '/spots/new',
        element: <CreateSpotForm />
      },
      {
        path: '/spots/current',
        element: <CurrUserSpots />
      },
      {
        path: '/spots/:spotId/edit',
        element: <UpdateSpotForm />
      },
      {
        path: '/reviews/current',
        element: <CurrUserReviews />
      },
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
