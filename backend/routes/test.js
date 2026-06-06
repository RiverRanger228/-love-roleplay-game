const express = require('express');
const router = express.Router();
const { computePersonality } = require('../utils/personality');

// 心理测试题目
const questions = [
  {
    id: 1,
    question: '周末午后，你独自在家，突然停电了。你会？',
    options: [
      { label: 'A', text: '点上蜡烛，安静地看书或发呆，享受难得的宁静' },
      { label: 'B', text: '打电话给朋友抱怨，或者出门找点热闹' },
      { label: 'C', text: '打开手机手电筒，继续刷视频/打游戏，无所谓' },
      { label: 'D', text: '觉得有点不安，希望有个人能立刻陪着你' }
    ]
  },
  {
    id: 2,
    question: '你正在为一件小事生闷气（比如朋友迟到半小时）。对方到了之后对你说："对不起，路上堵车。" 你最可能的内心反应是？',
    options: [
      { label: 'A', text: '"算了，反正也不是什么大事。"（很快消气）' },
      { label: 'B', text: '"哼，你就不能早点出门吗？"（嘴上不饶人，但心里已经原谅了一半）' },
      { label: 'C', text: '"没事呀，正好我也刚到。"（笑着掩饰自己的不爽）' },
      { label: 'D', text: '"……嗯。"（沉默，但需要对方更真诚的道歉或行动补偿）' }
    ]
  },
  {
    id: 3,
    question: '如果用一个动物形容你理想中的恋人，你会选？',
    options: [
      { label: 'A', text: '狗（忠诚、热情、黏人）' },
      { label: 'B', text: '猫（独立、神秘、偶尔高冷）' },
      { label: 'C', text: '狼（保护欲强、有点危险感）' },
      { label: 'D', text: '鹿（温柔、敏感、安静）' }
    ]
  },
  {
    id: 4,
    question: '你收到一份礼物，拆开后发现是对方亲手做的一件东西（比如围巾、手写信），但做工有点粗糙。你的第一感觉是？',
    options: [
      { label: 'A', text: '非常感动，觉得比买来的礼物珍贵得多' },
      { label: 'B', text: '有点哭笑不得，但觉得用心了，会保留' },
      { label: 'C', text: '内心无感，还是希望收到更实用的东西' },
      { label: 'D', text: '有点尴尬，不知道怎么回应，怕伤害对方' }
    ]
  },
  {
    id: 5,
    question: '你和恋人约好周末去一个地方，但周五他突然说工作要加班，可能去不了。你会？',
    options: [
      { label: 'A', text: '"那你忙吧，我们下次再约。"（体贴但有点失落）' },
      { label: 'B', text: '"你总是这样！算了，我自己去。"（嘴上生气，其实会偷偷帮他带好吃的）' },
      { label: 'C', text: '"没关系，我陪你加班吧，在你公司附近等你。"（主动调整）' },
      { label: 'D', text: '默默不开心，但不会说，等他自己来哄你' }
    ]
  },
  {
    id: 6,
    question: '你更喜欢恋人用什么方式表达"我爱你"？',
    options: [
      { label: 'A', text: '直接说出来，每天说都不腻' },
      { label: 'B', text: '不用说太多，用行动证明（比如默默记住你的喜好）' },
      { label: 'C', text: '开玩笑或傲娇的方式（比如"我才不是喜欢你，只是顺便……"）' },
      { label: 'D', text: '浪漫的惊喜或仪式感（比如突然送花、写诗）' }
    ]
  },
  {
    id: 7,
    question: '你做了一个梦，梦里你和恋人走在一条陌生的路上，突然起雾了，他消失了。醒来后你的感觉是？',
    options: [
      { label: 'A', text: '有点不安，但觉得只是个梦' },
      { label: 'B', text: '会想主动联系他，确认他还在' },
      { label: 'C', text: '觉得梦在提醒自己不要太依赖别人' },
      { label: 'D', text: '梦里的感觉记不清了，无所谓' }
    ]
  },
  {
    id: 8,
    question: '你希望恋人在你面前展现更多的？',
    options: [
      { label: 'A', text: '脆弱的一面（他也会哭、会害怕）' },
      { label: 'B', text: '可靠的一面（他能帮你解决困难）' },
      { label: 'C', text: '有趣的一面（他总是能逗你笑）' },
      { label: 'D', text: '尊重的一面（给你足够的个人空间）' }
    ]
  },
  {
    id: 9,
    question: '当你心情很糟糕，需要安慰时，你更希望对方？',
    options: [
      { label: 'A', text: '安静地抱着你，听你哭诉' },
      { label: 'B', text: '帮你分析问题，给出建议' },
      { label: 'C', text: '用幽默或傻事逗你笑' },
      { label: 'D', text: '先让你冷静，等你主动开口' }
    ]
  },
  {
    id: 10,
    question: '最后，想象你和恋人一起看日落。你觉得那一刻最让你心动的是？',
    options: [
      { label: 'A', text: '他转头看着你的眼神' },
      { label: 'B', text: '你们十指相扣的手' },
      { label: 'C', text: '他说了一句只有你们才懂的笑话' },
      { label: 'D', text: '什么都不说，只是安静地一起看' }
    ]
  }
];

// 获取测试题目
router.get('/questions', (req, res) => {
  res.json({ questions });
});

// 提交答案
router.post('/submit', (req, res) => {
  const { answers, userId } = req.body;

  // 验证答案
  if (!answers || !Array.isArray(answers) || answers.length !== 10) {
    return res.status(400).json({ error: '答案格式不正确，需要10个选项' });
  }

  // 计算结果
  const result = computePersonality(answers);

  res.json({
    success: true,
    result
  });
});

module.exports = router;