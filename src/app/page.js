'use client';

import { useState, useRef } from 'react';
import { Upload, Play, Download, Settings, Type, Image as ImageIcon, Music } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import VideoGenerator from '../components/VideoGenerator.js';

export default function Home() {
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

  const handleDownload = () => {
    if (generatedVideo) {
      const link = document.createElement('a');
      link.href = generatedVideo;
      // Use .webm extension since that's what we're generating
      link.download = 'generated-video.webm';
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-6">
          <div className="text-center">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Video Generator
            </h1>
            <p className="text-gray-600 text-lg">
              Create stunning videos with custom text overlaid on your images
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Input Section */}
          <div className="space-y-6">
            {/* Text Input */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Type className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Text Content</h2>
              </div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter your text here... (supports multiple lines)"
                className="w-full h-40 p-4 border-2 border-gray-200 rounded-xl resize-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-gray-700 placeholder-gray-400"
              />
            </div>

            {/* Image Upload */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <ImageIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Background Images</h2>
                </div>
                {backgroundImages.length > 0 && (
                  <button
                    onClick={clearAllImages}
                    className="px-4 py-2 text-red-600 hover:text-red-800 text-sm font-medium bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-200"
                  >
                    Clear All
                  </button>
                )}
              </div>
              
              {/* Upload Area */}
              <div
                {...getRootProps()}
                className={`border-3 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 mb-6 group ${
                  isDragActive
                    ? 'border-blue-500 bg-blue-50 scale-105'
                    : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50 hover:scale-[1.02]'
                }`}
              >
                <input {...getInputProps()} />
                <div className="p-4 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 group-hover:bg-blue-200 transition-colors duration-200">
                  <Upload className="w-8 h-8 mx-auto text-blue-600" />
                </div>
                <p className="text-gray-700 text-lg font-medium mb-2">
                  {isDragActive ? 'Drop images here' : 'Drag & drop images here, or click to select'}
                </p>
                <p className="text-sm text-gray-500">Supports: JPG, PNG, GIF, WebP</p>
              </div>

              {/* Image List */}
              {backgroundImages.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      {backgroundImages.length}
                    </span>
                    Selected Images
                  </h3>
                  {backgroundImages.map((image, index) => (
                    <div key={image.id} className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200">
                      <div className="relative">
                        <img
                          src={image.preview}
                          alt={`Image ${index + 1}`}
                          className="w-20 h-20 object-cover rounded-lg shadow-sm"
                        />
                        <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate mb-2">
                          {image.file.name}
                        </p>
                        <div className="flex items-center gap-3">
                          <label className="text-sm text-gray-600 font-medium">Duration:</label>
                          <input
                            type="number"
                            min="1"
                            max="30"
                            value={image.duration}
                            onChange={(e) => updateImageDuration(image.id, e.target.value)}
                            className="w-20 px-3 py-1 text-sm border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          />
                          <span className="text-sm text-gray-500">seconds</span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeImage(image.id)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                        title="Remove image"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Audio Upload */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Music className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Background Audio</h2>
                </div>
                {audioFile && (
                  <button
                    onClick={removeAudio}
                    className="px-4 py-2 text-red-600 hover:text-red-800 text-sm font-medium bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-200"
                  >
                    Remove Audio
                  </button>
                )}
              </div>
              
              {!audioFile ? (
                <div className="border-3 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 border-gray-300 hover:border-indigo-400 hover:bg-gray-50">
                  <label className="cursor-pointer block">
                    <div className="p-4 bg-indigo-100 rounded-full w-16 h-16 mx-auto mb-4 group-hover:bg-indigo-200 transition-colors duration-200">
                      <Upload className="w-8 h-8 mx-auto text-indigo-600" />
                    </div>
                    <p className="text-gray-700 text-lg font-medium mb-2">
                      Click to upload background audio
                    </p>
                    <p className="text-sm text-gray-500">Supports: MP3, WAV</p>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleAudioUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-100 rounded-lg">
                      <Music className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800 mb-1">
                        {audioFile.name}
                      </p>
                      <audio
                        controls
                        src={audioPreview}
                        className="w-full h-8"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Text Settings */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Settings className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Video Layout */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    Video Layout
                  </label>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setVideoLayout('landscape')}
                      className={`flex-1 p-4 rounded-lg border-2 transition-all duration-200 ${
                        videoLayout === 'landscape'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="w-full h-12 bg-gray-200 rounded-md mb-2"></div>
                      <span className="text-sm font-medium">Landscape</span>
                      <span className="text-xs text-gray-500 block">16:9</span>
                    </button>
                    <button
                      onClick={() => setVideoLayout('portrait')}
                      className={`flex-1 p-4 rounded-lg border-2 transition-all duration-200 ${
                        videoLayout === 'portrait'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="w-8 h-16 bg-gray-200 rounded-md mx-auto mb-2"></div>
                      <span className="text-sm font-medium">Portrait</span>
                      <span className="text-xs text-gray-500 block">9:16</span>
                    </button>
                  </div>
                </div>

                {/* Font Size */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    Font Size: {textSettings.fontSize}px
                  </label>
                  <input
                    type="range"
                    min="16"
                    max="120"
                    value={textSettings.fontSize}
                    onChange={(e) => setTextSettings(prev => ({ ...prev, fontSize: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>16px</span>
                    <span>120px</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    Text Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={textSettings.color}
                      onChange={(e) => setTextSettings(prev => ({ ...prev, color: e.target.value }))}
                      className="w-16 h-12 rounded-lg border-2 border-gray-200 cursor-pointer"
                    />
                    <span className="text-sm text-gray-600">{textSettings.color}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    Position
                  </label>
                  <select
                    value={textSettings.position}
                    onChange={(e) => setTextSettings(prev => ({ ...prev, position: e.target.value }))}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                  >
                    <option value="center">Center</option>
                    <option value="top">Top</option>
                    <option value="bottom">Bottom</option>
                    <option value="top-left">Top Left</option>
                    <option value="top-right">Top Right</option>
                    <option value="bottom-left">Bottom Left</option>
                    <option value="bottom-right">Bottom Right</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    Font Family
                  </label>
                  <select
                    value={textSettings.fontFamily}
                    onChange={(e) => setTextSettings(prev => ({ ...prev, fontFamily: e.target.value }))}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                  >
                    <option value="Arial">Arial</option>
                    <option value="Helvetica">Helvetica</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Verdana">Verdana</option>
                    <option value="Courier New">Courier New</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerateVideo}
              disabled={isGenerating || !text.trim() || backgroundImages.length === 0}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 shadow-xl hover:shadow-2xl flex items-center justify-center gap-3"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-3 border-white border-t-transparent"></div>
                  <span>Generating Video...</span>
                </>
              ) : (
                <>
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Play className="w-6 h-6" />
                  </div>
                  <span>Generate Video</span>
                  {(audioFile || backgroundImages.length > 0) && (
                    <span className="text-sm opacity-90 bg-white/20 px-3 py-1 rounded-full">
                      {audioFile ? `${audioDuration}s` : `${backgroundImages.reduce((total, img) => total + img.duration, 0)}s`}
                    </span>
                  )}
                </>
              )}
            </button>
          </div>

          {/* Preview Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Play className="w-6 h-6 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Preview</h2>
            </div>
            <div className={`relative ${videoLayout === 'portrait' ? 'aspect-[9/16]' : 'aspect-video'} bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-300 overflow-hidden`}>
              {generatedVideo ? (
                <div className="w-full h-full">
                  <video
                    src={generatedVideo}
                    controls
                    className="w-full h-full rounded-2xl object-cover"
                  />
                  <button
                    onClick={handleDownload}
                    className="w-full mt-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center gap-2 font-semibold"
                  >
                    <Download className="w-5 h-5" />
                    Download Video
                  </button>
                </div>
              ) : (
                <div className="text-center text-gray-500 p-8">
                  <div className="p-6 bg-gray-100 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                    <Play className="w-12 h-12 opacity-50" />
                  </div>
                  <p className="text-lg font-medium">Generated video will appear here</p>
                  <p className="text-sm mt-2">Upload images and add text to get started</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
