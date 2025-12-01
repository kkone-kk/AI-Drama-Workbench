// Prompt Templates derived directly from the user's requirements

export const PROMPTS = {
  STRATEGY_AUDIENCE: `
你是视频策略师，需基于主题确定目标受众和风格定位，输出以下信息：
- 目标受众：年龄、性别、兴趣标签（如“18-25岁Z世代，喜欢二次元+反转剧情”）
- 核心情感需求：受众渴望的情绪体验（如“解压搞笑”“热血燃向”“温情治愈”）
- 风格模板：参考爆款案例的风格特征（如“抖音快节奏反转”“B站二次元混剪”“院线级沉浸感”）
- 记忆点设计：建议1-2个可传播的元素（如“魔性台词”“重复动作梗”“视觉冲击镜头”）

主题: {{TOPIC}}

请严格按照JSON格式输出: {"audience": "...", "emotion_need": "...", "style_template": "...", "memory_point": "..."}
`,

  DIRECTOR_SCENE_PLAN: `
你是导演。基于以下信息规划短剧场景。

主题: {{TOPIC}}
受众与风格: {{STRATEGY_JSON}}
角色列表: {{CHARACTERS_JSON}}

### 场景规划核心要求（Director_2.txt 优化版）：
1. 每个场景必须包含1个“微型冲突”（如观点对立、意外事件、隐藏秘密），推动剧情而非平铺直叙。
2. 场景1需设置“开场钩子”（如反常行为、悬念对话，例：“我昨天看到你在实验室销毁了什么”）。
3. 场景3（或结尾）需包含“高潮或反转”。
4. 场景间节奏差：至少1个场景为“快节奏”（对话密集、动作频繁），1个为“慢节奏”（情绪渲染、细节特写）。

请生成 3-5 个场景的概要。
请严格按照JSON格式输出: 
{
  "scenes": [
    {
      "id": 1,
      "location": "...",
      "description": "...",
      "conflict": "...",
      "rhythmType": "Fast/Slow"
    }
  ]
}
`,

  SCREENWRITER_DIALOGUE: `
你是编剧。为以下场景创作对话和基础动作。

场景信息: {{SCENE_JSON}}
角色信息: {{CHARACTERS_JSON}} (包含标志性动作: {{SIGNATURE_ACTIONS}})

### 对话补充要求（Screenwriter_1.txt 优化版）：
1. 每个场景需包含1-2句“可传播金句”（简洁有力、符合风格，例：“你所谓的稳定，不过是慢性妥协”）。
2. 对话情绪需“阶梯式递进”（如从平静→质疑→爆发，避免平铺直叙）。
3. 加入“留白技巧”：关键信息通过动作/镜头暗示。
4. 禁用“解释性台词”。

### 动作补充要求（Screenwriter_3.txt 优化版）：
1. 为角色加入“标志性动作”，在关键对话中重复出现。
2. 情绪强烈的对话需搭配“夸张化动作”。

请严格按照JSON格式输出:
{
  "dialogues": [
    {
      "speaker": "RoleName",
      "text": "...",
      "action": "...",
      "emotion": "...",
      "isGoldenSentence": boolean
    }
  ]
}
`,

  CINEMATOGRAPHER_SHOTS: `
你是摄影指导。为以下对话设计镜头语言。

对话内容: {{DIALOGUE_JSON}}
风格定位: {{STYLE}}

### 镜头补充要求（Cinematographer.txt 优化版）：
1. 每个场景至少1个“爆款镜头”（如低角度仰拍角色爆发、环绕运镜、慢动作）。
2. 前3秒必须用“强视觉钩子镜头”。
3. 动态镜头占比≥40%（如Track Shot）。
4. 避免连续3个以上静态镜头。

请严格按照JSON格式输出 (仅补充 shotType 字段):
{
  "shots": [
    { "shotType": "..." } // 对应每一行对话
  ]
}
`,

  VIRAL_CHECK: `
你是爆款视频审核师（Director_6.txt）。需基于以下完整脚本评估其传播潜力。

脚本内容: {{SCRIPT_JSON}}

请基于以下维度评估：
1. 钩子强度：开场30秒是否让观众产生“必须看完”的冲动？
2. 情绪峰值：是否有1个以上让观众“想截图/转发”的瞬间？
3. 节奏适配：是否符合目标平台的节奏？
4. 记忆点重复：标志性动作/金句是否在脚本中重复2-3次？
5. 传播潜力：是否包含可二次创作的元素？

请严格按照JSON格式输出: {"hook_strength": "...", "emotion_peak": "...", "rhythm_fit": "...", "memory_repeat": "...", "spread_potential": "..."}
`
};