import './MentorPage.css'
import Header from '../Header'
import Hero from './Hero'
import Mentors from './Mentors'
import Footer from '../Footer'
const MentorPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Header />
      <Hero />
      <Mentors />
      <Footer />
    </div>
  )
}
export default MentorPage