import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LandingPage from './pages/LandingPage'
import BuyPage from './pages/BuyPage'
import UserDashboard from './pages/UserDashboard'
import MerchantDashboard from './pages/MerchantDashboard'
import RedeemPage from './pages/RedeemPage'
import CompliancePage from './pages/CompliancePage'

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-base-dark">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/buy" element={<BuyPage />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/merchant" element={<MerchantDashboard />} />
            <Route path="/redeem" element={<RedeemPage />} />
            <Route path="/compliance" element={<CompliancePage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
