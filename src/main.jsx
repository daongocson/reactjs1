import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import RegisterPage from './pages/register.jsx';
import UserPage from './pages/user.jsx';
import HomePage from './pages/home.jsx';
import LoginPage from './pages/login.jsx';
import { AuthWrapper } from './components/context/auth.context.jsx';
import ListErorPage from './pages/listeeror.jsx';
import BacsiYlenhPage from './pages/bacsiylenh.jsx';
import DSKhamPage from './pages/dskham.jsx';
import TracuubnPage from './pages/tracuubn.jsx';
import ChamcongPage from './pages/Chamcong.jsx';
import CSKHPage from './pages/cksh.jsx';
import YCsuahosoPage from './pages/ycsuahoso.jsx';
import QuantriPage from './pages/quantri.jsx';
import YCtaonickPage from './pages/yctaonick.jsx';
import TrakqPage from './pages/trakq.jsx';
import TestQrPage from './pages/TestQr.jsx';
import CSKHListPage from './pages/ckshList.jsx';
import TracuuICDPage from './pages/tracuuicd.jsx';
import BCDieutriPage from './pages/bcdieutri.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
     /* {
        path: "user",
        element: <UserPage />
      },*/
      {
        path: "ycsuahs",
        element: <YCsuahosoPage />
      },
      {
        path: "testqr",
        element: <TestQrPage />
      },
      {
        path: "listEror",
        element: <ListErorPage />
      },
      {
        path: "tracuubn",
        element: <TracuubnPage />
      }, 
      {
        path: "tracuuicd",
        element: <TracuuICDPage />
      },
      {
        path: "bcdieutri",
        element: <BCDieutriPage />
      },
      {
        path:"/ketquacls/:id",
        element:<TrakqPage />
      },
      {
        path: "khambenh",
        element: <DSKhamPage />
      },
      {
        path: "chamcong",
        element: <ChamcongPage />
      },
      {
        path: "quantri",
        element: <QuantriPage />
      },
      {
        path: "cskh",
        element: <CSKHPage />
      },
      {
        path: "cskhlist",
        element: <CSKHListPage />
      },
      {
        path: "ylenhbs",
        element: <BacsiYlenhPage />
      }, {
        path: "yctaonick",
        element: <YCtaonickPage />
      }
    ]
  },
  {
    path: "register",
    element: <RegisterPage />
  },
  {
    path: "login",
    element: <LoginPage />
  },
]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthWrapper>
      <RouterProvider router={router} />
    </AuthWrapper>
  </React.StrictMode>,
)
