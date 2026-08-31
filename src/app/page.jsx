import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Users, UserCheck, Calendar, Shield,
  Heart, Brain, Smile, Baby, Eye, MoreHorizontal,
  Video, Star, ChevronRight, Clock, BotMessageSquare
} from 'lucide-react';
import Navbar from '@/Components/layout/Navbar';
import Footer from '@/Components/layout/Footer';
import HomeSearch from '@/Components/ui/HomeSearch';

const doctors = [
  { name: "Dr. Ahmed Raza", spec: "Cardiologist", rating: 4.9, reviews: 320, status: "Online", statusColor: "success", img: "https://images.unsplash.com/photo-1612349317150-e410f624c4a5?auto=format&fit=crop&q=80&w=256&h=256" },
  { name: "Dr. Sara Khan", spec: "Dermatologist", rating: 4.8, reviews: 210, status: "Online", statusColor: "success", img: "https://images.unsplash.com/photo-1594824432258-f2134562547e?auto=format&fit=crop&q=80&w=256&h=256" },
  { name: "Dr. Usman Ali", spec: "Neurologist", rating: 4.7, reviews: 180, status: "Busy", statusColor: "warning", img: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=256&h=256" },
  { name: "Dr. Ayesha Malik", spec: "Pediatrician", rating: 4.9, reviews: 250, status: "Online", statusColor: "success", img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=256&h=256" },
  { name: "Dr. Imran Javed", spec: "Orthopedic", rating: 4.6, reviews: 140, status: "Offline", statusColor: "error", img: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=256&h=256" },
];

const statusStyles = {
  success: { fg: "var(--color-on-success)", bg: "var(--color-success)" },
  warning: { fg: "var(--color-on-warning)", bg: "var(--color-warning)" },
  error: { fg: "var(--color-on-error-container)", bg: "var(--color-error-container)" },
};

const stats = [
  { icon: <Users className="w-8 h-8" style={{ color: 'var(--color-primary)' }} />, count: "12,500+", label: "Happy Patients", desc: "Trusted by thousands of patients", bg: "var(--color-primary-container)" },
  { icon: <UserCheck className="w-8 h-8" style={{ color: 'var(--color-success)' }} />, count: "1,200+", label: "Expert Doctors", desc: "Across 30+ specialties available", bg: "var(--color-tertiary-container)" },
  { icon: <Calendar className="w-8 h-8" style={{ color: 'var(--color-tertiary)' }} />, count: "25,000+", label: "Appointments", desc: "Booked successfully every month", bg: "var(--color-secondary-container)" },
  { icon: <Shield className="w-8 h-8" style={{ color: 'var(--color-warning)' }} />, count: "98%", label: "Satisfaction Rate", desc: "Patients are happy with our services", bg: "var(--color-tertiary-container-light)" },
];

const departments = [
  { icon: <Heart className="w-8 h-8 text-blue-600" />, name: "Cardiology", desc: "Heart & Vascular" },
  { icon: <Brain className="w-8 h-8" style={{ color: 'var(--color-primary)' }} />, name: "Neurology", desc: "Brain & Nerves" },
  { icon: <Smile className="w-8 h-8" style={{ color: 'var(--color-primary)' }} />, name: "Dermatology", desc: "Skin & Hair" },
  { icon: <Baby className="w-8 h-8" style={{ color: 'var(--color-primary)' }} />, name: "Pediatrics", desc: "Child Care" },
  { icon: <Eye className="w-8 h-8" style={{ color: 'var(--color-primary)' }} />, name: "Ophthalmology", desc: "Eye Care" },
  { icon: <MoreHorizontal className="w-8 h-8" style={{ color: 'var(--color-primary)' }} />, name: "Dentistry", desc: "Oral Care" },
  { icon: <MoreHorizontal className="w-8 h-8" style={{ color: 'var(--color-primary)' }} />, name: "More", desc: "See all" },
];

export const metadata = {
  title: "TeleMed AI — Find the Right Doctor in Minutes",
  description: "Book appointments, consult online, get prescriptions and manage your health — all in one place.",
};

export default function Home() {
  return (
    <div className="min-h-screen font-sans transition-colors duration-300" style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-foreground)' }}>
      <Navbar variant="public" />

      {/* HERO SECTION */}
      <section className="relative max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20 flex flex-col md:flex-row items-center gap-12 overflow-hidden">
        {/* Left Content */}
        <div className="flex-1 z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6" style={{ color: 'var(--color-foreground)' }}>
            Find the Right <br />
            <span style={{ color: 'var(--color-primary)' }}>Doctor in Minutes</span>
          </h1>
          <p className="text-lg mb-8 max-w-lg" style={{ color: 'var(--color-on-surface-variant)' }}>
            Book appointments, consult online, get prescriptions and manage your health — all in one place.
          </p>

          <HomeSearch />

          {/* Trust Badges */}
          <div className="flex items-center gap-6 mt-10 text-sm font-medium" style={{ color: 'var(--color-on-surface-variant)' }}>
            <div className="flex items-center gap-2"><Star className="w-5 h-5" style={{ color: 'var(--color-success)' }} /> Verified Doctors</div>
            <div className="flex items-center gap-2"><Shield className="w-5 h-5" style={{ color: 'var(--color-primary)' }} /> Secure & Private</div>
            <div className="flex items-center gap-2"><Clock className="w-5 h-5" style={{ color: 'var(--color-primary)' }} /> 24/7 Support</div>
          </div>
        </div>

        {/* Right Content / Image Area */}
        <div className="flex-1 relative w-full flex justify-center items-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full blur-[100px] opacity-20 -z-10" style={{ backgroundColor: 'var(--color-primary)' }}></div>
          <div className="absolute top-10 right-0 w-[450px] h-[550px] rounded-[100px] rotate-12 -z-10 overflow-hidden" style={{ backgroundColor: 'var(--color-primary)', opacity: 0.8 }}></div>

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
            <div className="absolute top-20 -right-12 p-4 rounded-2xl shadow-xl flex items-center gap-4 z-20 animate-bounce transition-colors" style={{ backgroundColor: 'var(--color-surface-bright)', border: '1px solid var(--color-outline-variant)', animationDuration: '3s' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-tertiary-container)', color: 'var(--color-on-tertiary-container)' }}>
                <Video className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold" style={{ color: 'var(--color-foreground)' }}>Live Consultation</h4>
                <p className="text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>Consult with doctors<br />from anywhere</p>
              </div>
              <ChevronRight className="w-4 h-4 ml-2" style={{ color: 'var(--color-primary)' }} />
            </div>

            {/* Floating Card 2 */}
            <div className="absolute bottom-32 -left-12 p-4 rounded-2xl shadow-xl flex items-center gap-4 z-20 transition-colors" style={{ backgroundColor: 'var(--color-surface-bright)', border: '1px solid var(--color-outline-variant)' }}>
              <div className="text-center border-r pr-4" style={{ borderColor: 'var(--color-outline-variant)' }}>
                <div className="flex items-center gap-1 font-bold text-xl justify-center" style={{ color: 'var(--color-warning)' }}>
                  <Star className="w-5 h-5 fill-current" /> 4.8<span className="text-sm font-normal" style={{ color: 'var(--color-on-surface-variant)' }}>/5</span>
                </div>
                <p className="text-xs font-medium" style={{ color: 'var(--color-on-surface-variant)' }}>2,500+ Reviews</p>
              </div>
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <Image key={i} src={`https://i.pravatar.cc/100?img=${i + 10}`} width={32} height={32} className="w-8 h-8 rounded-full border-2" style={{ borderColor: 'var(--color-surface-bright)' }} alt="Avatar" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE DOCTORS SECTION */}
      <section id="doctors" className="max-w-7xl mx-auto px-4 md:px-8 py-16 scroll-mt-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold" style={{ color: 'var(--color-foreground)' }}>Live Doctors</h2>
            <span className="flex items-center gap-1 text-xs font-medium rounded-full px-2.5 py-1" style={{ backgroundColor: 'var(--color-tertiary-container)', color: 'var(--color-on-tertiary-container)' }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--color-success)' }}></span> Available Now
            </span>
          </div>
          <Link href="/#doctors" className="font-medium text-sm flex items-center gap-1 hover:underline" style={{ color: 'var(--color-primary)' }}>
            View all doctors <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex overflow-x-auto pb-8 -mx-4 px-4 md:mx-0 md:px-0 gap-6 snap-x hide-scrollbar">
          {doctors.map((doc, idx) => {
            const st = statusStyles[doc.statusColor] || statusStyles.success
            return (
            <div key={idx} className="min-w-[280px] rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all snap-start" style={{ backgroundColor: 'var(--color-surface-bright)', border: '1px solid var(--color-outline-variant)' }}>
              <div className="relative mb-4">
                <Image src={doc.img} alt={doc.name} width={256} height={192} className="w-full h-48 object-cover rounded-xl" style={{ backgroundColor: 'var(--color-surface-container-high)' }} />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5" style={{ backgroundColor: st.bg, color: st.fg }}>
                  <Star className="w-3 h-3" /> {doc.status}
                </div>
              </div>
              <h3 className="font-bold text-lg" style={{ color: 'var(--color-foreground)' }}>{doc.name}</h3>
              <p className="text-sm mb-2" style={{ color: 'var(--color-on-surface-variant)' }}>{doc.spec}</p>
              <div className="flex items-center gap-1 text-sm font-medium mb-4">
                <Star className="w-4 h-4 fill-current" style={{ color: 'var(--color-warning)' }} />
                <span style={{ color: 'var(--color-foreground)' }}>{doc.rating}</span>
                <span style={{ color: 'var(--color-on-surface-variant)' }}>({doc.reviews})</span>
              </div>
              <Link
                href={doc.status === 'Offline' ? '/#doctors' : '/signup'}
                className="block w-full py-2.5 rounded-lg font-medium text-sm text-center transition-colors"
                style={
                  doc.status === 'Offline'
                    ? { backgroundColor: 'transparent', border: '1px solid var(--color-outline)', color: 'var(--color-foreground)' }
                    : { backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)' }
                }
              >
                {doc.status === 'Offline' ? 'View Profile' : 'Book Now'}
              </Link>
            </div>
            )
          })}
          <div className="hidden md:flex items-center justify-center min-w-[60px]">
            <button className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-colors" style={{ backgroundColor: 'var(--color-surface-bright)', color: 'var(--color-primary)', border: '1px solid var(--color-outline-variant)' }} aria-label="Next">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <div className="rounded-3xl shadow-sm p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" style={{ backgroundColor: 'var(--color-surface-bright)', border: '1px solid var(--color-outline-variant)' }}>
          {stats.map((stat, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: stat.bg }}>
                {stat.icon}
              </div>
              <div>
                <h3 className="text-2xl font-bold" style={{ color: 'var(--color-foreground)' }}>{stat.count}</h3>
                <p className="text-sm font-semibold" style={{ color: 'var(--color-foreground)' }}>{stat.label}</p>
                <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>{stat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DEPARTMENTS SECTION */}
      <section id="departments" className="max-w-7xl mx-auto px-4 md:px-8 py-16 scroll-mt-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--color-foreground)' }}>Browse by Departments</h2>
          <button className="font-medium text-sm flex items-center gap-1 hover:underline" style={{ color: 'var(--color-primary)' }}>
            View all departments <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {departments.map((dept, idx) => (
            <div key={idx} className="rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all group" style={{ backgroundColor: 'var(--color-surface-bright)', border: '1px solid var(--color-outline-variant)' }}>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" style={{ backgroundColor: 'var(--color-primary-container)' }}>
                {dept.icon}
              </div>
              <h4 className="font-semibold text-sm mb-1" style={{ color: 'var(--color-foreground)' }}>{dept.name}</h4>
              <p className="text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>{dept.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 pb-24">
        <div className="rounded-[32px] overflow-hidden flex flex-col md:flex-row items-center relative border flex-none" style={{ backgroundColor: 'var(--color-primary-container)', borderColor: 'var(--color-primary)' }}>
          <div className="w-full md:w-1/3 relative h-64 md:h-auto overflow-hidden flex items-end justify-center pt-8" style={{ backgroundColor: 'var(--color-primary)' }}>
            <div className="w-64 h-80 rounded-t-3xl flex flex-col relative" style={{ backgroundColor: 'var(--color-surface-bright)', borderColor: 'var(--color-foreground)', borderWidth: '8px', borderBottomWidth: 0 }}>
              <div className="p-4 border-b" style={{ borderColor: 'var(--color-outline-variant)' }}>
                <h5 className="font-bold text-sm" style={{ color: 'var(--color-foreground)' }}>Book Appointment</h5>
              </div>
              <div className="p-4 flex-1 flex flex-col gap-2" style={{ backgroundColor: 'var(--color-surface-container-low)' }}>
                <div className="text-xs text-center font-medium" style={{ color: 'var(--color-on-surface-variant)' }}>&lt; May 2024 &gt;</div>
                <div className="grid grid-cols-7 gap-1 text-[10px] text-center font-medium" style={{ color: 'var(--color-on-surface-variant)' }}>
                  <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
                </div>
                <div className="grid grid-cols-7 gap-1 text-[10px] text-center font-bold">
                  <span style={{ color: 'var(--color-on-surface-variant)', opacity: 0.5 }}>28</span><span style={{ color: 'var(--color-on-surface-variant)', opacity: 0.5 }}>29</span><span style={{ color: 'var(--color-on-surface-variant)', opacity: 0.5 }}>30</span>
                  <span className="rounded-full w-5 h-5 flex items-center justify-center mx-auto" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)' }}>1</span>
                  <span style={{ color: 'var(--color-foreground)' }}>2</span><span style={{ color: 'var(--color-foreground)' }}>3</span><span style={{ color: 'var(--color-foreground)' }}>4</span>
                </div>
              </div>
            </div>
            <div className="absolute top-1/2 right-4 md:-right-8 w-16 h-16 rounded-full flex items-center justify-center shadow-xl border-4" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)', borderColor: 'var(--color-surface-bright)' }}>
              <Clock className="w-8 h-8" />
            </div>
          </div>

          <div className="flex-1 p-8 md:p-16 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-3xl font-bold mb-3" style={{ color: 'var(--color-on-primary-container)' }}>Book Appointment in Just a Few Clicks</h2>
              <p className="text-sm max-w-sm mx-auto md:mx-0" style={{ color: 'var(--color-on-primary-container)', opacity: 0.8 }}>
                Choose your doctor, select time slot and get consultation from anywhere.
              </p>
            </div>
            <Link href="/signup" className="px-8 py-4 rounded-xl font-medium flex items-center gap-2 whitespace-nowrap shadow-lg transition-colors hover:opacity-90" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)' }}>
              <Calendar className="w-5 h-5" /> Book Appointment
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />

      {/* FLOATING ACTION BUTTON */}
      <button className="fixed bottom-6 right-6 group flex flex-col items-center z-50">
        <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl relative hover:scale-110 transition-transform" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)' }}>
          <BotMessageSquare className="w-7 h-7" />
          <span className="absolute top-0 right-0 w-3 h-3 rounded-full border-2" style={{ backgroundColor: 'var(--color-error)', borderColor: 'var(--color-background)' }}></span>
        </div>
        <div className="text-[10px] font-bold px-3 py-1 rounded-full shadow-lg mt-2 uppercase tracking-wide border" style={{ backgroundColor: 'var(--color-surface-bright)', color: 'var(--color-foreground)', borderColor: 'var(--color-outline-variant)' }}>
          AI Assistant
        </div>
      </button>
    </div>
  );
}
