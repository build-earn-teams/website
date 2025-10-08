import './App.css'
import Header from './Header'
import Hero from './Hero'
import Mentors from './Mentors'
import Footer from './Footer'

function App() {

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Mentors />
      </main>
      <Footer />
    </div>
  )
}

export default App
