chrome.commands.onCommand.addListener((command) => {
  if (command === "open-menu") {
    const html = generateHTML();
    chrome.tabs.create({ url: `data:text/html,${encodeURIComponent(html)}` });
  }
});

function generateHTML() {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Menu</title>
  <style>
    body { font-family: sans-serif; padding: 2rem; }
  </style>
</head>
<body>
  <h1>Hello World</h1>
</body>
</html>`;
}
