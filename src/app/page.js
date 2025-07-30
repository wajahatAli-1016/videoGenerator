'use client';

import Link from 'next/link';
import { Play, Sparkles, Video, Image as ImageIcon, Type, Music, ArrowRight, Star, Zap, Users, Award } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-green-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          {/* Main Title */}
          <div className="mb-12 relative">
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-full blur-2xl opacity-60 animate-pulse"></div>
            <h1 className="text-7xl md:text-8xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-8 leading-tight relative animate-fade-in">
              Video Generator
            </h1>
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-blue-800 text-sm font-semibold animate-fade-in-up">
                Powered by AI
              </span>
              <span className="px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full text-green-800 text-sm font-semibold animate-fade-in-up delay-100">
                Easy to Use
              </span>
              <span className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full text-purple-800 text-sm font-semibold animate-fade-in-up delay-200">
                Professional Results
              </span>
            </div>
            <p className="text-2xl md:text-3xl text-gray-700 mb-6 leading-relaxed max-w-3xl mx-auto animate-fade-in-up delay-300">
              Transform your ideas into stunning videos with AI-powered text overlays
            </p>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto animate-fade-in-up delay-400">
              Upload your images, add custom text, and create professional videos in minutes. 
              Perfect for social media, presentations, and creative projects.
            </p>
          </div>

         
          {/* CTA Button */}
          <div className="mb-20 animate-fade-in-up delay-600">
            <Link 
              href="/generate"
              className="inline-flex items-center gap-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-2xl hover:shadow-3xl group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-[-100%] group-hover:translate-x-[100%] skew-x-12"></div>
              <div className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors duration-300">
                <Zap className="w-8 h-8" />
              </div>
              <span>Start Creating Videos</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
            </Link>
          </div>

          {/* Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 group hover:scale-105 hover:-translate-y-2">
              <div className="p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <ImageIcon className="w-8 h-8 text-blue-600 mx-auto" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Multiple Images</h3>
              <p className="text-gray-600">
                Upload multiple images and set custom durations for each to create dynamic video sequences
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 group hover:scale-105 hover:-translate-y-2">
              <div className="p-4 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Type className="w-8 h-8 text-purple-600 mx-auto" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Custom Text</h3>
              <p className="text-gray-600">
                Add beautiful text overlays with customizable fonts, colors, sizes, and positioning
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 group hover:scale-105 hover:-translate-y-2">
              <div className="p-4 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Music className="w-8 h-8 text-green-600 mx-auto" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Background Audio</h3>
              <p className="text-gray-600">
                Add background music or voiceovers to make your videos more engaging and professional
              </p>
            </div>
          </div>

          {/* Video Formats */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-white/20 mb-20">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-12">Perfect for Every Platform</h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-16">
              <div className="text-center group">
                <div className="w-64 h-36 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl border-2 border-blue-300 mb-6 flex items-center justify-center shadow-xl group-hover:shadow-2xl group-hover:scale-105 transition-all duration-300 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-[-100%] group-hover:translate-x-[100%] skew-x-12"></div>
                  <Video className="w-16 h-16 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Landscape (16:9)</h3>
                <p className="text-gray-600">Perfect for YouTube, presentations, and desktop viewing</p>
              </div>
              
              <div className="text-center group">
                <div className="w-36 h-64 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl border-2 border-purple-300 mb-6 flex items-center justify-center shadow-xl group-hover:shadow-2xl group-hover:scale-105 transition-all duration-300 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-[-100%] group-hover:translate-x-[100%] skew-x-12"></div>
                  <Video className="w-16 h-16 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Portrait (9:16)</h3>
                <p className="text-gray-600">Ideal for TikTok, Instagram Stories, and mobile content</p>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="mb-20">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-16">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center group relative">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl flex items-center justify-center text-3xl font-bold mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-[-100%] group-hover:translate-x-[100%] skew-x-12 rounded-2xl"></div>
                  1
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Upload Images</h3>
                <p className="text-gray-600">Drag and drop your images or click to select</p>
              </div>
              
              <div className="text-center group relative">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl flex items-center justify-center text-3xl font-bold mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-[-100%] group-hover:translate-x-[100%] skew-x-12 rounded-2xl"></div>
                  2
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Add Text</h3>
                <p className="text-gray-600">Write your content and customize the appearance</p>
              </div>
              
              <div className="text-center group relative">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl flex items-center justify-center text-3xl font-bold mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-[-100%] group-hover:translate-x-[100%] skew-x-12 rounded-2xl"></div>
                  3
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Configure Settings</h3>
                <p className="text-gray-600">Choose layout, add audio, and adjust timing</p>
              </div>
              
              <div className="text-center group relative">
                <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl flex items-center justify-center text-3xl font-bold mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-[-100%] group-hover:translate-x-[100%] skew-x-12 rounded-2xl"></div>
                  4
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Generate & Download</h3>
                <p className="text-gray-600">Create your video and download in high quality</p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-16 text-white text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-[-100%] group-hover:translate-x-[100%] skew-x-12"></div>
            <h2 className="text-5xl font-bold mb-6 relative">Ready to Create Amazing Videos?</h2>
            <p className="text-2xl mb-10 opacity-90 relative">
              Join thousands of creators who are already making stunning videos with our tool
            </p>
            <Link 
              href="/generate"
              className="inline-flex items-center gap-4 bg-white text-blue-600 px-10 py-5 rounded-2xl font-bold text-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl group/btn relative"
            >
              <Sparkles className="w-6 h-6" />
              <span>Get Started Now</span>
              <ArrowRight className="w-6 h-6 group-hover/btn:translate-x-2 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
          opacity: 0;
        }
        .delay-100 {
          animation-delay: 100ms;
        }
        .delay-200 {
          animation-delay: 200ms;
        }
        .delay-300 {
          animation-delay: 300ms;
        }
        .delay-400 {
          animation-delay: 400ms;
        }
        .delay-500 {
          animation-delay: 500ms;
        }
        .delay-600 {
          animation-delay: 600ms;
        }
      `}</style>
    </div>
  );
}
