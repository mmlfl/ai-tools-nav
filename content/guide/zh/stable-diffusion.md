---
title: "Stable Diffusion 完整使用指南：从入门到精通"
description: "全面介绍 Stable Diffusion 的核心功能、本地部署方法、提示词技巧、模型管理及适用场景，助你高效生成高质量 AI 图像"
tool: "stable-diffusion"
date: "2026-05-13"
---

## 工具简介

Stable Diffusion 是由 Stability AI 开发的一款开源文本到图像生成模型，自 2022 年发布以来迅速成为 AI 艺术创作领域的标杆工具。与其他闭源商业模型（如 Midjourney 或 DALL·E）不同，Stable Diffusion 的最大优势在于其完全开源的特性——用户不仅可以免费使用，还能在自己的电脑上本地运行，无需依赖云端服务，从而保障数据隐私并实现高度定制化。

该模型基于扩散机制（Diffusion Process），通过逐步去噪的方式从随机噪声中生成符合文本描述的图像。得益于活跃的社区生态，Stable Diffusion 拥有海量的第三方模型（如 Realistic Vision、DreamShaper、Anything V5 等）、插件（如 ControlNet、LoRA）和图形界面（如 AUTOMATIC1111 WebUI），极大降低了使用门槛，同时拓展了其在写实人像、动漫风格、建筑设计、概念艺术等领域的应用潜力。

## 核心功能

| 功能 | 说明 |
|------|------|
| 文本到图像生成（Text-to-Image） | 输入一段文字提示（Prompt），模型自动生成对应图像，支持分辨率最高达 1024×1024（需显存充足） |
| 图像到图像生成（Image-to-Image） | 在已有图像基础上，根据新提示进行重绘或风格迁移，保留原图结构的同时改变内容或风格 |
| Inpainting（局部重绘） | 对图像中选定区域进行智能填充或修改，常用于移除水印、更换背景或添加元素 |
| ControlNet 控制生成 | 通过边缘图、深度图、姿态图等条件输入，精确控制生成图像的构图、姿势或结构，提升可控性 |
| 模型微调与扩展 | 支持加载社区训练的 Checkpoint 模型、LoRA 微调模块、Textual Inversion 嵌入词等，灵活定制风格 |

## 如何使用

### 第一步：选择运行方式

Stable Diffusion 可通过以下几种方式使用：

1. **本地部署（推荐）**：适合有一定技术基础、希望完全掌控模型的用户。
   - 推荐使用 [AUTOMATIC1111 WebUI](https://github.com/AUTOMATIC1111/stable-diffusion-webui)，这是一个功能强大且用户友好的图形界面。
   - 系统要求：Windows/Linux/macOS（Apple Silicon 支持有限），建议配备至少 6GB 显存的 NVIDIA GPU（AMD 显卡需额外配置）。
   - 安装步骤简要：
     - 安装 Python 3.10+ 和 Git
     - 克隆 WebUI 仓库：`git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui.git`
     - 运行 `webui-user.bat`（Windows）或 `webui.sh`（Linux/macOS）
     - 首次启动会自动下载基础模型（如 v1.5 或 SDXL）

2. **在线平台（免安装）**：适合初学者快速体验。
   - 如 [Playground AI](https://playgroundai.com/)、[Hugging Face Spaces](https://huggingface.co/spaces) 提供免费或付费的 Stable Diffusion 在线服务。
   - 缺点是功能受限、无法加载自定义模型。

### 第二步：编写有效提示词（Prompt）

提示词质量直接影响生成效果。建议采用“正向提示 + 负向提示”结构：

- **正向提示**：描述你想要的内容，越具体越好  
  示例：`masterpiece, best quality, 1girl, long black hair, red eyes, cyberpunk city background, neon lights, rain`
- **负向提示**：排除不希望出现的元素  
  示例：`low quality, blurry, extra fingers, deformed face, text, watermark`

可使用权重语法强调关键词，如 `(red eyes:1.3)` 表示加强“红眼”效果。

### 第三步：调整生成参数

在 WebUI 中，关键参数包括：

- **Sampling Method**：推荐使用 DPM++ 2M Karras 或 Euler a，平衡速度与质量
- **Steps**：通常 20–30 步即可，过高收益递减
- **CFG Scale**：控制提示词影响力，一般设为 7–9
- **Seed**：固定种子可复现相同结果
- **Resolution**：默认 512×512，SDXL 模型支持 1024×1024

### 第四步：加载社区模型与插件

- 将下载的 `.ckpt` 或 `.safetensors` 模型文件放入 `models/Stable-diffusion/` 目录
- 插件（如 ControlNet）可通过 WebUI 的“Extensions”标签页一键安装
- LoRA 模型放入 `models/Lora/`，使用时在提示词中加入 `<lora:filename:weight>`

## 价格说明

Stable Diffusion 本身完全**免费开源**，无任何订阅费用。但本地运行需自行承担硬件成本（如 GPU）。若使用第三方在线平台（如 Leonardo.AI、Playground AI），则可能有免费额度限制，高级功能需付费（通常 $10–$30/月）。

## 适用场景

1. **数字艺术创作**：插画师、概念设计师可快速生成灵感草图或完整作品。
2. **游戏与影视素材生成**：制作角色设定、场景概念图、道具设计等。
3. **电商与广告设计**：批量生成产品展示图、海报背景、营销视觉素材。
4. **教育与研究**：用于 AI 生成艺术教学、计算机视觉实验或人机协作研究。

## 优缺点

### 优点
- ✅ 完全开源免费，无使用限制
- ✅ 支持本地运行，保护隐私与数据安全
- ✅ 社区生态极其丰富，模型和插件持续更新
- ✅ 高度可定制，支持微调、ControlNet 等高级功能

### 缺点
- ❌ 本地部署对硬件有一定要求，新手配置可能遇到困难
- ❌ 默认模型在手部、文字等细节上仍有缺陷，需技巧规避
- ❌ 生成结果存在随机性，需多次尝试才能获得理想图像
- ❌ AMD GPU 和 macOS 用户支持较弱，性能不如 NVIDIA

## 同类替代工具

1. **Midjourney**：闭源在线服务，图像美学表现优异，操作简单，但需 Discord 使用且按生成次数收费。
2. **DALL·E 3（OpenAI）**：集成于 ChatGPT，理解复杂提示能力强，适合商业用途，但无法本地部署。
3. **Adobe Firefly**：专注商业合规性，生成内容可用于 Adobe 商业产品，强调版权安全，但创意自由度较低。

---

*免责声明：本文所述工具及方法仅供学习与合法创作使用。AI 生成内容可能涉及版权、肖像权等法律问题，请遵守所在国家/地区相关法律法规，勿用于侵权、虚假信息传播或不当用途。*