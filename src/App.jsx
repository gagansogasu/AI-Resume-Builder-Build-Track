import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import Home from './pages/Home';
import Builder from './pages/Builder';
import Preview from './pages/Preview';
import Proof from './pages/Proof';

// Import older RB Track segments if needed, or redirect them
import RBLayout from './layouts/RBLayout';
import RBStep from './pages/rb/RBStep';
import RBProof from './pages/rb/RBProof';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main AI Resume Builder App */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/builder" element={<Builder />} />
          <Route path="/preview" element={<Preview />} />
          <Route path="/proof" element={<Proof />} />
        </Route>

        {/* Build Track Routes (Legacy/Meta) */}
        <Route path="/rb" element={<RBLayout />}>
          <Route index element={<Navigate to="/rb/01-problem" replace />} />
          <Route path="01-problem" element={<RBStep />} />
          <Route path="02-market" element={<RBStep />} />
          <Route path="03-architecture" element={<RBStep />} />
          <Route path="04-hld" element={<RBStep />} />
          <Route path="05-lld" element={<RBStep />} />
          <Route path="06-build" element={<RBStep />} />
          <Route path="07-test" element={<RBStep />} />
          <Route path="08-ship" element={<RBStep />} />
          <Route path="proof" element={<RBProof />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
