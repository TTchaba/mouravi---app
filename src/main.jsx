import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AnalyticsRouter from './AnalyticsRouter.jsx'

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <div className="font-agronomy">
      <AnalyticsRouter />
    </div>
  </StrictMode>
)