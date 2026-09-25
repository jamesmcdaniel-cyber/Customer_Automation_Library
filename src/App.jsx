import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { GetIt } from './pages/GetIt';
import { TrustIt } from './pages/TrustIt';
import { UseIt } from './pages/UseIt';
import { Example } from './pages/Example';
import { StretchIt } from './pages/StretchIt';
import { Swaps } from './pages/Swaps';
import { ConnectGuide } from './pages/ConnectGuide';

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/get-it" element={<GetIt />} />
        <Route path="/trust-it" element={<TrustIt />} />
        <Route path="/use-it" element={<UseIt />} />
        <Route path="/use-it/swaps" element={<Swaps />} />
        <Route path="/use-it/connect/:platform" element={<ConnectGuide />} />
        <Route path="/example/:id" element={<Example />} />
        <Route path="/stretch-it" element={<StretchIt />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
