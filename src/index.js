import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Main from './Components/Main/Main';
import Home from './Components/Home/Home';
import Cashier from './Components/Cashier/Cashier';
import Orders from './Components/Orders/Orders';
import Holds from './Components/Holds/Holds';

const routes = createBrowserRouter([
  {
    path: '/', element: <Main />
    , children: [
      { index: true, element: <Home /> },
      { path: 'cashier', element: <Cashier /> },
      { path: "orders", element: <Orders /> },
      { path: "holds", element: <Holds /> }
    ]
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router={routes} />
);

