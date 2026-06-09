/**
 * data.js — 所有数据：Excel步骤、练习题、小节测验、总测验
 */

// ========================================
// Excel 制作步骤数据
// ========================================
const STEPS_DATA = {
  bar: [
    { title:'准备数据', subtitle:'整理并录入数据', icon:'1',
      desc:'在Excel中新建工作表，将月份输入在A列，各品类数据分别输入B、C、D、E列。第一行为标题行（月份、手机数码、服装鞋包、食品饮料、家居百货），数据从A2开始录入。',
      tip:'数据表要规范，首行为标题，不要有空行，数字格式统一。',
      mock:'<span class="menu">A1:</span> 月份  <span class="highlight">B1:</span> 手机数码  <span class="highlight">C1:</span> 服装鞋包\n<span class="menu">A2:</span> 1月   <span class="highlight">B2:</span> 1850       <span class="highlight">C2:</span> 2300\n<span class="menu">A3:</span> 2月   <span class="highlight">B3:</span> 1560       <span class="highlight">C3:</span> 1980\n...' },
    { title:'选中数据区域', subtitle:'用鼠标拖选所有数据', icon:'2',
      desc:'用鼠标从A1拖动到E7，选中所有数据（包括标题行）。选中区域会显示蓝色高亮边框。如果数据不连续，可以按住Ctrl键多选。',
      tip:'一定要选中标题行，否则图表不会自动生成图例名称。',
      mock:'<span class="highlight">已选中区域：A1:E7</span>\n┌─────────────────────────────┐\n│ 月份 │手机数码│服装鞋包│...│\n│ 1月  │ 1850   │ 2300   │...│\n│ 2月  │ 1560   │ 1980   │...│\n└─────────────────────────────┘' },
    { title:'插入图表', subtitle:'选择柱形图类型', icon:'3',
      desc:'点击顶部菜单栏【插入】选项卡 → 点击【图表】组中的【柱形图】按钮 → 在弹出的下拉菜单中选择【簇状柱形图】（第一个选项）。图表会立即出现在工作表中。',
      tip:'鼠标悬停在各图表类型上，会显示预览效果和适用说明。',
      mock:'<span class="menu">菜单栏：</span> 文件 | 开始 | <span class="highlight">插入</span> | 页面布局...\n    ↓\n<span class="menu">功能区：</span> 表格 | 插图 | <span class="highlight">图表▼</span>\n    ↓\n<span class="highlight">选择：</span> 柱形图 → 簇状柱形图 ✓' },
    { title:'美化图表', subtitle:'设置标题、颜色、样式', icon:'4',
      desc:'双击图表标题修改为"各品类月度销量对比"；点击图表右侧的"+"按钮可添加数据标签；点击"🎨"按钮可更换配色方案。',
      tip:'职业场合建议使用简洁配色，避免过于花哨；标题要简洁明了。',
      mock:'<span class="highlight">图表标题：</span> 双击修改 → "各品类月度销量对比"\n<span class="highlight">图表元素：</span> [+] → ☑ 数据标签 ☑ 网格线\n<span class="highlight">图表样式：</span> 🎨 → 选择喜欢的配色方案' },
    { title:'调整与导出', subtitle:'完成图表制作', icon:'5',
      desc:'拖动图表四角的控制点调整大小；拖动图表中心可移动位置；制作完成后按Ctrl+S保存。如需单独导出，右键图表 → 另存为图片 → PNG格式。',
      tip:'建议将图表和数据放在同一工作表中，便于以后修改数据时图表自动更新。',
      mock:'<span class="highlight">调整大小：</span> 拖动图表四角控制点\n<span class="highlight">移动位置：</span> 点击图表中心拖动\n<span class="highlight">保存文件：</span> Ctrl + S\n<span class="highlight">导出图片：</span> 右键 → 另存为图片 → PNG' }
  ],
  line: [
    { title:'准备时间序列数据', subtitle:'整理月份和数值数据', icon:'1',
      desc:'折线图特别适合时间序列数据。在A列输入月份（1月~12月），B列输入访客量，C列输入成交量。确保月份数据按时间顺序排列。',
      tip:'折线图的X轴数据必须是有顺序的数据，如日期、时间、序号。',
      mock:'<span class="menu">A1:</span> 月份  <span class="highlight">B1:</span> 访客量(万)  <span class="highlight">C1:</span> 成交量\n<span class="menu">A2:</span> 1月   <span class="highlight">B2:</span> 12.5        <span class="highlight">C2:</span> 3200\n...\n<span class="menu">A13:</span> 12月  <span class="highlight">B13:</span> 25.3       <span class="highlight">C13:</span> 8100' },
    { title:'选中数据区域', subtitle:'选择要展示的列', icon:'2',
      desc:'选中A1:B13（月份和访客量），如需同时显示多条折线，按住Ctrl键再选C1:C13。',
      tip:'如果两列数值单位差异很大（如万人次和件数），建议使用次坐标轴。',
      mock:'<span class="highlight">选中：A1:A13</span> + <span class="highlight">Ctrl+B1:B13</span>\n（按住Ctrl可选择不连续区域）' },
    { title:'插入折线图', subtitle:'选择折线图样式', icon:'3',
      desc:'点击【插入】→【折线图】→ 选择【折线图】（带数据点的折线图）。生成后可在【图表设计】中切换不同折线样式。',
      tip:'数据点较少时选"带标记的折线图"，数据点多时选"折线图"更清晰。',
      mock:'<span class="menu">插入</span> → 图表 → <span class="highlight">折线图▼</span>\n    ├── 折线图\n    ├── <span class="highlight">带数据标记的折线图 ✓</span>\n    └── 三维折线图' },
    { title:'设置坐标轴', subtitle:'调整轴标签和范围', icon:'4',
      desc:'右键Y轴 → 设置坐标轴格式 → 可调整最小值、最大值和间隔。对于差异很大的两组数据，右键折线 → 设置数据系列格式 → 勾选"次坐标轴"。',
      tip:'坐标轴范围从0开始最准确；次坐标轴适合不同量级数据并排显示。',
      mock:'<span class="highlight">主坐标轴（左）：</span> 访客量 0~50万\n<span class="highlight">次坐标轴（右）：</span> 成交量 0~20000件\n右键折线 → 设置数据系列格式\n→ ● 次坐标轴' },
    { title:'美化与完成', subtitle:'添加标题和图例', icon:'5',
      desc:'双击标题改为"某电商店铺年度访客与成交趋势"；点击图例拖动到合适位置；可为关键数据点添加数据标注。',
      tip:'在折线图中，可右键数据点 → 添加数据标签，为特殊数值添加注释。',
      mock:'<span class="highlight">图表标题：</span> 某电商店铺年度访客与成交趋势\n<span class="highlight">图例位置：</span> 拖动到图表右上角\n<span class="highlight">保存：</span> Ctrl + S' }
  ],
  pie: [
    { title:'准备比例数据', subtitle:'只需品类和数值两列', icon:'1',
      desc:'饼图只需两列数据：A列为类别名称，B列为数值。Excel会自动计算百分比，不需要手动计算比例。确保数值均为正数。',
      tip:'饼图类别建议控制在7个以内，过多会导致扇区太小难以识别。',
      mock:'<span class="menu">A1:</span> 商品品类  <span class="highlight">B1:</span> 销售额(万元)\n<span class="menu">A2:</span> 手机数码  <span class="highlight">B2:</span> 285\n<span class="menu">A3:</span> 服装鞋包  <span class="highlight">B3:</span> 198\n...' },
    { title:'选中数据并插入饼图', subtitle:'选中A1:B6插入', icon:'2',
      desc:'选中A1:B6全部数据（包括标题行）→ 点击【插入】→【饼图】→ 选择【二维饼图】。若要制作圆环图则选择【圆环图】。',
      tip:'如需制作复合饼图，选择"复合饼图"或"复合条饼图"。',
      mock:'<span class="menu">插入</span> → 图表 → <span class="highlight">饼图▼</span>\n    ├── <span class="highlight">二维饼图 ✓</span>\n    ├── 三维饼图\n    ├── 圆环图\n    └── 复合饼图' },
    { title:'添加数据标签', subtitle:'显示百分比和类别名', icon:'3',
      desc:'点击图表 → 右键任意扇区 → 添加数据标签 → 再右键标签 → 设置数据标签格式 → 勾选"类别名称"和"百分比"。',
      tip:'标签位置选择"最佳匹配"，Excel会自动避免标签重叠。',
      mock:'<span class="highlight">数据标签格式设置：</span>\n☑ 类别名称  ☑ 百分比\n☐ 值  ☑ 显示引导线\n位置：● 最佳匹配' },
    { title:'制作复合饼图', subtitle:'展示手机数码的子类构成', icon:'4',
      desc:'复合饼图需重新整理数据：A列前4行放主要类别，后3行放"手机数码"的子类。选中数据 → 插入 → 复合饼图。右键图表 → 设置数据系列格式 → 调整第二绘图区。',
      tip:'复合饼图中，被细分的类别会自动合并显示在主饼图中。',
      mock:'<span class="menu">数据结构（复合饼图用）：</span>\nA2: 服装鞋包  B2: 198\nA3: 食品饮料  B3: 142\nA6: 手机-手机 B6: 158  ← 子类\nA7: 手机-电脑 B7: 72   ← 子类\nA8: 手机-配件 B8: 55   ← 子类' },
    { title:'美化饼图', subtitle:'分离扇区、调整颜色', icon:'5',
      desc:'点击要强调的扇区 → 再次单击选中单个扇区 → 向外拖动可分离该扇区；右键扇区 → 设置数据点格式 → 可单独设置颜色。',
      tip:'分离最重要的那个扇区，可以突出重点数据。',
      mock:'<span class="highlight">分离扇区：</span> 点击扇区→再点→向外拖\n<span class="highlight">单独配色：</span> 右键单个扇区 → 格式\n<span class="highlight">图表样式：</span> 选择方案4（色彩丰富）' },
    { title:'保存与导出', subtitle:'完成并保存文件', icon:'6',
      desc:'饼图制作完成！检查所有标签是否清晰可读，各扇区颜色是否区分明显。按Ctrl+S保存。',
      tip:'如需在PPT中使用，可直接复制粘贴图表，选择"保留原格式"即可。',
      mock:'<span class="highlight">最终检查清单：</span>\n☑ 标签清晰（类别+百分比）\n☑ 颜色区分明显\n☑ 图表标题准确\nCtrl+S 保存 ✓' }
  ],
  hbar: [
    { title:'准备数据', subtitle:'整理商品名称和数值', icon:'1',
      desc:'在Excel中，A列输入商品名称（8个），B列输入月销量，C列输入好评率。第一行为标题行。条形图数据结构与柱状图完全相同。',
      tip:'若希望排行榜从高到低排列，建议先对数据降序排序。',
      mock:'<span class="menu">A1:</span> 商品名称  <span class="highlight">B1:</span> 月销量\n<span class="menu">A2:</span> 无线蓝牙耳机Pro  <span class="highlight">B2:</span> 8650\n💡 建议先按B列降序排序' },
    { title:'选中数据并插入图表', subtitle:'选择条形图类型', icon:'2',
      desc:'选中A1:B9 → 点击【插入】→【条形图】→ 选择【簇状条形图】。注意条形图的图标是水平的，不要选错成"柱形图"！',
      tip:'Excel中"条形图"和"柱形图"是分开的按钮，不要选错。',
      mock:'<span class="menu">插入</span> → 图表 → <span class="highlight">条形图▼</span>\n    ├── <span class="highlight">簇状条形图 ✓</span>\n    ├── 堆积条形图\n    └── 百分比堆积条形图' },
    { title:'调整排列顺序', subtitle:'让排行榜从高到低展示', icon:'3',
      desc:'右键Y轴 → 设置坐标轴格式 → 勾选"逆序类别"，使第一行数据出现在最上方，形成从高到低的排行榜效果。',
      tip:'勾选"逆序类别"后，图表Y轴顺序将反转。',
      mock:'右键 <span class="highlight">Y轴</span>\n→ 设置坐标轴格式\n→ ☑ <span class="highlight">逆序类别</span>\n效果：销量最高的商品出现在顶部 ✓' },
    { title:'添加数据标签', subtitle:'在条形末端显示数值', icon:'4',
      desc:'点击图表 → 右上角[+] → 勾选"数据标签" → 选择"数据标签外"，让每根条形右端显示具体销量数值。',
      tip:'数据标签建议选"数据标签外"，不要选"居中"。',
      mock:'点击图表 → 右上角 <span class="highlight">[+]</span>\n→ ☑ 数据标签 → 数据标签外 ✓' },
    { title:'美化与完成', subtitle:'设置配色和标题', icon:'5',
      desc:'双击标题改为"热销商品月度销量排行TOP8"；右键条形 → 设置数据系列格式 → 调整间距宽度（建议150%）。',
      tip:'排行榜图表建议使用渐变色或统一品牌色。',
      mock:'<span class="highlight">图表标题：</span> 热销商品月度销量排行TOP8\n<span class="highlight">间距宽度：</span> 150%\nCtrl+S 保存 ✓' }
  ],
  scatter: [
    { title:'准备两列变量数据', subtitle:'X变量和Y变量各一列', icon:'1',
      desc:'散点图需要两列数值数据：A列放X轴变量（月广告费），B列放Y轴变量（月销售额）。不需要文字标签列！',
      tip:'散点图的数据格式特殊：两列都是纯数值，不要将文字列包含在选择范围内。',
      mock:'<span class="menu">A1:</span> 月广告费(万)  <span class="highlight">B1:</span> 月销售额(万)\n<span class="menu">A2:</span> 0.5           <span class="highlight">B2:</span> 8.2\n<span class="menu">A3:</span> 1.2           <span class="highlight">B3:</span> 15.6\n⚠️ 两列都是纯数字' },
    { title:'插入散点图', subtitle:'选择仅带标记的散点图', icon:'2',
      desc:'选中A1:B11 → 【插入】→【散点图(X,Y)】→ 选择【仅带数据标记的散点图】。',
      tip:'不要选"带平滑线的散点图"，会失去散点图的意义。',
      mock:'<span class="menu">插入</span> → <span class="highlight">散点图(X,Y)▼</span>\n    ├── <span class="highlight">仅带数据标记 ✓</span>\n    ├── 带平滑线和数据标记\n    └── 仅带直线' },
    { title:'添加趋势线', subtitle:'展示数据的相关性方向', icon:'3',
      desc:'右键任意散点 → 添加趋势线 → 选择【线性】→ 勾选【显示公式】和【显示R²值】。R²越接近1说明相关性越强。',
      tip:'R²>0.7一般认为有强相关性。',
      mock:'右键数据点 → <span class="highlight">添加趋势线</span>\n→ ● <span class="highlight">线性</span>\n→ ☑ 显示公式  ☑ 显示R²值\nR²=0.98 → <span class="highlight">强正相关 ✓</span>' },
    { title:'标记数据点', subtitle:'为每个点添加标签', icon:'4',
      desc:'右键数据点 → 添加数据标签 → 右键标签 → 设置数据标签格式 → 勾选"单元格中的值" → 选择店铺编号列。',
      tip:'数据点超过20个时，只为异常点单独添加标签。',
      mock:'右键标签 → 设置数据标签格式\n→ ☑ <span class="highlight">单元格中的值</span>\n→ 选择 店铺编号范围' },
    { title:'美化与解读', subtitle:'完成图表并写出结论', icon:'5',
      desc:'设置坐标轴标题；添加图表标题"广告投入与销售额相关性分析"。最后用文字说明相关性结论。',
      tip:'散点图最重要的是结论，一定要写分析说明。',
      mock:'<span class="highlight">X轴：</span> 月广告费（万元）\n<span class="highlight">Y轴：</span> 月销售额（万元）\n<span class="highlight">结论：</span> R²=0.98，呈强正相关' }
  ],
  radar: [
    { title:'准备评分数据', subtitle:'维度名称+各对象评分', icon:'1',
      desc:'A列放评估维度名称，B、C、D列分别放三家店铺得分。所有数据要在同一量纲（如百分制0-100分）。',
      tip:'雷达图各维度必须使用统一量纲！不同单位需先归一化。',
      mock:'<span class="menu">A1:</span> 评估维度  <span class="highlight">B1:</span> A店  <span class="highlight">C1:</span> B店\n<span class="menu">A2:</span> 商品质量  <span class="highlight">B2:</span> 88   <span class="highlight">C2:</span> 92\n⚠️ 所有数值必须同一量纲' },
    { title:'选中数据插入雷达图', subtitle:'在其他图表中找到', icon:'2',
      desc:'选中A1:D7 → 【插入】→【查看所有图表】→ 左侧选择【雷达图】→ 选择第一种样式 → 确定。',
      tip:'雷达图不在常用图表快捷按钮中，需要在"查看所有图表"里找。',
      mock:'<span class="menu">插入</span> → 图表组右下角 <span class="highlight">↘</span>\n→ 左侧列表：<span class="highlight">雷达图</span>\n→ 选择：● 雷达图 → 确定 ✓' },
    { title:'调整维度顺序', subtitle:'合理排列评估维度', icon:'3',
      desc:'雷达图中维度的排列顺序会影响多边形形状。相关维度相邻排列，如"商品质量"和"售后服务"相邻。',
      tip:'维度按顺时针方向排列（从12点钟方向开始）。',
      mock:'优化排列：\n① 商品质量（12点）\n② 客服响应（2点）\n③ 物流速度（4点）\n...' },
    { title:'设置图表样式', subtitle:'区分各对象的颜色', icon:'4',
      desc:'点击某店铺雷达区域 → 设置数据系列格式 → 调整填充透明度（建议30-50%，多个雷达重叠时都能看清）。',
      tip:'多个对象叠加时，使用半透明填充是关键。',
      mock:'填充透明度：<span class="highlight">40%</span>\n三家店铺用不同颜色区分 ✓' },
    { title:'添加标注与分析', subtitle:'完成并写出结论', icon:'5',
      desc:'添加图表标题"三家店铺综合运营能力对比"；观察面积大小判断综合实力。',
      tip:'雷达图面积大小代表综合实力。',
      mock:'<span class="highlight">分析结论：</span>\nA店：客服和设计突出\nB店：商品质量和价格好\nC店：物流和售后强' }
  ],
  bubble: [
    { title:'准备三列数值数据', subtitle:'X值、Y值、气泡大小三列', icon:'1',
      desc:'气泡图需要三列纯数值数据：B列=X轴（月销量），C列=Y轴（利润率），D列=气泡大小（在售商品数）。',
      tip:'气泡大小的数值范围差异不要太大，否则最小气泡几乎看不见。',
      mock:'<span class="highlight">B列</span>(X:销量)  <span class="highlight">C列</span>(Y:利润率)  <span class="highlight">D列</span>(气泡)\n5680           18.5           320\n8920           42.3           1560\n⚠️ 选择B、C、D三列' },
    { title:'插入气泡图', subtitle:'在其他图表中选择', icon:'2',
      desc:'选中B1:D8 → 【插入】→【查看所有图表】→ XY散点图 → 气泡图 → 确定。Excel会自动映射三列数据。',
      tip:'如果气泡大小方向不对，右键气泡 → "设置数据系列格式" → 调整大小缩放。',
      mock:'选中 <span class="highlight">B1:D8</span>\nXY散点图 → <span class="highlight">气泡图 ✓</span>\n自动映射：B→X, C→Y, D→气泡' },
    { title:'添加品类标签', subtitle:'显示每个气泡代表的品类', icon:'3',
      desc:'右键气泡 → 添加数据标签 → 设置数据标签格式 → 勾选"单元格中的值" → 选择A列品类名称范围。',
      tip:'气泡图标签建议只显示品类名称。',
      mock:'右键标签 → 设置格式\n→ ☑ <span class="highlight">单元格中的值</span>\n→ 选择 <span class="highlight">A2:A8</span>（品类名称）' },
    { title:'添加象限参考线', subtitle:'划分四象限辅助分析', icon:'4',
      desc:'计算X轴和Y轴的均值 → 用插入形状画十字线 → 标注四象限含义。',
      tip:'右上=明星产品、左上=利润品、右下=走量品、左下=瘦狗产品。',
      mock:'四象限：\n↖ 利润品  ↗ <span class="highlight">明星产品</span>\n←————+————→\n↙ 瘦狗品  ↘ 走量品' },
    { title:'调整气泡样式', subtitle:'设置颜色、透明度', icon:'5',
      desc:'右键单个气泡 → "因点设置格式" → 为每个气泡单独设置颜色；调整透明度30%。',
      tip:'"因点设置格式"可以为每个气泡单独配色。',
      mock:'右键单个气泡 → <span class="highlight">因点设置格式</span>\n→ 填充：实色  透明度：30%\n→ 边线：白色，2pt' },
    { title:'分析结论', subtitle:'提炼洞察并保存', icon:'6',
      desc:'添加标题"电商品类综合分析"；观察四象限位置得出结论。',
      tip:'气泡图的价值在于发现数据规律，一定要配文字分析。',
      mock:'<span class="highlight">结论：</span>\n🌟 明星品：美妆（高利润+中销量）\n📦 走量品：食品（高销量+中利润）\n\nCtrl+S 保存 ✓' }
  ]
};

