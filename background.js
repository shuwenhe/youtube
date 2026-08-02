// Background Service Worker

// 初始化存储
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    enabled: true,
    language: 'bilingual',
    fontSize: 16
  });
  console.log('YouTube 双语字幕扩展已安装');
});

// 监听标签页更新事件
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  try {
    if (changeInfo && changeInfo.status === 'complete') {
      const url = tab && tab.url ? tab.url : '';
      if (url && url.includes('youtube.com')) {
        console.log('YouTube page loaded:', url);
      }
    }
  } catch (error) {
    console.error('Error in onUpdated listener:', error);
  }
});

// 处理来自 content script 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  try {
    if (request.action === 'getSettings') {
      chrome.storage.local.get(['enabled', 'language', 'fontSize'], (result) => {
        sendResponse(result);
      });
      return true; // 异步响应
    }
  } catch (error) {
    console.error('Error in onMessage listener:', error);
  }
});
