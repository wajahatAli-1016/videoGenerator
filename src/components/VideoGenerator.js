class VideoGenerator {
  
  static async generateVideoWithCanvas(text, imageFile, textSettings) {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Load image
      const imageUrl = URL.createObjectURL(imageFile);
      const img = new Image();
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imageUrl;
      });

      // Set canvas size
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw background image
      ctx.drawImage(img, 0, 0);

      // Function to wrap text to fit within a specified width
      const wrapText = (ctx, text, maxWidth) => {
        const words = text.split(' ');
        const lines = [];
        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
          const word = words[i];
          const width = ctx.measureText(currentLine + ' ' + word).width;
          if (width < maxWidth) {
            currentLine += ' ' + word;
          } else {
            lines.push(currentLine);
            currentLine = word;
          }
        }
        lines.push(currentLine);
        return lines;
      };

      // Configure text
      ctx.font = `${textSettings.fontSize}px ${textSettings.fontFamily}`;
      ctx.fillStyle = textSettings.color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Add text shadow for better visibility
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;

      // Calculate text position and max width
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const padding = 50;
      // Use the image width for text wrapping, with padding
      const maxTextWidth = img.width - (padding * 2);

      let textX, textY, textAlign, textBaseline;
      switch (textSettings.position) {
        case 'top':
          textX = centerX;
          textY = padding;
          textAlign = 'center';
          textBaseline = 'top';
          break;
        case 'bottom':
          textX = centerX;
          textY = canvas.height - padding;
          textAlign = 'center';
          textBaseline = 'bottom';
          break;
        case 'top-left':
          textX = padding;
          textY = padding;
          textAlign = 'left';
          textBaseline = 'top';
          break;
        case 'top-right':
          textX = canvas.width - padding;
          textY = padding;
          textAlign = 'right';
          textBaseline = 'top';
          break;
        case 'bottom-left':
          textX = padding;
          textY = canvas.height - padding;
          textAlign = 'left';
          textBaseline = 'bottom';
          break;
        case 'bottom-right':
          textX = canvas.width - padding;
          textY = canvas.height - padding;
          textAlign = 'right';
          textBaseline = 'bottom';
          break;
        default: // center
          textX = centerX;
          textY = centerY;
          textAlign = 'center';
          textBaseline = 'middle';
      }

      // Set text alignment
      ctx.textAlign = textAlign;
      ctx.textBaseline = textBaseline;

      // Wrap text into lines
      const lines = wrapText(ctx, text, maxTextWidth);
      const lineHeight = textSettings.fontSize * 1.2; // 1.2 times font size for line spacing

      // Calculate total text height
      const totalTextHeight = lines.length * lineHeight;

      // Adjust Y position based on text baseline and number of lines
      let adjustedY = textY;
      if (textBaseline === 'middle') {
        adjustedY = textY - (totalTextHeight / 2) + (lineHeight / 2);
      } else if (textBaseline === 'bottom') {
        adjustedY = textY - totalTextHeight;
      }

      // Draw each line of text
      lines.forEach((line, index) => {
        const y = adjustedY + (index * lineHeight);
        ctx.fillText(line, textX, y);
      });

      // Convert canvas to blob
      const blob = await new Promise(resolve => {
        canvas.toBlob(resolve, 'image/png');
      });

      URL.revokeObjectURL(imageUrl);
      return blob;
    } catch (error) {
      console.error('Error in canvas fallback:', error);
      throw error;
    }
  }

  static async generateVideo(text, imageFile, textSettings) {
    try {
      // Create canvas for video frames
      const canvas = document.createElement('canvas');
      canvas.width = 1280;
      canvas.height = 720;
      const ctx = canvas.getContext('2d');

      // Load the background image
      const imageUrl = URL.createObjectURL(imageFile);
      const img = new Image();
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imageUrl;
      });

      // Function to wrap text to fit within a specified width
      const wrapText = (ctx, text, maxWidth) => {
        const words = text.split(' ');
        const lines = [];
        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
          const word = words[i];
          const width = ctx.measureText(currentLine + ' ' + word).width;
          if (width < maxWidth) {
            currentLine += ' ' + word;
          } else {
            lines.push(currentLine);
            currentLine = word;
          }
        }
        lines.push(currentLine);
        return lines;
      };

      // Function to draw a single frame
      const drawFrame = () => {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw background image (scaled to fit)
        const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;
        const imgX = (canvas.width - scaledWidth) / 2;
        const imgY = (canvas.height - scaledHeight) / 2;
        
        ctx.drawImage(img, imgX, imgY, scaledWidth, scaledHeight);

        // Configure text
        ctx.font = `${textSettings.fontSize}px ${textSettings.fontFamily}`;
        ctx.fillStyle = textSettings.color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Add text shadow for better visibility
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

        // Calculate text position and max width based on actual image dimensions
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const padding = 50;
        // Use the scaled image width for text wrapping, with padding
        const maxTextWidth = scaledWidth - (padding * 2);

        let textX, textY, textAlign, textBaseline;
        switch (textSettings.position) {
          case 'top':
            textX = centerX;
            textY = imgY + padding;
            textAlign = 'center';
            textBaseline = 'top';
            break;
          case 'bottom':
            textX = centerX;
            textY = imgY + scaledHeight - padding;
            textAlign = 'center';
            textBaseline = 'bottom';
            break;
          case 'top-left':
            textX = imgX + padding;
            textY = imgY + padding;
            textAlign = 'left';
            textBaseline = 'top';
            break;
          case 'top-right':
            textX = imgX + scaledWidth - padding;
            textY = imgY + padding;
            textAlign = 'right';
            textBaseline = 'top';
            break;
          case 'bottom-left':
            textX = imgX + padding;
            textY = imgY + scaledHeight - padding;
            textAlign = 'left';
            textBaseline = 'bottom';
            break;
          case 'bottom-right':
            textX = imgX + scaledWidth - padding;
            textY = imgY + scaledHeight - padding;
            textAlign = 'right';
            textBaseline = 'bottom';
            break;
          default: // center
            textX = centerX;
            textY = centerY;
            textAlign = 'center';
            textBaseline = 'middle';
        }

        // Set text alignment
        ctx.textAlign = textAlign;
        ctx.textBaseline = textBaseline;

        // Wrap text into lines
        const lines = wrapText(ctx, text, maxTextWidth);
        const lineHeight = textSettings.fontSize * 1.2; // 1.2 times font size for line spacing

        // Calculate total text height
        const totalTextHeight = lines.length * lineHeight;

        // Adjust Y position based on text baseline and number of lines
        let adjustedY = textY;
        if (textBaseline === 'middle') {
          adjustedY = textY - (totalTextHeight / 2) + (lineHeight / 2);
        } else if (textBaseline === 'bottom') {
          adjustedY = textY - totalTextHeight;
        }

        // Draw each line of text
        lines.forEach((line, index) => {
          const y = adjustedY + (index * lineHeight);
          ctx.fillText(line, textX, y);
        });
      };

      // Draw initial frame
      drawFrame();

      // Create MediaRecorder to record the canvas
      const stream = canvas.captureStream(30); // 30 FPS
      
      // Try different video formats for better compatibility
      let mimeType = 'video/webm;codecs=vp8';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm';
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/mp4';
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: mimeType,
        videoBitsPerSecond: 5000000 // 5 Mbps for better quality
      });

      const chunks = [];
      
      return new Promise((resolve, reject) => {
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
            console.log('Video chunk received:', event.data.size, 'bytes');
          }
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: mimeType });
          console.log('Video generation complete:', blob.size, 'bytes, type:', mimeType);
          
          // Clean up
          URL.revokeObjectURL(imageUrl);
          
          resolve(blob);
        };

        mediaRecorder.onerror = (error) => {
          console.error('MediaRecorder error:', error);
          URL.revokeObjectURL(imageUrl);
          reject(error);
        };

        // Start recording
        mediaRecorder.start(100); // Request data every 100ms
        console.log('Started recording video with format:', mimeType);
        
        // Record for 5 seconds with continuous frame updates
        const duration = 5000; // 5 seconds
        const frameInterval = 1000 / 30; // 30 FPS
        let elapsed = 0;
        
        const recordInterval = setInterval(() => {
          drawFrame(); // Redraw frame to ensure continuous recording
          elapsed += frameInterval;
          
          if (elapsed >= duration) {
            clearInterval(recordInterval);
            mediaRecorder.stop();
          }
        }, frameInterval);
      });
    } catch (error) {
      console.error('Error generating video:', error);
      throw error;
    }
  }

  static async generateMultiImageVideo(text, backgroundImages, textSettings) {
    try {
      // Create canvas for video frames
      const canvas = document.createElement('canvas');
      canvas.width = 1280;
      canvas.height = 720;
      const ctx = canvas.getContext('2d');

      // Pre-load all images
      const loadedImages = [];
      for (const imageData of backgroundImages) {
        const imageUrl = URL.createObjectURL(imageData.file);
        const img = new Image();
        
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = imageUrl;
        });
        
        loadedImages.push({
          image: img,
          duration: imageData.duration * 1000, // Convert to milliseconds
          url: imageUrl
        });
      }

      // Function to wrap text to fit within a specified width
      const wrapText = (ctx, text, maxWidth) => {
        const words = text.split(' ');
        const lines = [];
        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
          const word = words[i];
          const width = ctx.measureText(currentLine + ' ' + word).width;
          if (width < maxWidth) {
            currentLine += ' ' + word;
          } else {
            lines.push(currentLine);
            currentLine = word;
          }
        }
        lines.push(currentLine);
        return lines;
      };

      // Function to draw a frame for a specific image
      const drawFrame = (img) => {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw background image (scaled to fit)
        const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;
        const imgX = (canvas.width - scaledWidth) / 2;
        const imgY = (canvas.height - scaledHeight) / 2;
        
        ctx.drawImage(img, imgX, imgY, scaledWidth, scaledHeight);

        // Configure text
        ctx.font = `${textSettings.fontSize}px ${textSettings.fontFamily}`;
        ctx.fillStyle = textSettings.color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Add text shadow for better visibility
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

        // Calculate text position and max width based on actual image dimensions
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const padding = 50;
        // Use the scaled image width for text wrapping, with padding
        const maxTextWidth = scaledWidth - (padding * 2);

        let textX, textY, textAlign, textBaseline;
        switch (textSettings.position) {
          case 'top':
            textX = centerX;
            textY = imgY + padding;
            textAlign = 'center';
            textBaseline = 'top';
            break;
          case 'bottom':
            textX = centerX;
            textY = imgY + scaledHeight - padding;
            textAlign = 'center';
            textBaseline = 'bottom';
            break;
          case 'top-left':
            textX = imgX + padding;
            textY = imgY + padding;
            textAlign = 'left';
            textBaseline = 'top';
            break;
          case 'top-right':
            textX = imgX + scaledWidth - padding;
            textY = imgY + padding;
            textAlign = 'right';
            textBaseline = 'top';
            break;
          case 'bottom-left':
            textX = imgX + padding;
            textY = imgY + scaledHeight - padding;
            textAlign = 'left';
            textBaseline = 'bottom';
            break;
          case 'bottom-right':
            textX = imgX + scaledWidth - padding;
            textY = imgY + scaledHeight - padding;
            textAlign = 'right';
            textBaseline = 'bottom';
            break;
          default: // center
            textX = centerX;
            textY = centerY;
            textAlign = 'center';
            textBaseline = 'middle';
        }

        // Set text alignment
        ctx.textAlign = textAlign;
        ctx.textBaseline = textBaseline;

        // Wrap text into lines
        const lines = wrapText(ctx, text, maxTextWidth);
        const lineHeight = textSettings.fontSize * 1.2; // 1.2 times font size for line spacing

        // Calculate total text height
        const totalTextHeight = lines.length * lineHeight;

        // Adjust Y position based on text baseline and number of lines
        let adjustedY = textY;
        if (textBaseline === 'middle') {
          adjustedY = textY - (totalTextHeight / 2) + (lineHeight / 2);
        } else if (textBaseline === 'bottom') {
          adjustedY = textY - totalTextHeight;
        }

        // Draw each line of text
        lines.forEach((line, index) => {
          const y = adjustedY + (index * lineHeight);
          ctx.fillText(line, textX, y);
        });
      };

      // Create MediaRecorder to record the canvas
      const stream = canvas.captureStream(30); // 30 FPS
      
      // Try different video formats for better compatibility
      let mimeType = 'video/webm;codecs=vp8';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm';
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/mp4';
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: mimeType,
        videoBitsPerSecond: 5000000 // 5 Mbps for better quality
      });

      const chunks = [];
      
      return new Promise((resolve, reject) => {
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
            console.log('Video chunk received:', event.data.size, 'bytes');
          }
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: mimeType });
          console.log('Multi-image video generation complete:', blob.size, 'bytes, type:', mimeType);
          
          // Clean up all image URLs
          loadedImages.forEach(imgData => URL.revokeObjectURL(imgData.url));
          
          resolve(blob);
        };

        mediaRecorder.onerror = (error) => {
          console.error('MediaRecorder error:', error);
          loadedImages.forEach(imgData => URL.revokeObjectURL(imgData.url));
          reject(error);
        };

        // Start recording
        mediaRecorder.start(100); // Request data every 100ms
        console.log('Started recording multi-image video with format:', mimeType);
        
        // Use performance.now() for more accurate timing
        const startTime = performance.now();
        
        // Calculate total duration and create timing schedule
        const totalDuration = loadedImages.reduce((total, imgData) => total + imgData.duration, 0);
        const frameInterval = 1000 / 30; // 30 FPS
        let elapsed = 0;
        
        // Create a precise timing schedule
        const imageSchedule = [];
        let currentTime = 0;
        loadedImages.forEach((imgData, index) => {
          imageSchedule.push({
            startTime: currentTime,
            endTime: currentTime + imgData.duration,
            image: imgData.image,
            index: index
          });
          currentTime += imgData.duration;
        });
        
        console.log('Image schedule:', imageSchedule.map(s => `${s.index}: ${s.startTime}ms - ${s.endTime}ms`));
        console.log('Total duration:', totalDuration, 'ms');
        
        const recordInterval = setInterval(() => {
          // Calculate actual elapsed time using performance.now()
          const actualElapsed = performance.now() - startTime;
          
          // Find the current image based on elapsed time
          const currentImage = imageSchedule.find(schedule => 
            actualElapsed >= schedule.startTime && actualElapsed < schedule.endTime
          ) || imageSchedule[imageSchedule.length - 1]; // Fallback to last image
          
          // Draw frame with current image
          drawFrame(currentImage.image);
          
          // Log timing every second for debugging
          if (Math.floor(actualElapsed / 1000) !== Math.floor((actualElapsed - frameInterval) / 1000)) {
            console.log(`Video time: ${Math.floor(actualElapsed / 1000)}s, showing image ${currentImage.index}`);
          }
          
          elapsed = actualElapsed;
          
          // Stop recording when we've reached the total duration
          if (actualElapsed >= totalDuration) {
            console.log(`Recording complete. Total elapsed: ${actualElapsed}ms, Expected: ${totalDuration}ms`);
            clearInterval(recordInterval);
            mediaRecorder.stop();
          }
        }, frameInterval);
      });
    } catch (error) {
      console.error('Error generating multi-image video:', error);
      throw error;
    }
  }
}

export default VideoGenerator; 