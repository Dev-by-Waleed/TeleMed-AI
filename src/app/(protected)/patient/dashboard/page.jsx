'use client';

import React from 'react';
import Image from 'next/image';
import {
  Bell,
  Filter,
  Star,
  Clock,
  Video,
  VideoOff,
  MoreHorizontal,
  Pill,
  FileText,
} from 'lucide-react';

const availableDoctors = [
  {
    id: '1',
    name: 'Dr. Emily Chen',
    specialty: 'Cardiology',
    rating: 4.9,
    reviews: 128,
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDIPZ8iXzWEZ7VCl-MpdapGYFf2voe6hf86QuIDJ2c35STIC1PFFzmEOT862CLpJ6r_SpBBco5Omho2Ms_RmrkDUAmhDkwukujcO_xW-PlgLTcBsVKmcWwidGgmXiJsGE94tJ-kwrV4t8---9MUbwPWhCTWAbs7BzF4cd9JHRsCMb3nkAzHImEUmRH1-12BnP1tP7g7tyYXl0qdFPLrOF0SfQYcaImKkVoJQ7JcXSD_CjR-B5TNHbgUPDvHAhbStq50459klIlqjw',
  },
  {
    id: '2',
    name: 'Dr. James Wilson',
    specialty: 'General Practice',
    rating: 4.7,
    reviews: 85,
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAMVcsyJUZ-W6FZSVvGxtWpJwp2cX2MhP5oejopfssYdqx5C8RSbJPsK6nPOItXGmEScy79kMjhCpGwEvozOxAx_SVFyu7-wzJj4apFl0886jb2wtNYM__lbkdX88xC65Y0SSgxy_FPVU-aYrF3gOYZaeTqBGafgrJaI0ZQ-MOiMb_RHCZAFLr_hFnb57h0typsXi2kXfwsitQP0KLR8aG7n4GV_Ala9-30nuWvHOXPDGwe4tFr9YqtCK7YPXUHNFM18b-rxoRfA',
  },
  {
    id: '3',
    name: 'Dr. Sarah Jenkins',
    specialty: 'Dermatology',
    rating: 4.8,
    reviews: 210,
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBKWF3zWGx04ZIHTj4H-rSXerqPinUK50M9nO7igyimwR8AxoBoX5sy_FZeih1_tpiiHDhNyZfbIK270UzuuBUp91h3xyE4I1YDF21ai4CtPwnR_d02FMGhTJd3WKe9LClf4J2RQtJVHlaQcxzm9UxW0RtGFDpfvAEAYTlgOX7KPDz_OTUe9_8amW8oxRrc5J8uazZckhGhgxfY_7jFdLNjuHGtXmR8a-q-uoV1f8eIuF5a6wUtGpVgqAfivJpyBo6m9wuUG4-elA',
  },
];

