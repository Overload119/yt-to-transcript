import Bun from 'bun';
import filenamify from 'filenamify';
import { getSubtitles, getVideoDetails } from 'youtube-caption-extractor';

console.log(Bun.argv);
const url = Bun.argv.at(-1);
const videoIDFromCLI = new URL(url!).searchParams.get('v');
const lang = 'en'; // Optional, default is 'en' (English)

if (!videoIDFromCLI) {
  console.error('Expected a video ID, got %s from %s', videoIDFromCLI, url);
  process.exit();
}

console.log(`Fetching ... ${videoIDFromCLI}`);

const video = await getVideoDetails({ videoID: videoIDFromCLI, lang });
const subtitleData = await getSubtitles({ videoID: videoIDFromCLI, lang });

const transcriptByMinute: { [key: number]: string } = {};
subtitleData.forEach((part) => {
  const timestampInSeconds = Math.floor(parseFloat(part.start));
  const timestampPrefix = Math.floor(timestampInSeconds / 60);

  if (transcriptByMinute[timestampPrefix]) {
    transcriptByMinute[timestampPrefix] += ' ' + part.text;
  } else {
    transcriptByMinute[timestampPrefix] = part.text;
  }
}, '');

function formatTimestamp(timestamp: number) {
  const date = new Date(timestamp * 60000);
  return date.toISOString().slice(13, 19);
}

let transcript = '';
const filename = `./out/${filenamify(video.title)}.txt`;
for (const [key, value] of Object.entries(transcriptByMinute)) {
  transcript += `${formatTimestamp(parseInt(key, 10))}: ${value}\n`
}
Bun.write(filename, transcript.trim());
