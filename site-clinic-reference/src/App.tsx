import Navigation from './components/Navigation';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Approach from './components/Approach';
import Testimonials from './components/Testimonials';
import Location from './components/Location';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-cream">
      <Navigation />
      <main>
        <Hero />
        <About />
        <Services />
        <Approach />
        <Testimonials />
        <Location />
      </main>
      <Footer />
    </div>
  );
}