// ========================================
// 课堂练习题数据
// ========================================
const EXERCISE_DATA = {
  bar: [
    { type:'judge', text:'柱状图的柱子高度代表数据的大小，柱子越高表示数值越大。', answer:true, explain:'正确！柱状图中纵轴为数值轴，柱子高度与数值成正比。' },
    { type:'judge', text:'柱状图适合展示连续时间序列的变化趋势，是趋势分析的最佳选择。', answer:false, explain:'错误！趋势分析最适合用折线图，柱状图更适合类别之间的数值比较。' },
    { type:'single', text:'某电商平台需要对比1月到6月各品类的销售额，最适合使用哪种图表？', options:['折线图','柱状图','饼图','散点图'], answer:1, explain:'柱状图最适合对比不同类别在特定时期的数值差异。' },
    { type:'multi', text:'以下哪些场景适合使用柱状图？（多选）', options:['比较各商品的月度销量','展示公司全年销售额占比','对比各地区销售人员业绩','分析某商品价格随时间的波动'], answer:[0,2], explain:'柱状图适合类别数值比较（A、C）。占比用饼图，价格波动用折线图。' },
    { type:'single', text:'在Excel中插入柱状图，正确的操作顺序是？', options:['先美化→再选数据→再插入','先选数据→插入→图表→柱形图','先插入图表→再输入数据','先建立坐标轴→再填充数据'], answer:1, explain:'正确操作：先选中数据区域，然后点击"插入"→"图表"→"柱形图"。' },
    { type:'match', text:'将图表类型与适用场景连线匹配：',
      left:['比较类别数值','展示时间趋势','显示构成比例'],
      right:['折线图','柱状图','饼图'],
      answer:[1,0,2] }
  ],
  line: [
    { type:'judge', text:'折线图的X轴数据必须是有顺序的数据，如日期、时间或序号。', answer:true, explain:'正确！折线图要求X轴是连续或有序的数据。' },
    { type:'judge', text:'折线图中的折线数量越多越好。', answer:false, explain:'错误！折线过多（超过5条）会导致图表混乱。' },
    { type:'single', text:'分析某网店全年日均流量变化，最适合的图表是？', options:['柱状图','饼图','折线图','条形图'], answer:2, explain:'折线图最适合展示时间序列数据的变化趋势。' },
    { type:'multi', text:'以下哪些情况适合使用"次坐标轴"？（多选）', options:['两组数据数量级差异很大','两组数据单位相同','需要同时展示访客量和转化率','数据只有一个系列'], answer:[0,2], explain:'量级差异大或单位不同时使用次坐标轴。' },
    { type:'single', text:'如何为折线图中的特殊数据点（如双十一峰值）添加注释？', options:['直接在单元格旁写文字','右键数据点→添加数据标签','删除其他数据点','更换图表类型'], answer:1, explain:'右键点击特定数据点，选择"添加数据标签"。' },
    { type:'match', text:'将折线图概念与描述连线：',
      left:['X轴','Y轴','数据点'],
      right:['显示数值大小','图中的小圆点','表示时间或顺序'],
      answer:[2,0,1] }
  ],
  pie: [
    { type:'judge', text:'饼图中所有扇区的百分比之和等于100%。', answer:true, explain:'正确！饼图表示各部分占总体的比例。' },
    { type:'judge', text:'饼图适合展示20个类别的数据分布。', answer:false, explain:'错误！饼图类别建议不超过7个。' },
    { type:'single', text:'展示各品类销售额占比，最适合使用？', options:['柱状图','折线图','饼图','雷达图'], answer:2, explain:'饼图专门用于展示部分与整体的比例关系。' },
    { type:'multi', text:'复合饼图的特点有哪些？（多选）', options:['可对某扇区进行二级细分','所有类别必须相同大小','适合含子类的层次数据','只能展示3个类别'], answer:[0,2], explain:'复合饼图可细分扇区（A）、适合含子类数据（C）。' },
    { type:'single', text:'在饼图中强调最重要的扇区，可以？', options:['涂成黑色','向外拖动分离该扇区','删除其他扇区','放在圆心位置'], answer:1, explain:'点击扇区后向外拖动，使其分离突出。' },
    { type:'match', text:'将饼图类型与特点连线：',
      left:['普通饼图','圆环图','复合饼图'],
      right:['中心镂空可添加文字','对某扇区进行二级展示','最基础的比例图表'],
      answer:[2,0,1] }
  ],
  hbar: [
    { type:'judge', text:'条形图与柱状图的数据展示方向相同，只是外观略有差异。', answer:false, explain:'错误！条形图水平排列，柱状图垂直排列，方向完全不同。' },
    { type:'judge', text:'当商品名称很长时，使用条形图比柱状图更适合。', answer:true, explain:'正确！条形图Y轴有较大横向空间，长名称不会被截断。' },
    { type:'single', text:'为使排名靠前的商品在图表顶部，需要在Excel中勾选？', options:['正序排列','逆序类别','数据标签','次坐标轴'], answer:1, explain:'"逆序类别"可以将Y轴类别顺序反转。' },
    { type:'multi', text:'以下哪些场景更适合条形图？（多选）', options:['商品名称超过8个字','展示12个月销售趋势','各省份订单量排行（34个）','比较3个类别大小'], answer:[0,2], explain:'名称长（A）和类别多（C）是选择条形图的主要理由。' },
    { type:'single', text:'制作条形图应选择哪个图表类型按钮？', options:['柱形图','折线图','条形图','散点图'], answer:2, explain:'制作水平条形图必须选择"条形图"按钮。' },
    { type:'match', text:'将条形图术语与解释连线：',
      left:['X轴','Y轴','逆序类别'],
      right:['类别标签所在轴','反转类别排列顺序','数值大小所在轴'],
      answer:[2,0,1] }
  ],
  scatter: [
    { type:'judge', text:'散点图中数据点从左下到右上分布，说明两变量呈正相关。', answer:true, explain:'正确！正相关表示一个变量增大时另一个也增大。' },
    { type:'judge', text:'散点图适合展示某店铺12个月的销售额变化趋势。', answer:false, explain:'错误！时间趋势分析应使用折线图。' },
    { type:'single', text:'R²=0.95表示什么含义？', options:['两变量完全无关','两变量有强正相关','两变量有弱相关','数据有误差'], answer:1, explain:'R²越接近1，线性相关性越强。' },
    { type:'multi', text:'以下哪些是散点图的正确使用场景？（多选）', options:['分析广告费与销售额关系','展示各品类销售额占比','探索价格与销量关系','识别异常值'], answer:[0,2,3], explain:'散点图用于分析两变量相关性和识别异常值。' },
    { type:'single', text:'在散点图中添加趋势线，应如何操作？', options:['插入→形状→直线','右键数据点→添加趋势线','在数据表中计算','图表设计→添加趋势线'], answer:1, explain:'右键点击散点，选择"添加趋势线"。' },
    { type:'match', text:'将散点图概念与含义连线：',
      left:['正相关','负相关','R²=1'],
      right:['完全线性相关','X增大Y增大','X增大Y减小'],
      answer:[1,2,0] }
  ],
  radar: [
    { type:'judge', text:'雷达图中多边形面积越大，综合表现越好。', answer:true, explain:'正确！面积越大代表各维度数值越高。' },
    { type:'judge', text:'雷达图各维度可以使用不同单位。', answer:false, explain:'错误！各维度必须统一量纲。' },
    { type:'single', text:'对比三家店铺时，建议最多几家？', options:['不限数量','最多3家','最多5家','最多10家'], answer:1, explain:'对比对象不宜超过3个。' },
    { type:'multi', text:'以下关于雷达图正确的有？（多选）', options:['适合多维度综合评估','可以展示时间趋势','各维度数据需统一量纲','突出顶点代表优势'], answer:[0,2,3], explain:'时间趋势用折线图。' },
    { type:'single', text:'在Excel中雷达图位于哪里？', options:['常用图表第一个','折线图子类中','查看所有图表中寻找','散点图旁边'], answer:2, explain:'需点击"查看所有图表"→"雷达图"。' },
    { type:'match', text:'将雷达图概念与描述连线：',
      left:['坐标轴','多边形面积','顶点位置'],
      right:['代表该维度评分高低','综合表现','代表一个评估维度'],
      answer:[2,1,0] }
  ],
  bubble: [
    { type:'judge', text:'气泡图是散点图的升级版，增加了用气泡大小表示第三变量。', answer:true, explain:'正确！气泡图在两变量基础上增加气泡大小维度。' },
    { type:'judge', text:'气泡图中气泡的半径代表数值大小。', answer:false, explain:'错误！是面积（而非半径）代表数值大小。' },
    { type:'single', text:'制作气泡图需要几列数据？', options:['1列','2列','3列','4列'], answer:2, explain:'需要3列数值数据：X、Y、气泡大小。' },
    { type:'multi', text:'关于四象限分析正确的有哪些？（多选）', options:['右上=高X+高Y','需要均值参考线','有助于数据决策','气泡大小无意义'], answer:[0,1,2], explain:'气泡大小也有分析价值（D错误）。' },
    { type:'single', text:'如何为气泡添加品类名称标签？', options:['直接输入在气泡上','右键→添加数据标签→勾选单元格中的值','在图表标题列出','无法添加'], answer:1, explain:'通过"单元格中的值"选择品类名称列。' },
    { type:'match', text:'将气泡图三个维度与案例连线：',
      left:['X轴','Y轴','气泡大小'],
      right:['利润率（%）','在售商品数量','月销量（件）'],
      answer:[2,0,1] }
  ]
};

