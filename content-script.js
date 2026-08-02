// YouTube 双语字幕扩展 - Content Script

let subtitlesContainer = null;
let isEnabled = true;
let currentLanguage = 'bilingual';
let fontSize = 16;
let tracks = {
  zh: null,  // 中文轨道
  en: null   // 英文轨道
};
let updateInterval = null;

const log = (msg) => console.log(`[YT双语字幕] ${msg}`);
const logObject = (msg, obj) => console.log(`[YT双语字幕] ${msg}`, obj);

// 初始化
function init() {
  log('初始化扩展...');
  
  chrome.storage.local.get(['enabled', 'language', 'fontSize'], (result) => {
    isEnabled = result.enabled !== false;
    currentLanguage = result.language || 'bilingual';
    fontSize = result.fontSize || 16;
    
    log(`设置 - 启用: ${isEnabled}, 语言: ${currentLanguage}, 字体: ${fontSize}px`);
    
    createSubtitlesContainer();
    setupMonitoring();
  });
}

// 创建字幕容器
function createSubtitlesContainer() {
  if (subtitlesContainer) return;

  subtitlesContainer = document.createElement('div');
  subtitlesContainer.id = 'yt-bilingual-subtitles';
  subtitlesContainer.innerHTML = `
    <div class="subtitle-wrapper">
      <div class="subtitle-line chinese"></div>
      <div class="subtitle-line english"></div>
    </div>
  `;
  subtitlesContainer.style.fontSize = fontSize + 'px';
  
  log('字幕容器已创建');
}

// 设置监控
function setupMonitoring() {
  if (updateInterval) clearInterval(updateInterval);
  
  // 每 100ms 检查一次视频和字幕
  updateInterval = setInterval(() => {
    const video = document.querySelector('video');
    
    if (!video) return;
    
    // 确保容器被附加
    ensureContainerAttached();
    
    // 处理字幕轨道
    if (video.textTracks.length > 0) {
      findAndProcessTracks(video);
      updateSubtitles();
    }
  }, 100);
}

// 确保容器被附加到 DOM
function ensureContainerAttached() {
  if (!subtitlesContainer) return;
  
  // 如果已经在 DOM 中就不用重新附加
  if (subtitlesContainer.isConnected) return;
  
  const video = document.querySelector('video');
  if (!video) return;
  
  // 找到播放器容器
  const moviePlayer = video.closest('.html5-video-player');
  if (moviePlayer) {
    moviePlayer.appendChild(subtitlesContainer);
    log('字幕容器已附加到播放器');
    return;
  }
  
  // 如果找不到播放器，直接附加到 video 元素后面
  video.parentNode.appendChild(subtitlesContainer);
  log('字幕容器已附加到视频父元素');
}

// 寻找和处理字幕轨道
function findAndProcessTracks(video) {
  const textTracks = video.textTracks;
  
  if (!textTracks || textTracks.length === 0) return;

  const trackSnapshot = Array.from(textTracks).map((track, index) => ({
    index,
    label: track.label || '',
    language: track.language || '',
    kind: track.kind || '',
    mode: track.mode || ''
  }));
  logObject('当前检测到的字幕轨道', trackSnapshot);
  
  // 重置轨道
  if (!tracks.zh || !tracks.en) {
    tracks = { zh: null, en: null };
    
    log(`检测到 ${textTracks.length} 个字幕轨道`);
    
    // 遍历所有轨道
    for (let i = 0; i < textTracks.length; i++) {
      const track = textTracks[i];
      const label = (track.label || '').toLowerCase();
      const language = (track.language || '').toLowerCase();
      
      log(`轨道 ${i}: 标签="${track.label}", 语言="${track.language}"`);
      
      // 识别中文
      if (
        label.includes('中文') || 
        label.includes('chinese') || 
        label.includes('mandarin') ||
        label.includes('simplified') ||
        label.includes('traditional') ||
        language.startsWith('zh') ||
        language.includes('cn')
      ) {
        tracks.zh = track;
        log(`✓ 找到中文轨道: ${track.label}`);
      }
      
      // 识别英文
      if (
        label.includes('english') || 
        label.includes('英文') ||
        language.startsWith('en')
      ) {
        tracks.en = track;
        log(`✓ 找到英文轨道: ${track.label}`);
      }
    }
    
    // 如果没找到中文，尝试用第二个轨道
    if (!tracks.zh && textTracks.length >= 2) {
      tracks.zh = textTracks[1];
      log(`⚠ 使用第二个轨道作为中文: ${textTracks[1].label}`);
    }
    
    // 如果没找到英文，尝试用第一个轨道
    if (!tracks.en && textTracks.length >= 1) {
      tracks.en = textTracks[0];
      log(`⚠ 使用第一个轨道作为英文: ${textTracks[0].label}`);
    }

    logObject('最终选择的字幕轨道', {
      chinese: tracks.zh
        ? { label: tracks.zh.label || '', language: tracks.zh.language || '', kind: tracks.zh.kind || '' }
        : null,
      english: tracks.en
        ? { label: tracks.en.label || '', language: tracks.en.language || '', kind: tracks.en.kind || '' }
        : null
    });
  }
  
  // 设置轨道模式
  if (tracks.zh) tracks.zh.mode = 'hidden';
  if (tracks.en) tracks.en.mode = 'hidden';
}

