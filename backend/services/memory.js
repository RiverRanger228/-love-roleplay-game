const fs = require('fs');
const path = require('path');

const MEMORY_DIR = path.join(__dirname, '..', 'memory-data');
const MEMORY_FILE = path.join(MEMORY_DIR, 'user-memories.json');

// 确保内存目录存在
if (!fs.existsSync(MEMORY_DIR)) {
  fs.mkdirSync(MEMORY_DIR, { recursive: true });
}

/**
 * 读取所有用户记忆
 */
function loadMemories() {
  if (!fs.existsSync(MEMORY_FILE)) {
    return {};
  }
  try {
    const data = fs.readFileSync(MEMORY_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('读取记忆文件失败:', error);
    return {};
  }
}

/**
 * 保存所有用户记忆
 */
function saveMemories(memories) {
  try {
    fs.writeFileSync(MEMORY_FILE, JSON.stringify(memories, null, 2), 'utf-8');
  } catch (error) {
    console.error('保存记忆文件失败:', error);
  }
}

/**
 * 获取用户记忆
 */
function getUserMemory(userId) {
  const memories = loadMemories();
  return memories[userId] || {
    userId,
    personalityType: null,
    memories: [],
    chatHistory: [],
    scene: '初始场景'
  };
}

/**
 * 保存用户记忆
 */
function saveUserMemory(userId, data) {
  const memories = loadMemories();
  memories[userId] = {
    ...getUserMemory(userId),
    ...data,
    updatedAt: new Date().toISOString()
  };
  saveMemories(memories);
}

/**
 * 添加对话消息
 */
function addChatMessage(userId, role, content, scene = null) {
  const userData = getUserMemory(userId);
  userData.chatHistory.push({ role, content, timestamp: new Date().toISOString() });

  // 如果提供了场景，更新当前场景
  if (scene) {
    userData.scene = scene;
  }

  saveUserMemory(userId, userData);
}

/**
 * 添加记忆条目
 */
function addMemory(userId, content) {
  const userData = getUserMemory(userId);
  userData.memories.push({
    content,
    timestamp: new Date().toISOString()
  });
  saveUserMemory(userId, userData);
}

/**
 * 获取对话历史（用于 AI 上下文）
 */
function getChatHistoryForAI(userId, limit = 10) {
  const userData = getUserMemory(userId);
  return userData.chatHistory.slice(-limit);
}

/**
 * 获取用户人格类型
 */
function getUserPersonality(userId) {
  const userData = getUserMemory(userId);
  return userData.personalityType;
}

/**
 * 设置用户人格类型
 */
function setUserPersonality(userId, personalityType) {
  saveUserMemory(userId, { personalityType });
}

/**
 * 获取当前场景
 */
function getCurrentScene(userId) {
  const userData = getUserMemory(userId);
  return userData.scene;
}

/**
 * 更新当前场景
 */
function updateScene(userId, scene) {
  saveUserMemory(userId, { scene });
}

/**
 * 清除用户数据（测试用）
 */
function clearUserData(userId) {
  const memories = loadMemories();
  delete memories[userId];
  saveMemories(memories);
}

module.exports = {
  getUserMemory,
  saveUserMemory,
  addChatMessage,
  addMemory,
  getChatHistoryForAI,
  getUserPersonality,
  setUserPersonality,
  getCurrentScene,
  updateScene,
  clearUserData
};