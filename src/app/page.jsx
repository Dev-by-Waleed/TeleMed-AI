import React from 'react';
import Image from 'next/image';
import {
  Users, UserCheck, Calendar, Shield,
  Heart, Brain, Smile, Baby, Eye, MoreHorizontal,
  Video, Star, ChevronRight, Clock, BotMessageSquare
} from 'lucide-react';
import Navbar from '@/Components/layout/Navbar';
import Footer from '@/Components/layout/Footer';
import HomeSearch from '@/Components/ui/HomeSearch';

const doctors = [
  { name: "Dr. Ahmed Raza", spec: "Cardiologist", rating: 4.9, reviews: 320, status: "Online", statusColor: "text-green-500 bg-green-50", img: "https://images.unsplash.com/photo-1612349317150-e410f624c4a5?auto=format&fit=crop&q=80&w=256&h=256" },
  { name: "Dr. Sara Khan", spec: "Dermatologist", rating: 4.8, reviews: 210, status: "Online", statusColor: "text-green-500 bg-green-50", img: "https://images.unsplash.com/photo-1594824432258-f2134562547e?auto=format&fit=crop&q=80&w=256&h=256" },
  { name: "Dr. Usman Ali", spec: "Neurologist", rating: 4.7, reviews: 180, status: "Busy", statusColor: "text-orange-500 bg-orange-50", img: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=256&h=256" },
  { name: "Dr. Ayesha Malik", spec: "Pediatrician", rating: 4.9, reviews: 250, status: "Online", statusColor: "text-green-500 bg-green-50", img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=256&h=256" },
  { name: "Dr. Imran Javed", spec: "Orthopedic", rating: 4.6, reviews: 140, status: "Offline", statusColor: "text-red-500 bg-red-50", img: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=256&h=256" },
];

const stats = [
  { icon: <Users className="w-8 h-8 text-blue-600" />, count: "12,500+", label: "Happy Patients", desc: "Trusted by thousands of patients", bg: "bg-blue-100" },
  { icon: <UserCheck className="w-8 h-8 text-emerald-600" />, count: "1,200+", label: "Expert Doctors", desc: "Across 30+ specialties available", bg: "bg-emerald-100" },
  { icon: <Calendar className="w-8 h-8 text-purple-600" />, count: "25,000+", label: "Appointments", desc: "Booked successfully every month", bg: "bg-purple-100" },
  { icon: <Shield className="w-8 h-8 text-orange-600" />, count: "98%", label: "Satisfaction Rate", desc: "Patients are happy with our services", bg: "bg-orange-100" },
];

const departments = [
  { icon: <Heart className="w-8 h-8 text-blue-600" />, name: "Cardiology", desc: "Heart & Vascular" },
  { icon: <Brain className="w-8 h-8 text-blue-600" />, name: "Neurology", desc: "Brain & Nerves" },
  { icon: <Smile className="w-8 h-8 text-blue-600" />, name: "Dermatology", desc: "Skin & Hair" },
  { icon: <Baby className="w-8 h-8 text-blue-600" />, name: "Pediatrics", desc: "Child Care" },
  { icon: <Eye className="w-8 h-8 text-blue-600" />, name: "Ophthalmology", desc: "Eye Care" },
  { name: "Dentistry", desc: "Oral Care" },
  { icon: <MoreHorizontal className="w-8 h-8 text-blue-600" />, name: "More", desc: "See all" },
];

export const metadata = {
  title: "TeleMed AI — Find the Right Doctor in Minutes",
  description: "Book appointments, consult online, get prescriptions and manage your health — all in one place.",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground relative transition-colors duration-300">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20 flex flex-col md:flex-row items-center gap-12 overflow-hidden">
        {/* Left Content */}
        <div className="flex-1 z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight mb-6">
            Find the Right <br />
            <span className="text-primary">Doctor in Minutes</span>
          </h1>
          <p className="text-muted-foreground text-lg mb-8 max-w-lg">
            Book appointments, consult online, get prescriptions and manage your health — all in one place.
          </p>

          <HomeSearch />

          {/* Trust Badges */}
          <div className="flex items-center gap-6 mt-10 text-sm font-medium text-muted-foreground">
            <div className="flex items-center gap-2"><Star className="w-5 h-5 text-success" /> Verified Doctors</div>
            <div className="flex items-center gap-2"><Shield className="w-5 h-5 text-primary" /> Secure & Private</div>
            <div className="flex items-center gap-2"><Clock className="w-5 h-5 text-primary" /> 24/7 Support</div>
          </div>
        </div>

        {/* Right Content / Image Area */}
        <div className="flex-1 relative w-full flex justify-center items-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary rounded-full blur-[100px] opacity-20 -z-10"></div>
          <div className="absolute top-10 right-0 w-[450px] h-[550px] bg-primary/80 rounded-[100px] rotate-12 -z-10 overflow-hidden"></div>

          <div className="relative z-10 w-full max-w-[450px]">
            <Image
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800&h=1000"
              alt="Doctor"
              width={800}
              height={1000}
              className="w-full h-auto object-cover rounded-3xl z-10 relative drop-shadow-2xl"
              style={{ maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)' }}
            />

            {/* Floating Card 1 */}
            <div className="absolute top-20 -right-12 bg-card p-4 rounded-2xl shadow-xl border border-border flex items-center gap-4 z-20 animate-bounce transition-colors" style={{ animationDuration: '3s' }}>
              <div className="w-10 h-10 bg-success/20 rounded-full flex items-center justify-center">
                <Video className="w-5 h-5 text-success" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground">Live Consultation</h4>
                <p className="text-xs text-muted-foreground">Consult with doctors<br />from anywhere</p>
              </div>
              <ChevronRight className="w-4 h-4 text-primary ml-2" />
            </div>

            {/* Floating Card 2 */}
            <div className="absolute bottom-32 -left-12 bg-card p-4 rounded-2xl shadow-xl border border-border flex items-center gap-4 z-20 transition-colors">
              <div className="text-center border-r pr-4 border-border">
                <div className="flex items-center gap-1 text-warning font-bold text-xl justify-center">
                  <Star className="w-5 h-5 fill-current" /> 4.8<span className="text-sm text-muted-foreground font-normal">/5</span>
                </div>
                <p className="text-xs text-muted-foreground font-medium">2,500+ Reviews</p>
              </div>
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <Image key={i} src={`https://i.pravatar.cc/100?img=${i + 10}`} width={32} height={32} className="w-8 h-8 rounded-full border-2 border-card" alt="Avatar" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE DOCTORS SECTION */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-foreground">Live Doctors</h2>
            <span className="flex items-center gap-1 text-xs font-medium text-success bg-success/10 px-2.5 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span> Available Now
            </span>
          </div>
          <button className="text-primary font-medium text-sm flex items-center gap-1 hover:underline">
            View all doctors <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex overflow-x-auto pb-8 -mx-4 px-4 md:mx-0 md:px-0 gap-6 snap-x hide-scrollbar">
          {doctors.map((doc, idx) => (
            <div key={idx} className="min-w-[280px] bg-card rounded-2xl border border-border p-4 shadow-sm hover:shadow-xl transition-all snap-start">
              <div className="relative mb-4">
                <Image src={doc.img} alt={doc.name} width={256} height={192} className="w-full h-48 object-cover rounded-xl bg-muted" />
                <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 ${doc.statusColor}`}>
                  <Star className="w-3 h-3" /> {doc.status}
                </div>
              </div>
              <h3 className="font-bold text-lg text-foreground">{doc.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">{doc.spec}</p>
              <div className="flex items-center gap-1 text-sm font-medium mb-4">
                <Star className="w-4 h-4 text-warning fill-current" />
                <span className="text-foreground">{doc.rating}</span>
                <span className="text-muted-foreground">({doc.reviews})</span>
              </div>
              {doc.status === 'Offline' ? (
                <button className="w-full py-2.5 rounded-lg border border-border text-foreground font-medium text-sm hover:bg-muted transition-colors">
                  View Profile
                </button>
              ) : (
                <button className="w-full py-2.5 rounded-lg border border-primary/20 text-foreground font-medium text-sm bg-accent hover:bg-primary hover:text-primary-foreground transition-colors">
                  Book Now
                </button>
              )}
            </div>
          ))}
          <div className="hidden md:flex items-center justify-center min-w-[60px]">
            <button className="w-12 h-12 rounded-full bg-card shadow-lg flex items-center justify-center text-primary hover:bg-accent transition-colors border border-border">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <div className="bg-card rounded-3xl border border-border shadow-sm p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-border transition-colors">
          {stats.map((stat, idx) => (
            <div key={idx} className={`flex items-center gap-4 ${idx !== 0 ? 'md:pl-8 pt-6 md:pt-0' : ''}`}>
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${stat.bg} shrink-0`}>
                {stat.icon}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">{stat.count}</h3>
                <p className="text-sm font-semibold text-foreground">{stat.label}</p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{stat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DEPARTMENTS SECTION */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-foreground">Browse by Departments</h2>
          <button className="text-primary font-medium text-sm flex items-center gap-1 hover:underline">
            View all departments <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {departments.map((dept, idx) => (
            <div key={idx} className="bg-card border border-border rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary/50 hover:shadow-lg transition-all group">
              <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {dept.icon}
              </div>
              <h4 className="font-semibold text-sm text-foreground mb-1">{dept.name}</h4>
              <p className="text-xs text-muted-foreground">{dept.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 pb-24">
        <div className="bg-accent rounded-[32px] overflow-hidden flex flex-col md:flex-row items-center relative border border-primary/20 transition-colors">
          <div className="w-full md:w-1/3 relative h-64 md:h-auto overflow-hidden bg-primary/10 flex items-end justify-center pt-8">
            <div className="w-64 h-80 bg-card rounded-t-3xl border-8 border-foreground border-b-0 shadow-2xl relative flex flex-col">
              <div className="p-4 border-b border-border">
                <h5 className="font-bold text-sm text-foreground">Book Appointment</h5>
              </div>
              <div className="p-4 flex-1 bg-muted flex flex-col gap-2">
                <div className="text-xs text-muted-foreground text-center font-medium">&lt; May 2024 &gt;</div>
                <div className="grid grid-cols-7 gap-1 text-[10px] text-center font-medium text-muted-foreground">
                  <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
                </div>
                <div className="grid grid-cols-7 gap-1 text-[10px] text-center font-bold">
                  <span className="text-muted-foreground/50">28</span><span className="text-muted-foreground/50">29</span><span className="text-muted-foreground/50">30</span>
                  <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center mx-auto">1</span>
                  <span className="text-foreground">2</span><span className="text-foreground">3</span><span className="text-foreground">4</span>
                </div>
              </div>
            </div>
            <div className="absolute top-1/2 right-4 md:-right-8 w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-xl border-4 border-card text-primary-foreground">
              <Clock className="w-8 h-8" />
            </div>
          </div>

          <div className="flex-1 p-8 md:p-16 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-3">Book Appointment in Just a Few Clicks</h2>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto md:mx-0">
                Choose your doctor, select time slot and get consultation from anywhere.
              </p>
            </div>
            <button className="bg-primary text-primary-foreground px-8 py-4 rounded-xl font-medium hover:bg-primary/90 hover:text-foreground transition-colors flex items-center gap-2 whitespace-nowrap shadow-lg">
              <Calendar className="w-5 h-5" /> Book Appointment
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />

      {/* FLOATING ACTION BUTTON */}
      <button className="fixed bottom-6 right-6 group flex flex-col items-center z-50">
        <div className="bg-primary w-14 h-14 rounded-full flex items-center justify-center shadow-xl text-primary-foreground relative hover:scale-110 transition-transform">
          <BotMessageSquare className="w-7 h-7" />
          <span className="absolute top-0 right-0 w-3 h-3 bg-destructive rounded-full border-2 border-background"></span>
        </div>
        <div className="bg-card text-foreground text-[10px] font-bold px-3 py-1 rounded-full shadow-lg mt-2 uppercase tracking-wide border border-border">
          AI Assistant
        </div>
      </button>
    </div>
  );
}
