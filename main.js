import { Gemini, screenshot} from '@gemini/core';
// import API_KEY from './api_keys.js';


// process.env.API_KEY
const API_KEY = require('./api_keys.js')
const gemini = new Gemini(API_KEY);
const model = 'gemini-pro-vision';

// Add a default keyboard binding.
document.addEventListener('keydown', (event) => {
  if (event.key === 'q') {
    // Trigger the app.
    runApp(screenshot);
  }
});

async function runApp(screenshot) {
  // Get the current web address.
  const url = window.location.href;

  // Take a screenshot of the current web page.
  const screenshot = await screenshot.takeScreenshot();

  // Send the screenshot to the Gemini API.
  const response = await gemini.post('/suggestions', {
    screenshot,
    url,
    model,
  });

  // Get the suggestions from the API.
  const suggestions = response.data.suggestions;

  // Display the suggestions in the browser alert.
  alert(suggestions);
}