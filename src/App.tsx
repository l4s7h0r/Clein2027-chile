
import Agenda from './components/Agenda';
import TechVisits from './components/TechVisits';
import Participate from './components/Participate';
import Faq from './components/Faq';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Supporters from './components/Supporters';
import Pillars from './components/Pillars';
import Activities from './components/Activities';
import Contact from './components/Contact';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <Hero />
        <About />
        <Pillars />
        <Activities />
        <Agenda />
        <TechVisits />
        <Supporters />
        <Participate />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
