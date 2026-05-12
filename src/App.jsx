import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import ModelDetail from './pages/ModelDetail'
import Prompts from './pages/Prompts'
import PromptDetail from './pages/PromptDetail'
import PromptNew from './pages/PromptNew'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import About from './pages/About'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Header />
        <main>
          <Routes>
            <Route path="/"            element={<Home />} />
            <Route path="/catalog"     element={<Catalog />} />
            <Route path="/catalog/:id" element={<ModelDetail />} />
            <Route path="/prompts"     element={<Prompts />} />
            <Route path="/prompts/new" element={<PromptNew />} />
          <Route path="/prompts/:id" element={<PromptDetail />} />
            <Route path="/login"       element={<Login />} />
            <Route path="/register"    element={<Register />} />
            <Route path="/profile"     element={<Profile />} />
            <Route path="/about"       element={<About />} />
          </Routes>
        </main>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  )
}
