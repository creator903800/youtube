const express = require('express');
require('dotenv').config();
const cors = require('cors'); // Import the cors middleware
const ytdl = require('ytdl-core');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Use the cors middleware

app.use(express.json());

app.post('/video-info', async (req, res) => {
  const { videoUrl } = req.body;
  try {
    const info = await ytdl.getInfo(videoUrl);
    console.log(info)
    res.json({ success: true, info });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch video information' });
  }
});

// app.post('/download-video', async (req, res) => {
//   try {
//     const { videoUrl } = req.body;
//     const info = await ytdl.getInfo(videoUrl);
//     const format = ytdl.chooseFormat(info.formats, { quality: 'highest' });
//     res.header('Content-Disposition', `attachment; filename="${info.videoDetails.title}.mp4"`);
//     ytdl(videoUrl, { format: format }).pipe(res);
//   } catch (error) {
//     console.error('Error downloading video:', error);
//     res.status(500).send('Error downloading video');
//   }
// });

// app.post('/download-video', async (req, res) => {
//   try {
//     const { videoUrl, qualityLabel,contentLength } = req.body;
//     const info = await ytdl.getInfo(videoUrl);
//     const format = info.formats.find(format => format.qualityLabel === qualityLabel && format.contentLength === contentLength );
//     if (!format) {
//       throw new Error(`Requested quality label (${qualityLabel}) and container (${contentLength}) are not available for this video.`);
//     }
//     res.header('Content-Disposition', `attachment; filename="${info.videoDetails.title}.${format.container}"`);
//     ytdl(videoUrl, { format: format }).pipe(res);
//   } catch (error) {
//     console.error('Error downloading video:', error);
//     res.status(500).send('Error downloading video');
//   }
// });
app.post('/download-video', async (req, res) => {
  try {
    const { videoUrl, qualityLabel, contentLength } = req.body;
    const info = await ytdl.getInfo(videoUrl);
    const format = info.formats.find(format => format.qualityLabel === qualityLabel && format.contentLength === contentLength);
    if (!format) {
      throw new Error(`Requested quality label (${qualityLabel}) and container (${contentLength}) are not available for this video.`);
    }
    const videoID = ytdl.getVideoID(videoUrl);
    const filename = `${videoID}.${format.container}`;
    res.header('Content-Disposition', `attachment; filename="${filename}"`);
    ytdl(videoUrl, { format: format }).pipe(res);
  } catch (error) {
    console.error('Error downloading video:', error);
    res.status(500).send('Error downloading video');
  }
});



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
