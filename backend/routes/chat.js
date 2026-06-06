const express = require('express');
const router = express.Router();
const { generateCharacterProfile, getAIReply } = require('../services/deepseek');
const {
  getUserPersonality,
  setUserPersonality,
  addChatMessage,
  getChatHistoryForAI,
  getCurrentScene,
  updateScene,
  getUserMemory
} = require('../services/memory');

/**
 * 初始化聊天角色
 */
router.post('/init', async (req, res) => {
  try {
    const { userId, personalityType } = req.body;

    if (!userId || !personalityType) {
      return res.status(400).json({ error: '缺少必要参数' });
    }

    // 保存用户人格类型
    setUserPersonality(userId, personalityType);

    // 生成角色设定
    const profile = await generateCharacterProfile(personalityType, personalityType.description);

    // 解析 AI 返回的 JSON（可能需要清理）
    let characterProfile;
    try {
      // 尝试提取 JSON 部分
      const jsonMatch = profile.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        characterProfile = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('无法解析返回的 JSON');
      }
    } catch (error) {
      // 如果解析失败，使用默认角色
      characterProfile = {
        name: '理想对象',
        age: 25,
        personality: personalityType.description,
        style: personalityType.keywords[0],
        background: '一个温柔的人',
        opening: '嗨，很高兴认识你！',
        scene: '初次相遇'
      };
    }

    // 保存初始场景
    updateScene(userId, characterProfile.scene || '初始场景');

    // 记录开场白
    addChatMessage(userId, 'assistant', characterProfile.opening, characterProfile.scene);

    res.json({
      success: true,
      profile: characterProfile
    });
  } catch (error) {
    console.error('初始化聊天失败:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * 发送消息
 */
router.post('/send', async (req, res) => {
  try {
    const { userId, message } = req.body;

    if (!userId || !message) {
      return res.status(400).json({ error: '缺少必要参数' });
    }

    // 获取用户人格类型
    const personalityType = getUserPersonality(userId);
    if (!personalityType) {
      return res.status(400).json({ error: '请先完成心理测试' });
    }

    // 获取对话历史
    const chatHistory = getChatHistoryForAI(userId);
    const currentScene = getCurrentScene(userId);

    // 保存用户消息
    addChatMessage(userId, 'user', message);

    // 获取 AI 回复
    const reply = await getAIReply(userId, message, personalityType, chatHistory, currentScene);

    // 保存 AI 回复
    addChatMessage(userId, 'assistant', reply);

    res.json({
      success: true,
      reply
    });
  } catch (error) {
    console.error('发送消息失败:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * 获取对话历史
 */
router.get('/history/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const userData = getUserMemory(userId);

    res.json({
      success: true,
      history: userData.chatHistory,
      scene: userData.scene,
      personalityType: userData.personalityType
    });
  } catch (error) {
    console.error('获取历史失败:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * 清除用户数据
 */
router.delete('/clear/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const { clearUserData } = require('../services/memory');
    clearUserData(userId);

    res.json({ success: true });
  } catch (error) {
    console.error('清除数据失败:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;