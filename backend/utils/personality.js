// 心理测试映射表
const mapping = [
  { A: 'gentle', B: 'sunny', C: 'tsundere', D: 'mature' }, // 题1
  { A: 'gentle', B: 'tsundere', C: 'sunny', D: 'mature' }, // 题2
  { A: 'sunny', B: 'tsundere', C: 'mature', D: 'gentle' }, // 题3
  { A: 'gentle', B: 'sunny', C: 'mature', D: 'tsundere' }, // 题4
  { A: 'gentle', B: 'tsundere', C: 'sunny', D: 'mature' }, // 题5
  { A: 'sunny', B: 'mature', C: 'tsundere', D: 'gentle' }, // 题6
  { A: 'mature', B: 'sunny', C: 'tsundere', D: 'gentle' }, // 题7
  { A: 'gentle', B: 'mature', C: 'sunny', D: 'tsundere' }, // 题8
  { A: 'gentle', B: 'mature', C: 'sunny', D: 'tsundere' }, // 题9
  { A: 'sunny', B: 'gentle', C: 'tsundere', D: 'mature' }  // 题10
];

// 人格类型映射表（并列情况）
const mergeMap = {
  'gentle_sunny': 'gentle_sunny',
  'gentle_tsundere': 'gentle_tsundere',
  'gentle_mature': 'gentle_mature',
  'sunny_tsundere': 'sunny_tsundere',
  'sunny_mature': 'sunny_mature',
  'tsundere_mature': 'tsundere_mature'
};

// 人格类型中文描述
const typeDescriptions = {
  gentle: {
    name: '温柔型',
    description: '你内心柔软，细腻敏感，渴望被温柔以待。理想中的人应该像一汪清泉，能包容你的所有情绪。',
    keywords: ['体贴', '包容', '细腻', '倾听']
  },
  sunny: {
    name: '阳光型',
    description: '你热爱生活，喜欢热闹，希望身边的人也充满活力。理想中的人应该像小太阳一样，能照亮你的世界。',
    keywords: ['活力', '热情', '幽默', '积极']
  },
  tsundere: {
    name: '傲娇型',
    description: '你表面强势，内心柔软，喜欢斗嘴但需要被理解。理想中的人应该懂得你的口是心非。',
    keywords: ['傲娇', '毒舌', '护短', '反差']
  },
  mature: {
    name: '成熟型',
    description: '你重视稳定和安全感，希望身边人可靠稳重。理想中的人应该是你的依靠，能给你踏实的陪伴。',
    keywords: ['稳重', '可靠', '理性', '耐心']
  },
  gentle_sunny: {
    name: '温柔阳光型',
    description: '你既渴望温柔的陪伴，又喜欢充满活力的相处方式。理想中的人能在温柔中给你阳光般的温暖。',
    keywords: ['温暖', '体贴', '积极', '陪伴']
  },
  gentle_tsundere: {
    name: '温柔傲娇型',
    description: '你既有柔软的一面，又有傲娇的小脾气。理想中的人能包容你的情绪，看懂你的口是心非。',
    keywords: ['包容', '懂你', '温柔', '反差']
  },
  gentle_mature: {
    name: '温柔成熟型',
    description: '你渴望细腻温柔的陪伴，同时也看重安全感。理想中的人既温柔体贴，又稳重可靠。',
    keywords: ['温柔', '稳重', '细腻', '可靠']
  },
  sunny_tsundere: {
    name: '阳光傲娇型',
    description: '你喜欢有趣热烈的相处方式，也享受斗嘴的乐趣。理想中的人能和你一起搞笑，也能懂你的小脾气。',
    keywords: ['幽默', '活力', '有趣', '反差']
  },
  sunny_mature: {
    name: '阳光成熟型',
    description: '你喜欢积极阳光的氛围，同时也重视可靠性。理想中的人既充满活力，又能在关键时刻给你依靠。',
    keywords: ['积极', '可靠', '热情', '稳重']
  },
  tsundere_mature: {
    name: '傲娇成熟型',
    description: '你表面傲娇，但内心渴望稳定的依靠。理想中的人既能和你斗嘴，又能给你安全感。',
    keywords: ['护短', '稳重', '反差', '可靠']
  }
};

/**
 * 计算人格类型
 * @param {Array} answers - 用户答案数组，如 ['A','B','C',...]
 * @returns {Object} 包含分数和最终类型
 */
function computePersonality(answers) {
  const scores = { gentle: 0, tsundere: 0, sunny: 0, mature: 0 };

  answers.forEach((ans, idx) => {
    const type = mapping[idx][ans];
    if (type) scores[type]++;
  });

  // 找出最高分
  let maxScore = 0;
  let resultTypes = [];
  for (const [type, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      resultTypes = [type];
    } else if (score === maxScore) {
      resultTypes.push(type);
    }
  }

  // 处理并列
  let finalType;
  if (resultTypes.length === 1) {
    finalType = resultTypes[0];
  } else {
    const key = resultTypes.sort().join('_');
    finalType = mergeMap[key] || resultTypes[0];
  }

  return { scores, finalType, description: typeDescriptions[finalType] };
}

module.exports = { computePersonality, typeDescriptions };