class VideoGenerator {
  // Helper function to get canvas dimensions based on layout
  static getCanvasDimensions(layout) {
    if (layout === 'portrait') {
      return { width: 720, height: 1280 }; // 9:16 ratio
    }
    return { width: 1280, height: 720 }; // 16:9 ratio (default landscape)
  }

  // Helper function to wrap text
  static wrapText(context, text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = context.measureText(currentLine + ' ' + word).width;
      if (width < maxWidth) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  }

  static async generateVideo(text, imageFile, textSettings, audioFile, layout = 'landscape') {
    try {
      const dimensions = VideoGenerator.getCanvasDimensions(layout);
      const canvas = document.createElement('canvas');
      canvas.width = dimensions.width;
      canvas.height = dimensions.height;
      const ctx = canvas.getContext('2d');

      // Create audio context if audio file is provided
      let audioContext, audioSource, audioDestination;
      let duration = 5000; // Default 5 seconds in milliseconds

      if (audioFile) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioDestination = audioContext.createMediaStreamDestination();
        
        // Get audio duration
        const audioBuffer = await fetch(URL.createObjectURL(audioFile))
          .then(response => response.arrayBuffer())
          .then(buffer => audioContext.decodeAudioData(buffer));
        
        duration = Math.ceil(audioBuffer.duration * 1000); // Convert to milliseconds and round up
        console.log('Audio duration:', duration, 'ms');
        
        audioSource = audioContext.createBufferSource();
        audioSource.buffer = audioBuffer;
        audioSource.connect(audioDestination);
      }

      // Load image
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = URL.createObjectURL(imageFile);
      });

      // Draw frame function
      const drawFrame = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;
        const imgX = (canvas.width - scaledWidth) / 2;
        const imgY = (canvas.height - scaledHeight) / 2;
        
        ctx.drawImage(img, imgX, imgY, scaledWidth, scaledHeight);

        // Text configuration
        ctx.font = `${textSettings.fontSize}px ${textSettings.fontFamily}`;
        ctx.fillStyle = textSettings.color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

        // Calculate text position and wrap text
        const maxTextWidth = Math.min(scaledWidth - 100, canvas.width - 100);
        const paragraphs = text.split('\n');
        const allLines = [];
        
        paragraphs.forEach(paragraph => {
          const wrappedLines = VideoGenerator.wrapText(ctx, paragraph, maxTextWidth);
          allLines.push(...wrappedLines);
        });

        const lineHeight = textSettings.fontSize * 1.2;
        const totalTextHeight = allLines.length * lineHeight;
        
        let textX = canvas.width / 2;
        let textY = canvas.height / 2;

        // Adjust text position based on settings
        switch (textSettings.position) {
          case 'top':
            textY = textSettings.fontSize * 2;
            break;
          case 'bottom':
            textY = canvas.height - totalTextHeight - textSettings.fontSize;
            break;
          case 'top-left':
            textX = maxTextWidth / 2 + 50;
            textY = textSettings.fontSize * 2;
            ctx.textAlign = 'left';
            break;
          case 'top-right':
            textX = canvas.width - (maxTextWidth / 2 + 50);
            textY = textSettings.fontSize * 2;
            ctx.textAlign = 'right';
            break;
          case 'bottom-left':
            textX = maxTextWidth / 2 + 50;
            textY = canvas.height - totalTextHeight - textSettings.fontSize;
            ctx.textAlign = 'left';
            break;
          case 'bottom-right':
            textX = canvas.width - (maxTextWidth / 2 + 50);
            textY = canvas.height - totalTextHeight - textSettings.fontSize;
            ctx.textAlign = 'right';
            break;
          default: // center
            textY = (canvas.height - totalTextHeight) / 2;
        }

        // Draw each line
        allLines.forEach((line, index) => {
          ctx.fillText(line, textX, textY + (index * lineHeight));
        });
      };

      // Create MediaRecorder
      const stream = canvas.captureStream(30);

      // Add audio track if audio file is provided
      if (audioFile && audioContext && audioDestination) {
        stream.addTrack(audioDestination.stream.getAudioTracks()[0]);
      }

      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus')
        ? 'video/webm;codecs=vp8,opus'
        : 'video/webm';

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: 5000000
      });

      const chunks = [];

      return new Promise((resolve, reject) => {
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          if (audioSource) {
            audioSource.stop();
            audioContext.close();
          }
          const blob = new Blob(chunks, { type: mimeType });
          resolve(blob);
        };

        mediaRecorder.onerror = (error) => {
          if (audioSource) {
            audioSource.stop();
            audioContext.close();
          }
          reject(error);
        };

        // Start recording
        console.log('Starting recording for duration:', duration, 'ms');
        mediaRecorder.start(100);
        if (audioSource) {
          audioSource.start();
        }

        let startTime = performance.now();
        let elapsed = 0;

        const animate = () => {
          elapsed = performance.now() - startTime;
          drawFrame();

          if (elapsed < duration) {
            requestAnimationFrame(animate);
          } else {
            console.log('Stopping recording after:', elapsed, 'ms');
            mediaRecorder.stop();
          }
        };

        animate();
      });
    } catch (error) {
      console.error('Error generating video:', error);
      throw error;
    }
  }

  static async generateMultiImageVideo(text, images, textSettings, audioFile, layout = 'landscape') {
    try {
      const dimensions = VideoGenerator.getCanvasDimensions(layout);
      const canvas = document.createElement('canvas');
      canvas.width = dimensions.width;
      canvas.height = dimensions.height;
      const ctx = canvas.getContext('2d');

      // Create audio context if audio file is provided
      let audioContext, audioSource, audioDestination;
      let audioDuration = 0;
      
      if (audioFile) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioDestination = audioContext.createMediaStreamDestination();
        
        // Get audio duration
        const audioBuffer = await fetch(URL.createObjectURL(audioFile))
          .then(response => response.arrayBuffer())
          .then(buffer => audioContext.decodeAudioData(buffer));
        
        audioDuration = Math.ceil(audioBuffer.duration * 1000);
        console.log('Audio duration:', audioDuration, 'ms');
        
        audioSource = audioContext.createBufferSource();
        audioSource.buffer = audioBuffer;
        audioSource.connect(audioDestination);
      }

      // Load all images
      const loadedImages = await Promise.all(images.map(async (imageData) => {
        const img = new Image();
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = URL.createObjectURL(imageData.file);
        });
        return { img, duration: imageData.duration };
      }));

      // Calculate total video duration from images
      let totalVideoDuration = loadedImages.reduce((sum, img) => sum + (img.duration * 1000), 0);
      console.log('Initial video duration:', totalVideoDuration, 'ms');
      
      // If audio is longer than video, adjust image durations proportionally
      if (audioDuration > 0 && audioDuration > totalVideoDuration) {
        const scaleFactor = audioDuration / totalVideoDuration;
        loadedImages.forEach(img => {
          img.duration = img.duration * scaleFactor;
        });
        totalVideoDuration = audioDuration;
        console.log('Adjusted video duration to match audio:', totalVideoDuration, 'ms');
      }

      // Function to draw frame with current image
      const drawFrame = (currentImage) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const scale = Math.min(canvas.width / currentImage.width, canvas.height / currentImage.height);
        const scaledWidth = currentImage.width * scale;
        const scaledHeight = currentImage.height * scale;
        const imgX = (canvas.width - scaledWidth) / 2;
        const imgY = (canvas.height - scaledHeight) / 2;
        
        ctx.drawImage(currentImage, imgX, imgY, scaledWidth, scaledHeight);

        // Configure text
        ctx.font = `${textSettings.fontSize}px ${textSettings.fontFamily}`;
        ctx.fillStyle = textSettings.color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

        // Calculate text position and wrap text
        const maxTextWidth = Math.min(scaledWidth - 100, canvas.width - 100);
        const paragraphs = text.split('\n');
        const allLines = [];
        
        paragraphs.forEach(paragraph => {
          const wrappedLines = VideoGenerator.wrapText(ctx, paragraph, maxTextWidth);
          allLines.push(...wrappedLines);
        });

        const lineHeight = textSettings.fontSize * 1.2;
        const totalTextHeight = allLines.length * lineHeight;
        
        let textX = canvas.width / 2;
        let textY = canvas.height / 2;

        // Adjust text position based on settings
        switch (textSettings.position) {
          case 'top':
            textY = textSettings.fontSize * 2;
            break;
          case 'bottom':
            textY = canvas.height - totalTextHeight - textSettings.fontSize;
            break;
          case 'top-left':
            textX = maxTextWidth / 2 + 50;
            textY = textSettings.fontSize * 2;
            ctx.textAlign = 'left';
            break;
          case 'top-right':
            textX = canvas.width - (maxTextWidth / 2 + 50);
            textY = textSettings.fontSize * 2;
            ctx.textAlign = 'right';
            break;
          case 'bottom-left':
            textX = maxTextWidth / 2 + 50;
            textY = canvas.height - totalTextHeight - textSettings.fontSize;
            ctx.textAlign = 'left';
            break;
          case 'bottom-right':
            textX = canvas.width - (maxTextWidth / 2 + 50);
            textY = canvas.height - totalTextHeight - textSettings.fontSize;
            ctx.textAlign = 'right';
            break;
          default: // center
            textY = (canvas.height - totalTextHeight) / 2;
        }

        // Draw each line
        allLines.forEach((line, index) => {
          ctx.fillText(line, textX, textY + (index * lineHeight));
        });
      };

      // Create MediaRecorder
      const stream = canvas.captureStream(30);

      // Add audio track if audio file is provided
      if (audioFile && audioContext && audioDestination) {
        stream.addTrack(audioDestination.stream.getAudioTracks()[0]);
      }

      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus')
        ? 'video/webm;codecs=vp8,opus'
        : 'video/webm';

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: 5000000
      });

      const chunks = [];
      
      return new Promise((resolve, reject) => {
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          if (audioSource) {
            audioSource.stop();
            audioContext.close();
          }
          const blob = new Blob(chunks, { type: mimeType });
          console.log('Video generation complete, duration:', totalVideoDuration, 'ms');
          resolve(blob);
        };

        mediaRecorder.onerror = (error) => {
          if (audioSource) {
            audioSource.stop();
            audioContext.close();
          }
          reject(error);
        };

        // Start recording
        console.log('Starting recording for duration:', totalVideoDuration, 'ms');
        mediaRecorder.start(100);
        if (audioSource) {
          audioSource.start();
        }

        let startTime = performance.now();
        let currentImageIndex = 0;
        let elapsedInCurrentImage = 0;

        const animate = () => {
          const currentTime = performance.now();
          const totalElapsed = currentTime - startTime;
          
          if (totalElapsed >= totalVideoDuration) {
            console.log('Finished recording after:', totalElapsed, 'ms');
            mediaRecorder.stop();
            return;
          }

          const currentImage = loadedImages[currentImageIndex];
          drawFrame(currentImage.img);
          
          elapsedInCurrentImage = totalElapsed - loadedImages
            .slice(0, currentImageIndex)
            .reduce((sum, img) => sum + (img.duration * 1000), 0);
          
          if (elapsedInCurrentImage >= currentImage.duration * 1000) {
            currentImageIndex = (currentImageIndex + 1) % loadedImages.length;
            elapsedInCurrentImage = 0;
          }
          
          requestAnimationFrame(animate);
        };

        animate();
      });
    } catch (error) {
      console.error('Error generating video:', error);
      throw error;
    }
  }
}

export default VideoGenerator; 