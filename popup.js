// Popup 脚本

document.addEventListener('DOMContentLoaded', () => {
  const sendToActiveTab = (payload) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]) return;

      chrome.tabs.sendMessage(tabs[0].id, payload, () => {
        const lastError = chrome.runtime.lastError;
        if (lastError) {
          console.log('Tab not ready:', lastError.message);
        }
      });
    });
  };

  // 恢复保存的设置
  chrome.storage.local.get(['enabled', 'language', 'fontSize'], (result) => {
    document.getElementById('enableToggle').checked = result.enabled !== false;
    document.getElementById('fontSizeSlider').value = result.fontSize || 16;
    document.getElementById('fontSizeDisplay').textContent = (result.fontSize || 16) + 'px';

    // 激活对应的语言按钮
    const language = result.language || 'bilingual';
    document.querySelectorAll('.lang-btn').forEach(btn => {
      if (btn.dataset.lang === language) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  });

  // 启用/禁用切换
  document.getElementById('enableToggle').addEventListener('change', (e) => {
    const enabled = e.target.checked;
    chrome.storage.local.set({ enabled });
    document.getElementById('statusText').textContent = enabled ? '已启用' : '已禁用';

    // 发送消息到content script
    sendToActiveTab({
      action: 'toggleSubtitles',
      enabled: enabled
    });
  });

  // 语言切换
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const language = btn.dataset.lang;
      chrome.storage.local.set({ language });

      // 更新UI
      document.querySelectorAll('.lang-btn').forEach(b => {
        b.classList.remove('active');
      });
      btn.classList.add('active');

      // 发送消息到content script
      sendToActiveTab({
        action: 'changeLanguage',
        language: language
      });
    });
  });

  // 字体大小调整
  document.getElementById('fontSizeSlider').addEventListener('input', (e) => {
    const fontSize = e.target.value;
    chrome.storage.local.set({ fontSize: parseInt(fontSize) });
    document.getElementById('fontSizeDisplay').textContent = fontSize + 'px';

    // 发送消息到content script
    sendToActiveTab({
      action: 'changeFontSize',
      fontSize: parseInt(fontSize)
    });
  });
});
