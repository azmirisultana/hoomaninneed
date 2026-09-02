import React from 'react';
import { Link } from 'react-router-dom';
import { HeartHandshake, ShieldCheck, Clock, Users, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Hero Section */}
      <section className="bg-brand-cream text-brand-charcoal py-20 px-4">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight max-w-4xl">
            Rescue Surplus Food, <br/>
            <span className="text-brand-primary">Feed Animals in Need.</span>
          </h1>
          <p className="text-lg md:text-xl text-brand-muted mb-10 max-w-2xl leading-relaxed">
            Join the NoWaste Network. We connect restaurants and cafes with volunteers to deliver surplus food to animal welfare organizations before it goes to waste.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/register" className="bg-brand-primary hover:bg-brand-primary-dark text-white font-bold text-lg px-8 py-4 rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2">
              Get Started <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/login" className="bg-white hover:bg-brand-sage/20 text-brand-charcoal border border-brand-sage font-semibold text-lg px-8 py-4 rounded-xl transition-colors flex items-center justify-center">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-12 bg-white border-y border-brand-sage/30 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-brand-primary mb-1">2.4k</div>
              <div className="text-sm text-brand-muted font-medium uppercase tracking-wide">Meals Rescued</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-brand-amber mb-1">150+</div>
              <div className="text-sm text-brand-muted font-medium uppercase tracking-wide">Active Donors</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-brand-primary mb-1">300+</div>
              <div className="text-sm text-brand-muted font-medium uppercase tracking-wide">Volunteers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-brand-amber mb-1">45</div>
              <div className="text-sm text-brand-muted font-medium uppercase tracking-wide">Animal Shelters</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 px-4 bg-brand-cream">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-charcoal mb-4">How It Works</h2>
            <p className="text-brand-muted max-w-2xl mx-auto">A simple, effective process to ensure perfectly good food reaches animals instead of landfills.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 text-brand-primary border-4 border-brand-sage shadow-sm">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold text-brand-charcoal mb-2">Donate</h3>
              <p className="text-brand-muted">Restaurants and cafes post their surplus food with details and pickup times.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 text-brand-primary border-4 border-brand-sage shadow-sm">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold text-brand-charcoal mb-2">Match</h3>
              <p className="text-brand-muted">Our platform alerts nearby volunteers about the available food donation.</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 text-brand-primary border-4 border-brand-sage shadow-sm">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold text-brand-charcoal mb-2">Transport</h3>
              <p className="text-brand-muted">Volunteers pick up the food and deliver it directly to local animal shelters.</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 text-brand-primary border-4 border-brand-sage shadow-sm">
                <span className="text-xl font-bold">4</span>
              </div>
              <h3 className="text-xl font-bold text-brand-charcoal mb-2">Feed</h3>
              <p className="text-brand-muted">Shelters receive the food, confirming delivery and feeding animals in need.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Us */}
      <section id="about" className="py-20 px-4 bg-white flex-grow">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-charcoal mb-6">About Us</h2>
          <div className="space-y-6 text-lg text-brand-muted leading-relaxed">
            <p>
              HoomanInNeed was founded with a dual mission: to drastically reduce food waste from the hospitality industry and to provide vital nutrition to animal shelters that are often underfunded and overwhelmed.
            </p>
            <p>
              Every day, perfectly good food is thrown away simply because it wasn't sold. Meanwhile, countless stray and sheltered animals go hungry. We bridge this gap by creating a seamless network of generous food donors, dedicated volunteer drivers, and hardworking animal welfare organizations.
            </p>
            <p>
              Together, we are building a more sustainable and compassionate world—one meal at a time.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-charcoal text-brand-sage py-8 text-center">
        <p>© 2026 HoomanInNeed / NoWaste Network. Software Engineering Project.</p>
      </footer>
    </div>
  );
}
