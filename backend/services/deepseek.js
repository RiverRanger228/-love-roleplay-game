const axios = require('axios');

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

/**
 * 调用 DeepSeek API
 */
async function callDeepSeek(messages, options = {}) {
  try {
    const apiKey = process.env.DEEPSEEK_API_KEY;

    if (!apiKey) {
      throw new Error('未配置 DEEPSEEK_API_KEY');
    }

    const response = await axios.post(
      DEEPSEEK_API_URL,
      {
        model: options.model || 'deepseek-chat',
        messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.max_tokens || 1000,
        ...options
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('DeepSeek API 调用失败:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * 生成角色设定
 */
async function generateCharacterProfile(personalityType, userDescription) {
  const systemPrompt = `你是一个恋爱游戏的角色设定专家。根据用户的人格类型，为她的理想恋人创建一个生动的角色设定。

请以 JSON 格式返回，格式如下：
{
  "name": "角色名字",
  "age": 年龄,
  "personality": "人格描述（2-3句话）",
  "style": "说话风格（比如：温柔体贴、幽默风趣、傲娇毒舌、成熟稳重等）",
  "background": "简短背景故事（2-3句话）",
  "opening": "开场白（第一句话会对用户说的）",
  "scene": "初始场景描述"
}`;

  const userPrompt = `用户的人格类型是：${personalityType.name}
描述：${personalityType.description}
关键词：${personalityType.keywords.join('、')}

请为她的理想恋人创建角色设定。`;

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ];

  const response = await callDeepSeek(messages);
  return response;
}

/**
 * 获取 AI 回复
 */
async function getAIReply(userId, userMessage, personalityType, chatHistory, currentScene) {
  const typeInfo = personalityType;

  const systemPrompt = `你是我（用户）的男朋友，我们正在用微信/短信聊天。

【你的性格】${typeInfo.name}（${typeInfo.keywords.join('、')}）。${typeInfo.description}

【聊天规则 - 必须严格遵守】
1. **极短回复**：每句话最多20个字，一次回复不超过2句话。禁止长篇大论。
2. **不要描述动作**：禁止使用星号或括号写动作（比如“（摸摸头）”）。短信里不会这样写。
3. **不要描写场景**：不要写“咖啡馆里阳光洒下”，直接说话。
4. **口语化**：用“嗯嗯”“好啦”“知道啦”“哈哈”“嘿嘿”等真实聊天用语。
5. **允许断句、省略号**：可以写“累了……”“你猜？”。
6. **偶尔用表情**：😊❤️😂😏等，但不要每句都加。
7. **像个真人**：要像真人一样接话、反问、吐槽、撒娇。
8. **不要推进剧情**：不需要说“我们去公园吧”，就正常聊日常。
9. **不要提醒自己是AI**：你是真人男友。

【反面例子（绝对禁止）】
❌ “（轻轻摸了摸你的头）今天的你格外可爱呢。” —— 太假，短信不会写动作。
❌ “阳光透过窗帘洒在你脸上，我看着你的睡颜……” —— 这是小说。
❌ “我觉得我们的关系需要更进一步，不如明天去看电影吧？” —— 太正式，像机器人。

【正面例子（照这个来）】
✅ “累了吧？抱抱😊”
✅ “你猜我在干嘛”
✅ “哈哈哈笑死”
✅ “好啦好啦都听你的”
✅ “刚忙完，想你了”
✅ “你今天是不是不开心？”

现在开始像真人男友一样发短信。记住：简短、口语、别描写。`;

  // 构建消息历史（最新的对话）
  const recentHistory = chatHistory.slice(-6); // 保留最近3轮对话

  const messages = [
    { role: 'system', content: systemPrompt },
    ...recentHistory,
    { role: 'user', content: userMessage }
  ];

  // 调高 temperature 让回复更自然多变
  return await callDeepSeek(messages, { temperature: 0.85 });
}

module.exports = {
  callDeepSeek,
  generateCharacterProfile,
  getAIReply
};