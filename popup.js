async function getTitleAndUrls() {
  const tabs = await browser.tabs.query({ lastFocusedWindow: true })
  return tabs.map((tab) => ({
    title: tab.title,
    url: tab.url,
  }));
}

async function copy(e) {
  e.preventDefault();

  const tabs = await getTitleAndUrls();
  const format = document.getElementById('format').value;
  await browser.storage.local.set({ format: format });

  const result = tabs.map((tab) => (
    format
      .replace('{title}', tab.title)
      .replace('{url}', tab.url)
  )).join('');

  await navigator.clipboard.writeText(result);
}

async function init() {
  document.getElementById('copy').addEventListener('click', copy);

  const storage = await browser.storage.local.get('format');
  document.getElementById('format').value = storage.format || '{title}\n{url}\n\n';
}

document.addEventListener('DOMContentLoaded', init);
