import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Vulnerabilidades from './pages/Vulnerabilidades'
import Ativos from './pages/Ativos'
import Contramedidas from './pages/Contramedidas'
import Relatorios from './pages/Relatorios'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/vulnerabilidades" element={<Vulnerabilidades />} />
        <Route path="/ativos" element={<Ativos />} />
        <Route path="/contramedidas" element={<Contramedidas />} />
        <Route path="/relatorios" element={<Relatorios />} />
      </Routes>
    </Layout>
  )
}

export default App