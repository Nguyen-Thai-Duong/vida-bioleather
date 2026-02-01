/**
 * Team Page
 * Displays team members, roles, and company goals
 */

import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Image from 'next/image';

export default function Team() {
    const [teamData, setTeamData] = useState({ members: [], goals: {} });
    const [loading, setLoading] = useState(true);
    const [scrollY, setScrollY] = useState(0);
    const heroRef = useRef(null);

    useEffect(() => {
        fetchTeamData();
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const fetchTeamData = async () => {
        try {
            const response = await fetch('/api/team');
            const data = await response.json();
            console.log('Team data fetched:', data);
            console.log('Number of members:', data.members?.length);
            setTeamData(data);
        } catch (error) {
            console.error('Error fetching team data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Head>
                <title>Our Team - TechQuality</title>
                <meta name="description" content="Meet the passionate team behind TechQuality" />
            </Head>

            {/* Hero Section - Dynamic & Immersive */}
            <section ref={heroRef} className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-900">
                {/* Animated organic background */}
                <div className="absolute inset-0">
                    <div
                        className="absolute top-1/4 right-10 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"
                        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
                    ></div>
                    <div
                        className="absolute bottom-10 left-10 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse"
                        style={{ transform: `translateY(${-scrollY * 0.2}px)`, animationDelay: '1s' }}
                    ></div>
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.15),transparent_70%)]"></div>
                </div>

                <div className="container mx-auto px-8 text-center relative z-10">
                    <div
                        style={{
                            opacity: Math.max(0, 1 - scrollY / 400),
                            transform: `translateY(${scrollY * 0.4}px)`
                        }}
                    >
                        <div className="inline-flex items-center gap-2 px-5 py-2 bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/30 rounded-full text-emerald-300 text-sm font-bold mb-8">
                            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                            The People Behind the Innovation
                        </div>
                        <h1 className="text-6xl lg:text-8xl font-black mb-8 leading-none text-white">
                            <span className="block mb-3">Meet Our</span>
                            <span className="block bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                                Dream Team
                            </span>
                        </h1>
                        <p className="text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
                            Passionate innovators, scientists, and designers united by a mission to revolutionize sustainable materials
                        </p>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                    <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>
            </section>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-600"></div>
                </div>
            ) : (
                <>
                    {/* Mission & Vision Section - Interactive Cards */}
                    {teamData.goals && (
                        <section className="relative py-32 bg-white overflow-hidden">
                            {/* Background gradient transition */}
                            <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-slate-900 to-white"></div>

                            <div className="container mx-auto px-8 relative z-10">
                                <div className="max-w-6xl mx-auto">
                                    <div className="text-center mb-20">
                                        <div className="inline-block px-5 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold mb-6 tracking-wider uppercase">
                                            Our Purpose
                                        </div>
                                        <h2 className="text-5xl lg:text-6xl font-black text-gray-900 mb-4">
                                            Driven by <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Purpose</span>
                                        </h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
                                        <div className="group relative bg-white p-12 rounded-3xl transition-all duration-700 border border-gray-200 overflow-hidden hover:shadow-2xl hover:-translate-y-2"
                                            style={{ animation: 'fadeInUp 0.6s ease-out both' }}>
                                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                            <div className="relative">
                                                <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl">
                                                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                    </svg>
                                                </div>
                                                <h3 className="text-3xl font-black mb-6 text-gray-900 group-hover:text-emerald-600 transition-colors">Our Mission</h3>
                                                <p className="text-gray-700 leading-relaxed text-lg">{teamData.goals.mission}</p>
                                            </div>
                                        </div>

                                        <div className="group relative bg-white p-12 rounded-3xl transition-all duration-700 border border-gray-200 overflow-hidden hover:shadow-2xl hover:-translate-y-2"
                                            style={{ animation: 'fadeInUp 0.6s ease-out 0.2s both' }}>
                                            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                            <div className="relative">
                                                <div className="w-20 h-20 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl">
                                                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </div>
                                                <h3 className="text-3xl font-black mb-6 text-gray-900 group-hover:text-teal-600 transition-colors">Our Vision</h3>
                                                <p className="text-gray-700 leading-relaxed text-lg">{teamData.goals.vision}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Core Values */}
                                    {teamData.goals.values && (
                                        <div className="relative bg-gradient-to-br from-gray-50 to-emerald-50 p-12 rounded-3xl border border-gray-200 overflow-hidden"
                                            style={{ animation: 'fadeInUp 0.6s ease-out 0.4s both' }}>
                                            <div className="absolute top-10 right-10 w-40 h-40 bg-emerald-400/10 rounded-full blur-2xl"></div>
                                            <h2 className="text-4xl lg:text-5xl font-black mb-12 text-center bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Our Core Values</h2>
                                            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 relative z-10">
                                                {teamData.goals.values.map((value, index) => (
                                                    <div key={index} className="text-center group"
                                                        style={{ animation: `fadeInUp 0.5s ease-out ${0.6 + index * 0.1}s both` }}>
                                                        <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-xl">
                                                            <span className="text-white font-black text-3xl">{value.charAt(0)}</span>
                                                        </div>
                                                        <p className="font-bold text-gray-800 text-base">{value}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <style jsx>{`
                                @keyframes fadeInUp {
                                    from {
                                        opacity: 0;
                                        transform: translateY(30px);
                                    }
                                    to {
                                        opacity: 1;
                                        transform: translateY(0);
                                    }
                                }
                            `}</style>
                        </section>
                    )}

                    {/* Project Video Section - Cinematic */}
                    <section className="relative py-32 bg-gradient-to-b from-gray-50 via-white to-gray-50 overflow-hidden">
                        {/* Animated background elements */}
                        <div className="absolute top-20 left-10 w-72 h-72 bg-teal-200/30 rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

                        <div className="container mx-auto px-8 relative z-10">
                            <div className="text-center mb-16">
                                <div className="inline-block px-5 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold mb-6 tracking-wider uppercase">
                                    Our Journey
                                </div>
                                <h2 className="text-5xl lg:text-6xl font-black mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                    Watch Our Story
                                </h2>
                                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                    Discover how we're revolutionizing sustainable materials
                                </p>
                            </div>
                            <div className="max-w-6xl mx-auto">
                                <div className="group relative aspect-video bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl overflow-hidden shadow-2xl transition-all duration-700 hover:shadow-[0_25px_50px_-12px_rgba(16,185,129,0.3)]">
                                    {/* Decorative frame */}
                                    <div className="absolute inset-0 border-8 border-white/10 rounded-3xl z-10 pointer-events-none group-hover:border-emerald-500/20 transition-colors duration-500"></div>

                                    <iframe
                                        className="absolute top-0 left-0 w-full h-full"
                                        src="https://www.youtube.com/embed/JebylotSvOA?modestbranding=1&rel=0&showinfo=0"
                                        title="Our Team Story"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Team Members Section - Interactive Grid */}
                    <section className="py-32 bg-white">
                        <div className="container mx-auto px-8">
                            <div className="text-center mb-20">
                                <div className="inline-block px-5 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold mb-6 tracking-wider uppercase">
                                    Leadership
                                </div>
                                <h2 className="text-5xl lg:text-6xl font-black mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                    Meet the Innovators
                                </h2>
                                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                    The visionaries driving sustainable change
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 max-w-7xl mx-auto">
                                {teamData.members && teamData.members.map((member, index) => {
                                    const isMale = index === 1;
                                    return (
                                        <div
                                            key={member.id}
                                            className="group relative bg-white rounded-3xl overflow-hidden transition-all duration-700 border border-gray-200 cursor-pointer"
                                            style={{
                                                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                                                transform: 'translateY(0)',
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)';
                                                e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(16, 185, 129, 0.25)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                                            }}
                                        >
                                            {/* Hover glow effect */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-teal-500/0 opacity-0 group-hover:from-emerald-500/5 group-hover:to-teal-500/5 group-hover:opacity-100 transition-all duration-500 pointer-events-none"></div>

                                            <div className={`relative h-56 bg-gradient-to-br ${isMale ? 'from-blue-100 to-indigo-100' : 'from-pink-100 to-purple-100'} flex items-center justify-center overflow-hidden`}>
                                                {/* Animated background pattern */}
                                                <div className="absolute inset-0 opacity-10">
                                                    <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
                                                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-white rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
                                                </div>

                                                <div className={`relative w-28 h-28 rounded-full ${isMale ? 'bg-gradient-to-br from-blue-500 to-indigo-500' : 'bg-gradient-to-br from-pink-500 to-purple-500'} flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-2xl`}>
                                                    <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                                    </svg>
                                                </div>

                                                <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold ${isMale ? 'bg-blue-600' : 'bg-pink-600'} text-white shadow-lg backdrop-blur-sm`}>
                                                    {isMale ? 'Male' : 'Female'}
                                                </div>
                                            </div>

                                            <div className="relative p-6">
                                                <h3 className="text-xl font-black text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors duration-300">
                                                    {member.name}
                                                </h3>
                                                <p className="text-emerald-600 font-bold mb-3 text-sm uppercase tracking-wide">
                                                    {member.role}
                                                </p>
                                                <p className="text-gray-600 text-xs mb-4 leading-relaxed line-clamp-3">
                                                    {member.bio}
                                                </p>
                                                <a
                                                    href={`mailto:${member.email}`}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="inline-flex items-center text-xs text-emerald-600 hover:text-emerald-700 font-semibold group-hover:underline transition-all"
                                                >
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                    </svg>
                                                    Contact
                                                </a>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </section>

                    {/* Join Us Section - Bold CTA */}
                    <section className="relative py-32 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 text-white overflow-hidden">
                        {/* Animated background */}
                        <div className="absolute inset-0">
                            <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
                        </div>

                        <div className="container mx-auto px-8 text-center relative z-10">
                            <div className="max-w-4xl mx-auto">
                                <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white text-sm font-bold mb-8">
                                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                                    We're Hiring
                                </div>
                                <h2 className="text-5xl lg:text-7xl font-black mb-8 leading-tight">
                                    Join the Revolution
                                </h2>
                                <p className="text-xl lg:text-2xl mb-12 opacity-90 leading-relaxed font-light max-w-3xl mx-auto">
                                    We're always seeking talented individuals who share our passion for sustainability, innovation, and creating a better future
                                </p>
                                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                                    <a
                                        href="/contact"
                                        className="group px-10 py-5 bg-white text-emerald-600 rounded-2xl font-bold text-lg hover:bg-gray-100 hover:scale-105 hover:shadow-2xl transition-all duration-300 inline-flex items-center gap-2"
                                    >
                                        Get in Touch
                                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </a>
                                    <a
                                        href="/team"
                                        className="px-10 py-5 bg-white/10 backdrop-blur-sm text-white rounded-2xl font-semibold text-lg border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300"
                                    >
                                        Learn More
                                    </a>
                                </div>
                            </div>
                        </div>
                    </section>
                </>
            )
            }
        </>
    );
}
