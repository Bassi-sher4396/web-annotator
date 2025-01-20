chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.url && !tab.url.includes("google.com/search") && !tab.url.includes("chrome://newtab/")) {
      console.log(tab.url);
      chrome.tabs.sendMessage(tabId, {
        type: "url",
        taburl: tab.url
      });
    }
  });
  