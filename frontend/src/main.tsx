import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Home from './Home.tsx'

// import SignUpPage from './components/Signup.tsx'
import ClientPage from './pages/ClientPage.tsx'
import Freelancer from './pages/Freelancer.tsx'


import MentorPage from './pages/MentorPage.tsx'

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/clients" element={<ClientPage />} />
          <Route path="/freelancers" element={<Freelancer />} />
          <Route path="/mentors" element={<MentorPage />} />
          {/* <Route path="/Signup" element={<SignUpPage />} /> */}
        </Routes>
      </BrowserRouter>
    </StrictMode>
  );
}