// 更新字幕显示
function updateSubtitles() {
  if (!isEnabled || !subtitlesContainer) return;
  
  const chineseDiv = subtitlesContainer.querySelector('.subtitle-line.chinese');
  const englishDiv = subtitlesContainer.querySelector('.subtitle-line.english');
  
  if (!chineseDiv || !englishDiv) return;
  
  let chineseText = '';
  let englishText = '';
  
  // 获取中文字幕
  if (tracks.zh && tracks.zh.activeCues && tracks.zh.activeCues.length > 0) {
    const cues = Array.from(tracks.zh.activeCues);
    chineseText = cues.map(cue => cue.text).join(' ').trim();
  }
  
  // 获取英文字幕
  if (tracks.en && tracks.en.activeCues && tracks.en.activeCues.length > 0) {
    const cues = Array.from(tracks.en.activeCues);
    englishText = cues.map(cue => cue.text).join(' ').trim();
  }
  
  // 更新中文显示
  if (currentLanguage === 'bilingual' || currentLanguage === 'zh') {
    chineseDiv.textContent = chineseText;
    chineseDiv.style.display = chineseText ? 'block' : 'none';
  } else {
    chineseDiv.style.display = 'none';
  }
  
  // 更新英文显示
  if (currentLanguage === 'bilingual' || currentLanguage === 'en') {
    englishDiv.textContent = englishText;
    englishDiv.style.display = englishText ? 'block' : 'none';
  } else {
    englishDiv.style.display = 'none';
  }

  if ((currentLanguage === 'bilingual' || currentLanguage === 'zh') && tracks.zh) {
    logObject('中文轨道当前激活字幕', {
      label: tracks.zh.label || '',
      activeCues: tracks.zh.activeCues
        ? Array.from(tracks.zh.activeCues).map((cue) => cue.text)
        : []
    });
  }
}

// 监听来自 popup 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  try {
    switch (request.action) {
      case 'toggleSubtitles':
        isEnabled = request.enabled;
        if (subtitlesContainer) {
          subtitlesContainer.style.display = isEnabled ? 'block' : 'none';
        }
        log(`字幕 ${isEnabled ? '已启用' : '已禁用'}`);
        break;
        
      case 'changeLanguage':
        currentLanguage = request.language;
        updateSubtitles();
        log(`语言已切换: ${currentLanguage}`);
        break;
        
      case 'changeFontSize':
        fontSize = request.fontSize;
        if (subtitlesContainer) {
          subtitlesContainer.style.fontSize = fontSize + 'px';
        }
        log(`字体大小已改为: ${fontSize}px`);
        break;
    }
    sendResponse({ success: true });
  } catch (error) {
    console.warn(`[YT双语字幕] 消息处理错误: ${error.message}`);
    sendResponse({ success: false, error: error.message });
  }
});

// 启动
log('脚本已加载');
init();
