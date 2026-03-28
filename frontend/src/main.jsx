import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {RouterProvider} from 'react-router-dom'
import router from './router.jsx'
import './index.css'
import App from './App.jsx'
import {ContextProvider} from "./context/ContextProvider.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <ContextProvider>
          <RouterProvider router={router}>

          </RouterProvider>
      </ContextProvider>
  </StrictMode>,
)
