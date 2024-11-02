// document.getElementById('start').addEventListener('click', async () => {
//   // Get the active tab in the current window
//   const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
//   const response = await chrome.tabs.sendMessage(tab.id, { action: 'startListening' });
//   // Ensure there is a tab and it has an ID
//   if (tab && tab.id && response) {
//       // Send a message to the content script running in this tab
//       console.log(response.status);  // Log the response status
//   } else {
//       console.log('No active tab found.');
//   }
// });

// document.getElementById('stop').addEventListener('click', async () => {
//   // Get the active tab in the current window
//   const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
//   const response = await chrome.tabs.sendMessage(tab.id, { action: 'stopListening' });
//   // Ensure there is a tab and it has an ID
//   if (tab && tab.id && response) {
//       // Send a message to the content script running in this tab
//       console.log(response.status);  // Log the response status
//   } else {
//       console.log('No active tab found.');
//   }
// });



document.getElementById('start').addEventListener('click', async () => {
  const duration = parseInt(document.getElementById('duration').value);  // Get duration in minutes
  const scrollHeight = parseInt(document.getElementById('scrollHeight').value);  // Get scroll height in pixels

  // Validate inputs
  if (isNaN(duration) || duration <= 0 || isNaN(scrollHeight) || scrollHeight <= 0) {
      console.log("Please enter valid duration and scroll height.");
      return;
  }

  // Get the active tab in the current window
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab && tab.id) {
      const response = await chrome.tabs.sendMessage(tab.id, { 
          action: 'startListening', 
          duration: duration, 
          scrollHeight: scrollHeight 
      });

      // Handle response and ensure there is a valid message from content script
      if (response) {
          console.log(response.status);  // Log the response status
      } else {
          console.log('Failed to start speech recognition.');
      }
  } else {
      console.log('No active tab found.');
  }
});

document.getElementById('stop').addEventListener('click', async () => {
  // Get the active tab in the current window
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (tab && tab.id) {
      const response = await chrome.tabs.sendMessage(tab.id, { action: 'stopListening' });

      // Handle response and ensure there is a valid message from content script
      if (response) {
          console.log(response.status);  // Log the response status
      } else {
          console.log('Failed to stop speech recognition.');
      }
  } else {
      console.log('No active tab found.');
  }
});
