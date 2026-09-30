import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { CreateProjectPage } from './pages/CreateProjectPage';
import { ProjectDetailsPage } from './pages/ProjectDetailsPage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create" element={<CreateProjectPage />} />
            <Route path="/project/:projectId" element={<ProjectDetailsPage />} />
            <Route path="/edit/:projectId" element={<CreateProjectPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