// ========================================
// 小节测验数据
// ========================================
const QUIZ_DATA = {
  bar: [
    { type:'single', text:'以下哪种图表最适合比较不同类别的数值大小？', options:['折线图','柱状图','饼图','散点图'], answer:1 },
    { type:'judge', text:'柱状图的纵轴一般应从0开始，以避免数据误导。', answer:true },
    { type:'multi', text:'以下关于柱状图的说法正确的有？（多选）', options:['适合类别对比','可以制作分组柱状图','适合展示时间趋势','类别越多越好'], answer:[0,1] },
    { type:'single', text:'在Excel中，制作柱状图的第一步操作是？', options:['插入图表','选中数据区域','美化图表','添加标题'], answer:1 },
    { type:'judge', text:'分组柱状图可以同时展示多组数据，便于各组之间对比。', answer:true }
  ],
  line: [
    { type:'single', text:'分析全年销售额变化趋势最适合？', options:['柱状图','饼图','折线图','条形图'], answer:2 },
    { type:'judge', text:'折线图折线越多一定比折线少的好。', answer:false },
    { type:'multi', text:'折线图适用场景包括？（多选）', options:['股票价格走势','品类销售占比','用户增长趋势','温度变化规律'], answer:[0,2,3] },
    { type:'single', text:'两条折线数值差距很大时建议？', options:['删除其中一条','次坐标轴','换用柱状图','调整纸张'], answer:1 },
    { type:'judge', text:'折线图X轴可以是无序分类数据。', answer:false }
  ],
  pie: [
    { type:'single', text:'展示各品类占总销售额比例最适合？', options:['折线图','柱状图','散点图','饼图'], answer:3 },
    { type:'judge', text:'饼图所有扇区百分比之和为100%。', answer:true },
    { type:'multi', text:'使用饼图需要注意？（多选）', options:['类别不超过7个','类别越多越好','避免3D效果','数值必须为正'], answer:[0,2,3] },
    { type:'single', text:'复合饼图的主要特点是什么？', options:['两个完全独立的饼图','对某一扇区进行细分展示','只能展示3个类别','类别超20个'], answer:1 },
    { type:'judge', text:'在饼图中将扇区向外拖动可起到突出强调效果。', answer:true }
  ],
  hbar: [
    { type:'single', text:'34个省份订单量排行且省名较长，最适合？', options:['柱状图','条形图','折线图','饼图'], answer:1 },
    { type:'judge', text:'勾选"逆序类别"可让排名第一的项目显示在最上方。', answer:true },
    { type:'multi', text:'以下关于条形图正确的有？（多选）', options:['水平排列矩形条','类别名称在Y轴','适合类别短的数据','可以展示排行榜'], answer:[0,1,3] },
    { type:'single', text:'为让排行榜从上到下排列应勾选？', options:['主坐标轴','逆序类别','数据标签','网格线'], answer:1 },
    { type:'judge', text:'条形图和柱状图传达的信息本质相同。', answer:true }
  ],
  scatter: [
    { type:'single', text:'分析价格与销量关系最适合？', options:['柱状图','折线图','饼图','散点图'], answer:3 },
    { type:'judge', text:'R²值越大，线性相关性越强。', answer:true },
    { type:'multi', text:'散点图可实现哪些功能？（多选）', options:['添加趋势线','展示相关性方向','识别异常点','展示构成比例'], answer:[0,1,2] },
    { type:'single', text:'数据点随机分散说明什么关系？', options:['强正相关','强负相关','无相关','数据有误'], answer:2 },
    { type:'judge', text:'制作散点图需包含文字标签列在选中范围内。', answer:false }
  ],
  radar: [
    { type:'single', text:'对比三家店铺五个维度的综合表现最适合？', options:['柱状图','折线图','雷达图','散点图'], answer:2 },
    { type:'judge', text:'雷达图各维度数据可以使用不同单位。', answer:false },
    { type:'multi', text:'关于雷达图正确的有哪些？（多选）', options:['面积越大表现越好','适合多维度评估','维度3-8个','可无限叠加对象'], answer:[0,1,2] },
    { type:'single', text:'在Excel中找到雷达图应该去？', options:['插入→折线图','插入→查看所有图表→雷达图','插入→柱形图','插入→散点图'], answer:1 },
    { type:'judge', text:'突出向外延伸的顶点代表该维度是优势。', answer:true }
  ],
  bubble: [
    { type:'single', text:'气泡图与散点图最主要区别？', options:['颜色不同','气泡图有第三变量','不能加趋势线','坐标轴方向不同'], answer:1 },
    { type:'judge', text:'气泡图中半径大小代表数值。', answer:false },
    { type:'multi', text:'制作气泡图需要？（多选）', options:['X轴数值列','Y轴数值列','气泡大小数值列','文字标签列（必须）'], answer:[0,1,2] },
    { type:'single', text:'四象限中右上象限的商品通常被称为？', options:['瘦狗产品','走量品','明星产品','利润品'], answer:2 },
    { type:'judge', text:'气泡图适合同时分析三个变量关系。', answer:true }
  ]
};

