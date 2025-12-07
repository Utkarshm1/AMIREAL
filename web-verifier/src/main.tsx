import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css' // Created by tailwind CDN implicitly or I can make a dummy one

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
