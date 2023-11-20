import Bun from 'bun';
import filenamify from 'filenamify';
import { getSubtitles, getVideoDetails } from 'youtube-caption-extractor';

console.log(Bun.argv);
const url = Bun.argv.at(-1);
const videoIDFromCLI = new URL(url).searchParams.get('v');
const lang = 'en'; // Optional, default is 'en' (English)

if (!videoIDFromCLI) {
  console.error('Expected a video ID, got %s from %s', videoIDFromCLI, url);
  process.exit();
}

console.log(`Fetching ... ${videoIDFromCLI}`);

// Fetching Subtitles
const fetchSubtitles = async (videoID: string, lang = 'en') => {
  try {
    return;
  } catch (error) {
    console.error('Error fetching subtitles:', error);
  }
};

const video = await getVideoDetails({ videoID: videoIDFromCLI, lang });
const subtitleData = await getSubtitles({ videoID: videoIDFromCLI, lang });
const transcript = subtitleData.reduce((acc, part) => {
  return (acc += ' ' + part.text);
}, '');

const filename = `${filenamify(video.title)}.txt`;
Bun.write(filename, transcript);