export default function PatientDashboard() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] font-sans antialiased">
      {/* Main Container */}
      <main className="p-12 px-4 md:px-10 max-w-[1440px] mx-auto min-h-screen">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-[var(--color-foreground)] mb-1">
            Welcome back, Sarah
          </h1>
          <p className="text-base text-[var(--color-on-surface-variant)]">
            Here is an overview of your health dashboard today.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Available Doctors (70% on lg screens) */}
          <section className="lg:col-span-8 flex flex-col gap-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold text-[var(--color-foreground)]">
                Available Doctors
              </h2>
              <button
                type="button"
                aria-label="Filter doctors"
                className="text-[var(--color-outline)] hover:text-[var(--color-primary)] transition-colors"
              >
                <Filter className="w-5 h-5" />
              </button>
            </div>

            {/* Doctor Cards List */}
            {availableDoctors.map((doc) => (
              <div
                key={doc.id}
                className="bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-xl p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center hover:shadow-md transition-shadow"
              >
                <div className="w-20 h-20 rounded-full overflow-hidden shrink-0 relative">
                  {/* <Image
                    src={doc.avatar}
                    alt={doc.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  /> */}
                </div>
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-[var(--color-foreground)]">
                    {doc.name}
                  </h3>
                  <p className="text-sm text-[var(--color-on-surface-variant)]">
                    {doc.specialty}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span className="text-sm font-semibold text-[var(--color-foreground)]">
                      {doc.rating}
                    </span>
                    <span className="text-xs text-[var(--color-outline)]">
                      ({doc.reviews} reviews)
                    </span>
                  </div>
                </div>
                <div className="mt-2 sm:mt-0 w-full sm:w-auto">
                  <button
                    type="button"
                    className="w-full sm:w-auto bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] transition-colors px-6 py-2.5 rounded-lg text-sm font-semibold shadow-sm"
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            ))}
          </section>

          {/* Right Column: Upcoming & Quick Actions (30% on lg screens) */}
          <section className="lg:col-span-4 flex flex-col gap-6">
            <h2 className="text-xl font-semibold text-[var(--color-foreground)]">
              Upcoming
            </h2>

            {/* Next Appointment Card */}
            <div className="bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-xl p-6 flex flex-col gap-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-[var(--color-tertiary)]" />
              
              <div className="pl-2">
                <div className="flex justify-between items-start mb-3">
                  <span className="bg-[var(--color-secondary)] text-[var(--color-foreground)] px-2.5 py-0.5 rounded text-xs font-semibold uppercase tracking-wider">
                    Today
                  </span>
                  <button
                    type="button"
                    aria-label="Options"
                    className="text-[var(--color-outline)] hover:text-[var(--color-foreground)] transition-colors"
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-6 space-y-2">
                  <h3 className="text-lg font-semibold text-[var(--color-foreground)]">
                    Dr. Marcus Vance
                  </h3>
                  <p className="text-sm text-[var(--color-on-surface-variant)] flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[var(--color-outline)]" />
                    2:30 PM - 3:00 PM
                  </p>
                  <p className="text-sm text-[var(--color-on-surface-variant)] flex items-center gap-2">
                    <Video className="w-4 h-4 text-[var(--color-outline)]" />
                    Video Consultation
                  </p>
                </div>

                {/* Disabled Chat Button */}
                <button
                  disabled
                  type="button"
                  className="w-full bg-[var(--color-secondary)] text-[var(--color-on-surface-variant)]/60 cursor-not-allowed px-4 py-2.5 rounded-lg text-sm font-semibold flex justify-center items-center gap-2 border border-[var(--color-outline-variant)]/40"
                >
                  <VideoOff className="w-4 h-4" />
                  Join Chat (Available at 2:25 PM)
                </button>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-[var(--color-surface-card)] border border-[var(--color-outline-variant)] rounded-xl p-6 flex flex-col gap-4">
              <h3 className="text-base font-semibold text-[var(--color-foreground)] border-b border-[var(--color-outline-variant)] pb-3">
                Quick Actions
              </h3>
              <ul className="flex flex-col gap-3">
                <li>
                  <a
                    href="#"
                    className="flex items-center gap-3 text-[var(--color-foreground)] hover:text-[var(--color-primary)] transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-full bg-[var(--color-secondary)] flex items-center justify-center group-hover:bg-[var(--color-primary-fixed-dim)] transition-colors">
                      <Pill className="w-4 h-4 text-[var(--color-primary)]" />
                    </div>
                    <span className="text-sm font-medium">Request Refill</span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center gap-3 text-[var(--color-foreground)] hover:text-[var(--color-primary)] transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-full bg-[var(--color-secondary)] flex items-center justify-center group-hover:bg-[var(--color-primary-fixed-dim)] transition-colors">
                      <FileText className="w-4 h-4 text-[var(--color-primary)]" />
                    </div>
                    <span className="text-sm font-medium">View Lab Results</span>
                  </a>
                </li>
              </ul>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}