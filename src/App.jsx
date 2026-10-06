import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { GetIt } from './pages/GetIt';
import { TrustIt } from './pages/TrustIt';
import { UseIt } from './pages/UseIt';
import { Example } from './pages/Example';
import { StretchIt } from './pages/StretchIt';
import { Swaps } from './pages/Swaps';
import { Questions } from './pages/Questions';
import { Resources } from './pages/Resources';
import { ConnectGuide } from './pages/ConnectGuide';
import { GuideIndex, StandaloneGuide } from './pages/StandaloneGuide';

export function App() {
  return (
    <Routes>
      <Route path="/guides" element={<GuideIndex />} />
      <Route path="/guides/:platform" element={<StandaloneGuide />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/get-it" element={<GetIt />} />
        <Route path="/trust-it" element={<TrustIt />} />
        <Route path="/use-it" element={<UseIt />} />
        {/* Swaps and questions moved to Additional resources; old links still land. */}
        <Route path="/use-it/swaps" element={<Navigate to="/resources/swaps" replace />} />
        <Route path="/use-it/questions" element={<Navigate to="/resources/questions" replace />} />
        <Route path="/use-it/connect/:platform" element={<ConnectGuide />} />
        <Route path="/example/:id" element={<Example />} />
        <Route path="/stretch-it" element={<StretchIt />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/resources/swaps" element={<Swaps />} />
        <Route path="/resources/questions" element={<Questions />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
