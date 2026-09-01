const fs = require('fs');

try {
  const content = fs.readFileSync('C:/Users/visha/.gemini/antigravity/brain/80237376-dc7c-4eed-8a5d-91ffb19a782f/.system_generated/steps/62/content.md', 'utf-8');
  
  const titleMatch = content.match(/<title>(.*?)<\/title>/);
  console.log('TITLE:', titleMatch ? titleMatch[1] : 'No title');
  
  const videoDetailsMatch = content.match(/"videoDetails":\s*({.*?}),"isLiveContent"/);
  if (videoDetailsMatch) {
    console.log('VIDEO_DETAILS:', videoDetailsMatch[1]);
  } else {
    const titleObj = content.match(/"title":\{"runs":\[\{"text":"(.*?)"\}\]/);
    console.log('RUNS_TITLE:', titleObj ? titleObj[1] : 'No runs title');
    const simpleTitle = content.match(/"title":"(.*?)"/);
    console.log('SIMPLE_TITLE:', simpleTitle ? simpleTitle[1] : 'No simple title');
  }
} catch (e) {
  console.error('Error:', e);
}
