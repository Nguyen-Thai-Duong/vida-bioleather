/**
 * Team Page
 * Displays team members, roles, and company goals
 */

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';

export default function Team() {
    const [teamData, setTeamData] = useState({ members: [], goals: {} });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTeamData();
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

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-5xl font-bold mb-6">Meet Our Team</h1>
                    <p className="text-xl max-w-3xl mx-auto">
                        Passionate individuals working together to bring you the best technology products
                    </p>
                </div>
            </section>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-600"></div>
                </div>
            ) : (
                <>
                    {/* Mission & Vision Section */}
                    {teamData.goals && (
                        <section className="py-16 bg-gray-50">
                            <div className="container mx-auto px-4">
                                <div className="max-w-4xl mx-auto">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                                        <div className="bg-white p-8 rounded-lg shadow-md">
                                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                            </div>
                                            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                                            <p className="text-gray-700 leading-relaxed">{teamData.goals.mission}</p>
                                        </div>

                                        <div className="bg-white p-8 rounded-lg shadow-md">
                                            <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                                                <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            </div>
                                            <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
                                            <p className="text-gray-700 leading-relaxed">{teamData.goals.vision}</p>
                                        </div>
                                    </div>

                                    {/* Core Values */}
                                    {teamData.goals.values && (
                                        <div className="bg-white p-8 rounded-lg shadow-md">
                                            <h2 className="text-2xl font-bold mb-6 text-center">Our Core Values</h2>
                                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                                {teamData.goals.values.map((value, index) => (
                                                    <div key={index} className="text-center">
                                                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                                            <span className="text-white font-bold text-xl">{value.charAt(0)}</span>
                                                        </div>
                                                        <p className="font-semibold text-gray-800">{value}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Project Video Section */}
                    <section className="py-16 bg-white">
                        <div className="container mx-auto px-4">
                            <h2 className="text-3xl font-bold text-center mb-8">Our Story</h2>
                            <div className="max-w-4xl mx-auto">
                                <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden shadow-lg">
                                    {/* YouTube Embedded Video */}
                                    {/* To use: 1. Upload video to YouTube 2. Get video ID from URL 3. Replace dQw4w9WgXcQ below */}
                                    {/* IMPORTANT: Video must be set to "Unlisted" or "Public" (NOT "Private") for embedding to work */}
                                    <iframe
                                        className="absolute top-0 left-0 w-full h-full"
                                        src="https://www.youtube.com/embed/JebylotSvOA?modestbranding=1&rel=0&showinfo=0"
                                        title="Our Team Story"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                                <p className="text-center text-gray-600 mt-4">
                                    Learn about our sustainable mission and the team behind VIDA Bioleather
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Team Members Section */}
                    <section className="py-16 bg-gray-50">
                        <div className="container mx-auto px-4">
                            <h2 className="text-3xl font-bold text-center mb-4">Our Leadership Team</h2>
                            <p className="text-center text-gray-600 mb-12">
                                Meet the experts driving innovation and excellence
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
                                {teamData.members && teamData.members.map((member, index) => {
                                    // Nguyen Thai Duong (CTO, index 1) is male, others are female
                                    const isMale = index === 1;
                                    return (
                                        <div
                                            key={member.id}
                                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                                        >
                                            <div className="relative h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                                                {/* Gender-appropriate icon */}
                                                <div className={`w-24 h-24 rounded-full ${isMale ? 'bg-blue-500' : 'bg-pink-500'} flex items-center justify-center`}>
                                                    <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                                    </svg>
                                                </div>
                                                {/* Gender badge */}
                                                <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold ${isMale ? 'bg-green-600' : 'bg-pink-600'} text-white`}>
                                                    {isMale ? 'Male' : 'Female'}
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <h3 className="text-lg font-bold text-gray-800 mb-1">{member.name}</h3>
                                                <p className="text-green-600 font-semibold mb-2 text-sm">{member.role}</p>
                                                <p className="text-gray-600 text-xs mb-3">{member.bio}</p>
                                                <a
                                                    href={`mailto:${member.email}`}
                                                    className="text-xs text-green-600 hover:underline flex items-center"
                                                >
                                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

                    {/* Join Us Section */}
                    <section className="py-16 bg-gradient-to-r from-green-600 to-teal-600 text-white">
                        <div className="container mx-auto px-4 text-center">
                            <h2 className="text-3xl font-bold mb-4">Join Our Team</h2>
                            <p className="text-xl mb-8 max-w-2xl mx-auto">
                                We're always looking for talented individuals who share our passion for innovation
                            </p>
                            <a
                                href="/contact"
                                className="inline-block bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                            >
                                Get in Touch
                            </a>
                        </div>
                    </section>
                </>
            )
            }
        </>
    );
}