// ========================================
// 总测验 20 道综合题
// ========================================
const EXAM_QUESTIONS = [
  { id:1, topic:'柱状图', type:'single', score:5, text:'最适合比较不同商品类别月度销售额的图表是？', options:['折线图','柱状图','饼图','雷达图'], answer:1 },
  { id:2, topic:'柱状图', type:'judge', score:5, text:'分组柱状图可在同一图表中同时展示多个数据系列进行对比。', answer:true },
  { id:3, topic:'柱状图', type:'single', score:5, text:'堆叠柱状图的主要作用是？', options:['展示时间趋势','展示各组成部分及总量','展示两变量相关性','多维度评分'], answer:1 },
  { id:4, topic:'折线图', type:'single', score:5, text:'分析全年访客量变化趋势（双十一峰值）最适合？', options:['柱状图','饼图','折线图','气泡图'], answer:2 },
  { id:5, topic:'折线图', type:'multi', score:5, text:'哪些情况适合使用"次坐标轴"？（多选）', options:['两组数据量级差异很大','两组数据单位相同','需要同时展示访客量(万)和转化率(%)','数据只有一个系列'], answer:[0,2], partial:3 },
  { id:6, topic:'折线图', type:'judge', score:5, text:'折线图X轴数据必须是连续有顺序的，不能是无序分类数据。', answer:true },
  { id:7, topic:'饼图', type:'single', score:5, text:'展示各品类占总销售额比例最适合？', options:['柱状图','折线图','散点图','饼图'], answer:3 },
  { id:8, topic:'饼图', type:'judge', score:5, text:'饼图类别数量越多越好。', answer:false },
  { id:9, topic:'饼图', type:'multi', score:5, text:'关于复合饼图正确的有哪些？（多选）', options:['可对某扇区进行二级细分','适合含子类别层次数据','所有扇区必须等大','适合类别超20个的数据'], answer:[0,1], partial:3 },
  { id:10, topic:'条形图', type:'single', score:5, text:'34个省份订单量排行且省名较长最适合？', options:['柱状图','条形图','折线图','饼图'], answer:1 },
  { id:11, topic:'条形图', type:'judge', score:5, text:'勾选"逆序类别"可让排名第一的项目显示在最上方。', answer:true },
  { id:12, topic:'条形图', type:'single', score:5, text:'条形图与柱状图最主要区别？', options:['条形图只展示一组数据','条形图水平排列，柱状图垂直排列','条形图不能显示数据标签','条形图必须从大到小排列'], answer:1 },
  { id:13, topic:'散点图', type:'judge', score:5, text:'散点图中点从左下到右上分布说明正相关。', answer:true },
  { id:14, topic:'散点图', type:'single', score:5, text:'R²=0.85表示什么？', options:['两变量完全无关','两变量有较强线性相关','两变量有微弱相关','数据存在错误'], answer:1 },
  { id:15, topic:'散点图', type:'single', score:5, text:'趋势线从左上到右下说明什么？', options:['正相关','负相关','无相关','数据错误'], answer:1 },
  { id:16, topic:'雷达图', type:'multi', score:5, text:'使用雷达图需注意？（多选）', options:['各维度需统一量纲','维度3-8个','对比对象最多3个','维度越多越好'], answer:[0,1,2], partial:3 },
  { id:17, topic:'雷达图', type:'single', score:5, text:'多边形面积越大代表？', options:['某一维度突出','综合表现越好','数据量更多','维度更多'], answer:1 },
  { id:18, topic:'雷达图', type:'judge', score:5, text:'雷达图适合同时展示10家店铺综合能力对比。', answer:false },
  { id:19, topic:'气泡图', type:'single', score:5, text:'气泡图与散点图本质区别？', options:['颜色更多','用气泡大小表示第三变量','不能加趋势线','只能用正数值'], answer:1 },
  { id:20, topic:'气泡图', type:'judge', score:5, text:'气泡面积（非半径）代表第三变量数值。', answer:true }
];
