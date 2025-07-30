'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, Play, Settings, Type, Image as ImageIcon, Music, ArrowLeft, Zap, Palette, Layout, Volume2, Clock } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import VideoGenerator from '../../components/VideoGenerator.js';
import Link from 'next/link';
import styles from "../page.module.css"

export default function Generate() {
  const [text, setText] = useState('');
  const [backgroundImages, setBackgroundImages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [audioPreview, setAudioPreview] = useState(null);
  const [audioDuration, setAudioDuration] = useState(0);
  const [textSettings, setTextSettings] = useState({
    fontSize: 48,
    color: '#ffffff',
    position: 'center',
    fontFamily: 'Arial'
  });
  const [videoLayout, setVideoLayout] = useState('landscape'); // 'landscape' or 'portrait'
  const textareaRef = useRef(null);

  // Handle textarea auto-resize
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      const lineHeight = 24; // Line height in pixels
      const defaultLines = 3; // Default number of lines
      const maxLines = 4; // Maximum lines before showing scrollbar
      const defaultHeight = (lineHeight * defaultLines) + 16; // 16px for padding
      const maxHeight = (lineHeight * maxLines) + 16;

      // Set minimum height for empty or short content
      textarea.style.height = `${defaultHeight}px`;
      
      // If content exceeds default height, adjust up to max height
      const scrollHeight = textarea.scrollHeight;
      if (scrollHeight > defaultHeight) {
        textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
      }
      
      // Show scrollbar if content exceeds max height
      textarea.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden';
    }
  }, [text]);

  const onDrop = (acceptedFiles) => {
    acceptedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBackgroundImages(prev => [...prev, {
          id: Date.now() + Math.random(),
          file: file,
          preview: e.target.result,
          duration: 5 // Default 5 seconds
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: true
  });

  const handleGenerateVideo = async () => {
    if (!text.trim() || backgroundImages.length === 0) {
      alert('Please provide both text and at least one background image');
      return;
    }

    setIsGenerating(true);
    try {
      console.log('VideoGenerator object:', VideoGenerator);
      console.log('Available methods:', Object.getOwnPropertyNames(VideoGenerator));
      
      let videoBlob;
      
      // Check if multi-image method exists, otherwise use single image method
      if (VideoGenerator.generateMultiImageVideo && typeof VideoGenerator.generateMultiImageVideo === 'function') {
        console.log('Using multi-image video generation');
        videoBlob = await VideoGenerator.generateMultiImageVideo(text, backgroundImages, textSettings, audioFile, videoLayout);
      } else {
        console.log('Multi-image method not found, using single image method');
        // Use the first image for now
        videoBlob = await VideoGenerator.generateVideo(text, backgroundImages[0].file, textSettings, audioFile, videoLayout);
      }
      
      setGeneratedVideo(URL.createObjectURL(videoBlob));
      // Scroll to video section after successful generation
      setTimeout(() => {
        const videoSection = document.getElementById('videoPreviewSection');
        if (videoSection) {
          window.scrollTo({
            top: videoSection.offsetTop - 100,
            behavior: 'smooth'
          });
        }
      }, 100);
    } catch (error) {
      console.error('Error generating video:', error);
      alert('Error generating video. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const updateImageDuration = (id, duration) => {
    setBackgroundImages(prev => 
      prev.map(img => 
        img.id === id ? { ...img, duration: parseInt(duration) || 5 } : img
      )
    );
  };

  const removeImage = (id) => {
    setBackgroundImages(prev => prev.filter(img => img.id !== id));
  };

  const clearAllImages = () => {
    setBackgroundImages([]);
  };

  const handleAudioUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAudioFile(file);
      setAudioPreview(URL.createObjectURL(file));
      
      // Get audio duration
      const audio = new Audio();
      audio.src = URL.createObjectURL(file);
      audio.onloadedmetadata = () => {
        setAudioDuration(Math.ceil(audio.duration));
      };
    }
  };

  const removeAudio = () => {
    setAudioFile(null);
    if (audioPreview) {
      URL.revokeObjectURL(audioPreview);
      setAudioPreview(null);
    }
    setAudioDuration(0);
  };



  const totalVideoDuration = audioFile ? audioDuration : backgroundImages.reduce((total, img) => total + img.duration, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-green-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md border-b border-white/30 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <Link 
              href="/"
              className="flex items-center gap-3 text-gray-600 hover:text-gray-800 transition-all duration-300 group hover:scale-105"
            >
              <div className="p-2 bg-gray-100 rounded-full group-hover:bg-gray-200 transition-colors duration-300">
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
              </div>
              <span className="font-semibold">Back to Home</span>
            </Link>
            
            <div className="text-center flex-1">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2 animate-pulse">
                Video Generator Studio
              </h1>
              <p className="text-gray-600 text-lg font-medium">
                Craft your masterpiece with precision
              </p>
            </div>
            
            {/* Progress Indicator */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              {text.length > 0 && (
                <div className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full animate-fade-in">
                  <Type className="w-4 h-4" />
                  <span>Text Ready</span>
                </div>
              )}
              {backgroundImages.length > 0 && (
                <div className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full animate-fade-in">
                  <ImageIcon className="w-4 h-4" />
                  <span>{backgroundImages.length} Images</span>
                </div>
              )}
              {audioFile && (
                <div className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full animate-fade-in">
                  <Music className="w-4 h-4" />
                  <span>Audio Added</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 relative z-10">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Preview Section - Moved to top */}
          <div id="videoPreviewSection" className={videoLayout === 'portrait' ? styles.previewPortrait : styles.previewLandscape}>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-br from-orange-100 to-red-200 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <Play className="w-7 h-7 text-orange-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Live Preview</h2>
                <p className="text-sm text-gray-500">Watch your creation come to life</p>
              </div>
            </div>

            {/* Video Container */}
            <div className={`relative ${
              videoLayout === 'portrait' 
                ? `aspect-[9/16] ${generatedVideo ? 'max-w-[800px]' : 'max-w-[400px]'} transition-all duration-500 mx-auto` 
                : 'aspect-video'
            } mb-6`}>
              <div className="">
                {generatedVideo ? (
                  <video
                    src={generatedVideo}
                    controls
                    className={
                      videoLayout === 'portrait' 
                        ? styles.portraitVideo 
                        : styles.landscapeVideo
                    }
                  
                   />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full py-8">
                    <div className="relative w-32 h-32 mb-6">
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-inner animate-pulse">
                        <Play className="w-16 h-16 opacity-50" />
                      </div>
                      <div className="absolute inset-0 rounded-full border-4 border-dashed border-gray-300 animate-spin"></div>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold mb-3">🎬 Your video preview will appear here</p>
                      <p className="text-base mb-4">Upload images and add text to get started</p>
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>


          </div>

          {/* Controls Grid - 2 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Generate Button */}
            {/* Text Input */}
            <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-white/30 p-8 hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02] group">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <Type className="w-7 h-7 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Text Content</h2>
                  <p className="text-sm text-gray-500">Your words, your story</p>
                </div>
                {text.length > 0 && (
                  <div className="ml-auto flex items-center gap-2 text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">{text.length} characters</span>
                  </div>
                )}
              </div>
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter your inspiring text here... ✨"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl resize-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 text-gray-700 placeholder-gray-400 bg-gradient-to-br from-white to-gray-50"
                  style={{
                    lineHeight: '24px',
                    minHeight: '88px', // 3 lines (24px * 3) + 16px padding
                    maxHeight: '112px' // 4 lines (24px * 4) + 16px padding
                  }}
                />
                {text.length === 0 && (
                  <div className="absolute bottom-4 right-4 text-gray-300">
                    <Palette className="w-6 h-6" />
                  </div>
                )}
              </div>
            </div>

            {/* Image Upload */}
            <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-white/30 p-6 hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02] group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-200 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <ImageIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Background Images</h2>
                    <p className="text-sm text-gray-500">Visual foundation of your video</p>
                  </div>
                </div>
                {backgroundImages.length > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">{totalVideoDuration}s total</span>
                    </div>
                    <button
                      onClick={clearAllImages}
                      className="px-3 py-1 text-red-600 hover:text-white hover:bg-red-500 text-sm font-medium bg-red-50 rounded-lg transition-all duration-300 transform hover:scale-105"
                    >
                      Clear All
                    </button>
                  </div>
                )}
              </div>
              
              {/* Upload Area - Made more compact */}
                              <div
                {...getRootProps()}
                className={`border-3 border-dashed rounded-2xl p-3 text-center cursor-pointer transition-all duration-500 mb-4 group/upload relative overflow-hidden ${
                  isDragActive
                    ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 scale-105 shadow-xl'
                    : 'border-gray-300 hover:border-blue-400 hover:bg-gradient-to-br hover:from-gray-50 hover:to-blue-50 hover:scale-[1.02]'
                }`}
              >
                <input {...getInputProps()} />
                <div className="relative z-10">
                  <div className={`p-3 rounded-full w-12 h-12 mx-auto mb-3 transition-all duration-500 ${
                    isDragActive 
                      ? 'bg-gradient-to-br from-blue-200 to-blue-300 scale-110' 
                      : 'bg-gradient-to-br from-blue-100 to-blue-200 group-hover/upload:scale-110'
                  }`}>
                    <Upload className={`w-5 h-5 mx-auto transition-all duration-500 ${
                      isDragActive ? 'text-blue-700 animate-bounce' : 'text-blue-600'
                    }`} />
                  </div>
                  <p className="text-gray-700 text-base font-semibold mb-1">
                    {isDragActive ? '🎉 Drop your images here!' : '📸 Click or drag images'}
                  </p>
                  <p className="text-xs text-gray-500 font-medium">JPG, PNG, GIF, WebP</p>
                </div>
                
                {/* Animated background elements */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-4 left-4 w-3 h-3 bg-blue-400 rounded-full animate-ping delay-100"></div>
                  <div className="absolute bottom-4 right-4 w-2 h-2 bg-purple-400 rounded-full animate-ping delay-300"></div>
                  <div className="absolute top-1/2 right-8 w-2 h-2 bg-green-400 rounded-full animate-ping delay-500"></div>
                </div>
              </div>

              {/* Image List - Made more compact */}
              {backgroundImages.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-gray-700">Selected Images</h3>
                    <div className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-sm font-bold">
                      {backgroundImages.length} image{backgroundImages.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <div className="grid gap-3">
                    {backgroundImages.map((image, index) => (
                      <div key={image.id} className="flex items-center gap-4 p-4 bg-gradient-to-r from-white to-gray-50 rounded-xl border-2 border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01] group/item">
                        <div className="relative">
                          <img
                            src={image.preview}
                            alt={`Image ${index + 1}`}
                            className="w-20 h-20 object-cover rounded-lg shadow-lg group-hover/item:shadow-xl transition-shadow duration-300"
                          />
                          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg">
                            #{index + 1}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-bold text-gray-800 truncate mb-3">
                            {image.file.name}
                          </p>
                          <div className="flex items-center gap-4">
                            <label className="text-sm text-gray-600 font-semibold">Duration:</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                min="1"
                                max="30"
                                value={image.duration}
                                onChange={(e) => updateImageDuration(image.id, e.target.value)}
                                className="w-20 px-3 py-2 text-sm border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 font-semibold text-center"
                              />
                              <span className="text-sm text-gray-500 font-medium">seconds</span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => removeImage(image.id)}
                          className="p-3 text-red-500 hover:text-white hover:bg-red-500 rounded-xl transition-all duration-300 transform hover:scale-110 group-hover/item:bg-red-50"
                          title="Remove image"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Audio Upload - Made more compact */}
            <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-white/30 p-6 hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02] group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-200 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <Music className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Background Audio</h2>
                    <p className="text-sm text-gray-500">Set the mood with sound</p>
                  </div>
                </div>
                {audioFile && (
                  <button
                    onClick={removeAudio}
                    className="px-3 py-1 text-red-600 hover:text-white hover:bg-red-500 text-sm font-medium bg-red-50 rounded-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Remove Audio
                  </button>
                )}
              </div>
              
              {!audioFile ? (
                <div className="border-3 border-dashed rounded-2xl p-3 text-center cursor-pointer transition-all duration-500 border-gray-300 hover:border-indigo-400 hover:bg-gradient-to-br hover:from-gray-50 hover:to-indigo-50 group/audio">
                  <label className="cursor-pointer block">
                    <div className="p-3 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-full w-12 h-12 mx-auto mb-3 group-hover/audio:scale-110 transition-transform duration-300">
                      <Upload className="w-5 h-5 mx-auto text-indigo-600" />
                    </div>
                    <p className="text-gray-700 text-base font-semibold mb-1">
                      🎵 Upload audio
                    </p>
                    <p className="text-xs text-gray-500 font-medium">MP3, WAV, OGG</p>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleAudioUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <div className="p-4 bg-gradient-to-r from-gray-50 to-indigo-50 rounded-xl border-2 border-indigo-100">
                  <div className="flex items-center gap-6">
                    <div className="p-4 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-2xl">
                      <Volume2 className="w-8 h-8 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-base font-bold text-gray-800 mb-3">
                        {audioFile.name}
                      </p>
                      <audio
                        controls
                        src={audioPreview}
                        className="w-full h-10 rounded-lg"
                      />
                      <div className="flex items-center gap-2 mt-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600 font-medium">Duration: {audioDuration}s</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Video Settings */}
            <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-white/30 p-6 hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02] group">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-purple-100 to-pink-200 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <Settings className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Video Settings</h2>
                  <p className="text-sm text-gray-500">Customize your creation</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Video Layout */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                    <Layout className="w-4 h-4" />
                    Video Layout
                  </label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setVideoLayout('landscape')}
                      className={`flex-1 p-4 rounded-xl border-3 transition-all duration-300 transform hover:scale-105 ${
                        videoLayout === 'landscape'
                          ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 shadow-lg'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-gradient-to-br hover:from-gray-50 hover:to-blue-50'
                      }`}
                    >
                      <div className="w-full h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg mb-2 shadow-inner"></div>
                      <span className="text-sm font-bold">Landscape</span>
                      <span className="text-xs text-gray-500 block mt-1">16:9 • YouTube</span>
                    </button>
                    <button
                      onClick={() => setVideoLayout('portrait')}
                      className={`flex-1 p-4 rounded-xl border-3 transition-all duration-300 transform hover:scale-105 ${
                        videoLayout === 'portrait'
                          ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 shadow-lg'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-gradient-to-br hover:from-gray-50 hover:to-blue-50'
                      }`}
                    >
                      <div className="w-8 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg mx-auto mb-2 shadow-inner"></div>
                      <span className="text-sm font-bold">Portrait</span>
                      <span className="text-xs text-gray-500 block mt-1">9:16 • TikTok</span>
                    </button>
                  </div>
                </div>

                {/* Font Size */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                    <Type className="w-4 h-4" />
                    Font Size: <span className="text-blue-600">{textSettings.fontSize}px</span>
                  </label>
                  <div className="relative">
                    <input
                      type="range"
                      min="16"
                      max="120"
                      value={textSettings.fontSize}
                      onChange={(e) => setTextSettings(prev => ({ ...prev, fontSize: parseInt(e.target.value) }))}
                      className="w-full h-2 bg-gradient-to-r from-blue-200 to-purple-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>16px</span>
                      <span>120px</span>
                    </div>
                  </div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                    <Palette className="w-4 h-4" />
                    Text Color
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <input
                        type="color"
                        value={textSettings.color}
                        onChange={(e) => setTextSettings(prev => ({ ...prev, color: e.target.value }))}
                        className="w-12 h-12 rounded-lg border-2 border-gray-200 cursor-pointer shadow-lg hover:shadow-xl transition-shadow duration-300"
                      />
                      <div className="absolute inset-0 rounded-lg ring-2 ring-blue-500/20 animate-pulse"></div>
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-bold text-gray-700">{textSettings.color}</span>
                      <p className="text-xs text-gray-500">Click to change color</p>
                    </div>
                  </div>
                
                </div>

               

                {/* Font Family and Position in one row */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">
                      Font Family
                    </label>
                    <select
                      value={textSettings.fontFamily}
                      onChange={(e) => setTextSettings(prev => ({ ...prev, fontFamily: e.target.value }))}
                      className="w-full p-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 bg-gradient-to-r from-white to-gray-50 text-sm font-semibold"
                    >
                      <option value="Arial">Arial</option>
                      <option value="Helvetica">Helvetica</option>
                      <option value="Times New Roman">Times</option>
                      <option value="Georgia">Georgia</option>
                      <option value="Verdana">Verdana</option>
                      <option value="Courier New">Courier</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">
                      Position
                    </label>
                    <select
                      value={textSettings.position}
                      onChange={(e) => setTextSettings(prev => ({ ...prev, position: e.target.value }))}
                      className="w-full p-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 bg-gradient-to-r from-white to-gray-50 text-sm font-semibold"
                    >
                      <option value="center">🎯 Center</option>
                      <option value="top">⬆️ Top</option>
                      <option value="bottom">⬇️ Bottom</option>
                      <option value="top-left">↖️ Top L</option>
                      <option value="top-right">↗️ Top R</option>
                      <option value="bottom-left">↙️ Bot L</option>
                      <option value="bottom-right">↘️ Bot R</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Generate Button - Moved to bottom of video preview */}
          </div>

        </div>
      </div>
      <div className="md:col-span-2 flex justify-center">
              <button
                onClick={handleGenerateVideo}
                disabled={isGenerating || !text.trim() || backgroundImages.length === 0}
                className="w-[400px] bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-6 px-8 rounded-3xl font-bold text-xl hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-500 transform hover:scale-[1.02] disabled:scale-100 shadow-2xl hover:shadow-3xl flex items-center justify-center gap-4 relative overflow-hidden group"
              >
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-[-100%] group-hover:translate-x-[100%] skew-x-12"></div>
                
                {isGenerating ? (
                  <>
                    <div className="relative">
                      <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></div>
                      <div className="absolute inset-0 animate-ping rounded-full h-8 w-8 border-2 border-white opacity-30"></div>
                    </div>
                    <span className="animate-pulse">Generating Your Masterpiece...</span>
                  </>
                ) : (
                  <>
                    <div className="p-3 bg-white/20 rounded-2xl group-hover:bg-white/30 transition-colors duration-300">
                      <Zap className="w-8 h-8" />
                    </div>
                    <span>✨ Generate Video Magic</span>
                    {(audioFile || backgroundImages.length > 0) && (
                      <div className="flex items-center gap-2 text-lg opacity-90 bg-white/20 px-4 py-2 rounded-full">
                        <Clock className="w-5 h-5" />
                        <span>{totalVideoDuration}s</span>
                      </div>
                    )}
                  </>
                )}
              </button>
            </div>
           

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .portraitVideo {
          width: 100%;
          max-width: 400px;
          height: auto;
          border-radius: 1.5rem;
          margin: 0 auto;
          display: block;
        }
        .landscapeVideo {
          width: 100%;
          max-width: 800px;
          height: auto;
          border-radius: 1.5rem;
          margin: 0 auto;
          display: block;
        }
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #3b82f6, #8b5cf6);
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
          transition: all 0.3s ease;
        }
        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.6);
        }
      `}</style>
    </div>
  );
} 