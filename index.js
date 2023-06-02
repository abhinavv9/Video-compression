const fs = require("fs");
const { createFFmpeg, fetchFile } = require("@ffmpeg/ffmpeg");
const { performance } = require("perf_hooks");

// Create an instance of FFmpeg
const ffmpeg = createFFmpeg({ log: true });

// Function to compress the video
const compressVideo = async (inputPath, outputPath, scale) => {
  // Load the FFmpeg library
  const startTime = performance.now();
  await ffmpeg.load();

  // Read the input video file
  const inputBuffer = fs.readFileSync(inputPath);

  // Write the input file to FFmpeg's virtual file system
  ffmpeg.FS("writeFile", "input.mp4", new Uint8Array(inputBuffer));

  // Run FFmpeg to compress the video
  await ffmpeg.run("-i", "input.mp4", "-vf", `scale=${scale}`, outputPath);

  // Read the compressed video file
  const outputData = ffmpeg.FS("readFile", outputPath);

  // Write the compressed video to the output file
  fs.writeFileSync(outputPath, outputData);
  const endTime = performance.now();
  const elapsedTime = endTime - startTime;

  const memoryUsage = process.memoryUsage().heapUsed / 1024 / 1024;

  console.log("Video compression completed!");
  console.log(`Time taken: ${elapsedTime.toFixed(2)} milliseconds`);
  console.log(`Memory used: ${memoryUsage.toFixed(2)} MB`);
  const inputStats = fs.statSync(inputPath);
  const compressedStats = fs.statSync(outputPath);

  const inputSize = inputStats.size / 1024 / 1024; // Convert to MB
  const compressedSize = compressedStats.size / 1024 / 1024;
  console.log(`Input file size: ${inputSize.toFixed(2)} MB`);
  console.log(`Compressed file size: ${compressedSize.toFixed(2)} MB`);
};

// Specify the input and output paths, and desired scale (e.g., '640:480')
const inputPath = "video.mp4";
const outputPath = "outputVideo.mp4";
const scale = "640:480";

// Call the compressVideo function
compressVideo(inputPath, outputPath, scale);
