import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import Dashboard from './pages/Dashboard'
import VaultsPage from './pages/VaultsPage'
import ItemsPage from './pages/ItemsPage'
import CategoriesPage from './pages/CategoriesPage'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/vaults" element={<VaultsPage />} />
          <Route path="/vaults/:vaultId/items" element={<ItemsPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App 