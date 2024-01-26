import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import Base64 from 'base64-js';
import MarkdownIt from 'markdown-it';


// process.env.API_KEY
const API_KEY = require('./api_keys.js')

// Add a default keyboard binding.
document.addEventListener('keydown', (event) => {
  if (event.key === 'q') {
    // Trigger the app.
    runApp(screenshot);
  }
});

async function runApp(screen) {
  // Get the current web address.
  const url = window.location.href;
  const promptInput = "Suggest actions based on this screenshot image and the URl: " + url;

  try {
  // Take a screenshot of the current web page.
  const screenshot = await screen.takeScreenshot();

  // Load the image as a base64 string
  let ssBase64 = await fetch(screenshot)
    .then(r => r.arrayBuffer())
    .then(a => Base64.fromByteArray(new Uint8Array(a)));

  // Assemble the prompt by combining the text with the chosen image
  let contents = [
    {
      role: 'user',
      parts: [
        { inline_data: { mime_type: 'image/jpeg', data: ssBase64, } },
        { text: promptInput }
      ]
    }
  ];

  // Call the gemini-pro-vision model, and get a stream of results
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({
    model: "gemini-pro-vision",
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
      },
    ],
  });

  const result = await model.generateContentStream({ contents });

    // Read from the stream and interpret the output as markdown
    let buffer = [];
    let md = new MarkdownIt();
    for await (let response of result.stream) {
      buffer.push(response.text());
      const output = md.render(buffer.join(''));
      alert(output);
    }
  } catch(e) {
    alert(e);
  }
}