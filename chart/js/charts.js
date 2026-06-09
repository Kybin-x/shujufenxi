/**
 * charts.js — 所有 ECharts 图表初始化和交互切换
 */

// 全局图表实例
const chartInstances = {};
const chartInited = {};

// ========================================
// 初始化指定图表
// ========================================
function initChart(name) {
  if (chartInited[name]) return;
  const el = document.getElementById('chart' + name.charAt(0).toUpperCase() + name.slice(1));
  if (!el) return;
  chartInstances[name] = echarts.init(el);
  chartInited[name] = true;
}

// ========================================
// 通用：更新图表按钮状态
// ========================================
function updateChartBtns(chartName, btn) {
  const panel = document.getElementById('panel-' + (chartName === 'hbar' ? 'hbar' : chartName));
  if (panel) {
    panel.querySelectorAll('.chart-controls .chart-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
  }
}

// ========================================
// 柱状图
// ========================================
function updateBarChart(mode, btn) {
  updateChartBtns('bar', btn);
  const c = chartInstances.bar;
  if (!c) return;
  const months = ['1月','2月','3月','4月','5月','6月'];
  const colors = ['#C17F3A','#E84545','#4CAF82','#4A90D9'];
  const optionMap = {
    monthly: {
      title:{text:'电商平台各品类月度销量对比',left:'center',textStyle:{color:'#3E1F00',fontSize:14}},
      tooltip:{trigger:'axis',axisPointer:{type:'shadow'}},
      legend:{bottom:0,data:['手机数码','服装鞋包','食品饮料','家居百货']},
      color:colors,
      xAxis:{type:'category',data:months},
      yAxis:{type:'value',name:'销量（件）'},
      series:[
        {name:'手机数码',type:'bar',data:[1850,1560,2100,1920,2380,2760],barMaxWidth:30},
        {name:'服装鞋包',type:'bar',data:[2300,1980,2650,2420,3100,2890],barMaxWidth:30},
        {name:'食品饮料',type:'bar',data:[980,1250,1100,1350,1480,1620],barMaxWidth:30},
        {name:'家居百货',type:'bar',data:[1120,890,1380,1560,1720,1890],barMaxWidth:30}
      ],
      grid:{left:'3%',right:'4%',bottom:'15%',containLabel:true}
    },
    category: {
      title:{text:'6月各品类销量排比',left:'center',textStyle:{color:'#3E1F00',fontSize:14}},
      tooltip:{trigger:'axis'},color:[colors[1]],
      xAxis:{type:'category',data:['服装鞋包','手机数码','家居百货','食品饮料']},
      yAxis:{type:'value',name:'6月销量（件）'},
      series:[{type:'bar',data:[2890,2760,1890,1620],barMaxWidth:60,itemStyle:{borderRadius:[6,6,0,0]},label:{show:true,position:'top',color:'#666'}}],
      grid:{left:'3%',right:'4%',bottom:'8%',containLabel:true}
    },
    grouped: {
      title:{text:'1月 vs 6月 各品类销量对比',left:'center',textStyle:{color:'#3E1F00',fontSize:14}},
      tooltip:{trigger:'axis',axisPointer:{type:'shadow'}},
      legend:{bottom:0,data:['1月','6月']},color:['#C17F3A','#4A90D9'],
      xAxis:{type:'category',data:['手机数码','服装鞋包','食品饮料','家居百货']},
      yAxis:{type:'value',name:'销量（件）'},
      series:[
        {name:'1月',type:'bar',data:[1850,2300,980,1120],barMaxWidth:40},
        {name:'6月',type:'bar',data:[2760,2890,1620,1890],barMaxWidth:40}
      ],
      grid:{left:'3%',right:'4%',bottom:'12%',containLabel:true}
    },
    stacked: {
      title:{text:'各月总销量构成（堆叠）',left:'center',textStyle:{color:'#3E1F00',fontSize:14}},
      tooltip:{trigger:'axis',axisPointer:{type:'shadow'}},
      legend:{bottom:0,data:['手机数码','服装鞋包','食品饮料','家居百货']},
      color:colors,
      xAxis:{type:'category',data:months},
      yAxis:{type:'value',name:'总销量（件）'},
      series:[
        {name:'手机数码',type:'bar',stack:'total',data:[1850,1560,2100,1920,2380,2760]},
        {name:'服装鞋包',type:'bar',stack:'total',data:[2300,1980,2650,2420,3100,2890]},
        {name:'食品饮料',type:'bar',stack:'total',data:[980,1250,1100,1350,1480,1620]},
        {name:'家居百货',type:'bar',stack:'total',data:[1120,890,1380,1560,1720,1890]}
      ],
      grid:{left:'3%',right:'4%',bottom:'15%',containLabel:true}
    }
  };
  c.setOption(optionMap[mode], true);
}

// ========================================
// 折线图
// ========================================
function updateLineChart(mode, btn) {
  updateChartBtns('line', btn);
  const c = chartInstances.line;
  if (!c) return;
  const months = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
  const visitors = [12.5,10.8,15.2,14.6,18.3,16.9,19.5,21.2,20.8,28.6,45.8,25.3];
  const orders = [3200,2850,4100,3980,5200,4750,5680,6300,6150,9200,16500,8100];
  const optionMap = {
    trend: {
      title:{text:'某电商店铺年度访客量趋势',left:'center',textStyle:{color:'#3E1F00',fontSize:14}},
      tooltip:{trigger:'axis'},color:['#C17F3A'],
      xAxis:{type:'category',data:months,boundaryGap:false},
      yAxis:{type:'value',name:'访客量（万人次）'},
      series:[{name:'访客量',type:'line',data:visitors,symbol:'circle',symbolSize:6,
        markPoint:{data:[{type:'max',name:'最大值'},{type:'min',name:'最小值'}]},
        areaStyle:{color:'rgba(193,127,58,0.1)'}}],
      grid:{left:'3%',right:'4%',bottom:'8%',containLabel:true}
    },
    compare: {
      title:{text:'访客量 vs 成交量 双轴对比',left:'center',textStyle:{color:'#3E1F00',fontSize:14}},
      tooltip:{trigger:'axis'},
      legend:{bottom:0,data:['访客量','成交量']},color:['#C17F3A','#4A90D9'],
      xAxis:{type:'category',data:months,boundaryGap:false},
      yAxis:[{type:'value',name:'访客量（万）'},{type:'value',name:'成交量（件）'}],
      series:[
        {name:'访客量',type:'line',data:visitors,smooth:true,yAxisIndex:0},
        {name:'成交量',type:'line',data:orders,smooth:true,yAxisIndex:1}
      ],
      grid:{left:'3%',right:'8%',bottom:'12%',containLabel:true}
    },
    smooth: {
      title:{text:'年度访客量平滑趋势曲线',left:'center',textStyle:{color:'#3E1F00',fontSize:14}},
      tooltip:{trigger:'axis'},color:['#E84545'],
      xAxis:{type:'category',data:months,boundaryGap:false},
      yAxis:{type:'value',name:'访客量（万人次）'},
      series:[{name:'访客量',type:'line',data:visoters,smooth:true,lineStyle:{width:3},
        areaStyle:{color:{type:'linear',x:0,y:0,x2:0,y2:1,colorStops:[{offset:0,color:'rgba(232,69,69,0.3)'},{offset:1,color:'rgba(232,69,69,0)'}]}}}],
      grid:{left:'3%',right:'4%',bottom:'8%',containLabel:true}
    }
  };
  if (mode === 'smooth') {
    optionMap.smooth.series[0].data = visitors;
  }
  c.setOption(optionMap[mode], true);
}

// ========================================
// 饼图
// ========================================
function updatePieChart(mode, btn) {
  updateChartBtns('pie', btn);
  const c = chartInstances.pie;
  if (!c) return;
  const baseData = [{value:285,name:'手机数码'},{value:198,name:'服装鞋包'},{value:142,name:'食品饮料'},{value:89,name:'家居百货'},{value:36,name:'其他'}];
  const optionMap = {
    basic: {
      title:{text:'各品类销售额占比',left:'center',textStyle:{color:'#3E1F00',fontSize:14}},
      tooltip:{trigger:'item',formatter:'{b}: {c}万元 ({d}%)'},
      color:['#C17F3A','#E84545','#4CAF82','#4A90D9','#F5C842'],
      legend:{bottom:0},series:[{type:'pie',radius:'60%',center:['50%','48%'],data:baseData,label:{formatter:'{b}\n{d}%'}}]
    },
    doughnut: {
      title:{text:'圆环图',left:'center',textStyle:{color:'#3E1F00',fontSize:14}},
      tooltip:{trigger:'item',formatter:'{b}: {c}万元 ({d}%)'},
      color:['#C17F3A','#E84545','#4CAF82','#4A90D9','#F5C842'],
      legend:{bottom:0},series:[{type:'pie',radius:['40%','65%'],center:['50%','48%'],data:baseData}]
    },
    compound: {
      title:{text:'品类销售额（含手机数码子类）',left:'center',textStyle:{color:'#3E1F00',fontSize:14}},
      tooltip:{trigger:'item',formatter:'{b}: {c}万元 ({d}%)'},
      color:['#E84545','#4CAF82','#4A90D9','#F5C842','#C17F3A','#E8A87C','#FFCC88'],
      series:[
        {name:'主分类',type:'pie',radius:[0,'40%'],center:['30%','50%'],
          data:[{value:198,name:'服装鞋包'},{value:142,name:'食品饮料'},{value:89,name:'家居百货'},{value:36,name:'其他'},{value:285,name:'手机数码'}],
          label:{position:'inner',fontSize:11}},
        {name:'手机数码子类',type:'pie',radius:['50%','70%'],center:['70%','50%'],
          data:[{value:158,name:'智能手机'},{value:72,name:'电脑平板'},{value:55,name:'数码配件'}],
          label:{formatter:'{b}\n{d}%'}}
      ]
    },
    rose: {
      title:{text:'玫瑰图',left:'center',textStyle:{color:'#3E1F00',fontSize:14}},
      tooltip:{trigger:'item',formatter:'{b}: {c}万元 ({d}%)'},
      color:['#C17F3A','#E84545','#4CAF82','#4A90D9','#F5C842'],
      legend:{bottom:0},series:[{type:'pie',radius:['20%','65%'],center:['50%','48%'],roseType:'area',data:baseData}]
    }
  };
  c.setOption(optionMap[mode], true);
}

// ========================================
// 条形图
// ========================================
function updateHbarChart(mode, btn) {
  updateChartBtns('hbar', btn);
  const c = chartInstances.hbar;
  if (!c) return;
  const colors = ['#C17F3A','#E84545','#4CAF82','#4A90D9','#F5C842','#9B59B6','#E67E22','#1ABC9C'];
  const optionMap = {
    rank: {
      title:{text:'热销商品月度销量排行TOP8',left:'center',textStyle:{color:'#3E1F00',fontSize:14}},
      tooltip:{trigger:'axis',axisPointer:{type:'shadow'}},
      grid:{left:'22%',right:'8%',top:'10%',bottom:'8%'},
      xAxis:{type:'value',name:'月销量（件）'},
      yAxis:{type:'category',data:['美妆护肤套装','儿童积木玩具','便携充电宝','办公室香薰机','智能手环','网红零食礼包','运动休闲短袖','无线蓝牙耳机']},
      series:[{type:'bar',data:[3250,3860,4320,4980,5640,6890,7320,8650].map((v,i)=>({value:v,itemStyle:{color:colors[i]}})),label:{show:true,position:'right',formatter:'{c}件'},barMaxWidth:28}]
    },
    region: {
      title:{text:'各省份月度订单量分布',left:'center',textStyle:{color:'#3E1F00',fontSize:14}},
      tooltip:{trigger:'axis'},grid:{left:'12%',right:'8%',top:'10%',bottom:'8%'},
      xAxis:{type:'value',name:'订单量（单）'},
      yAxis:{type:'category',data:['福建','湖北','四川','河南','山东','北京','上海','江苏','浙江','广东']},
      series:[{type:'bar',data:[6200,6900,7600,8700,9800,10900,11600,12800,14200,18500],barMaxWidth:28,
        itemStyle:{color:{type:'linear',x:0,y:0,x2:1,y2:0,colorStops:[{offset:0,color:'#4A90D9'},{offset:1,color:'#C17F3A'}]}},
        label:{show:true,position:'right',formatter:'{c}单'}}]
    },
    bidirect: {
      title:{text:'买家评价正负反馈对比',left:'center',textStyle:{color:'#3E1F00',fontSize:14}},
      tooltip:{trigger:'axis',formatter:p=>{let s=p[0].axisValue+'<br/>';p.forEach(x=>{s+=x.marker+x.seriesName+': '+Math.abs(x.value)+'条<br/>';});return s;}},
      grid:{left:'15%',right:'8%',top:'15%',bottom:'8%'},legend:{top:30,data:['好评','差评']},
      xAxis:{type:'value',axisLabel:{formatter:v=>Math.abs(v)}},
      yAxis:{type:'category',data:['商品质量','发货速度','客服态度','商品描述','包装完整']},
      series:[
        {name:'好评',type:'bar',stack:'total',data:[856,742,698,623,589],itemStyle:{color:'#4CAF82'}},
        {name:'差评',type:'bar',stack:'total',data:[-124,-198,-156,-231,-189],itemStyle:{color:'#E84545'}}
      ]
    },
    stacked: {
      title:{text:'各品类季度销量构成',left:'center',textStyle:{color:'#3E1F00',fontSize:14}},
      tooltip:{trigger:'axis'},legend:{top:30,data:['手机数码','服装鞋包','食品饮料','家居百货']},
      grid:{left:'12%',right:'8%',top:'20%',bottom:'8%'},
      xAxis:{type:'value',name:'销量（件）'},yAxis:{type:'category',data:['Q1','Q2','Q3','Q4']},
      series:[
        {name:'手机数码',type:'bar',stack:'total',data:[5510,6220,7460,8340],itemStyle:{color:'#C17F3A'}},
        {name:'服装鞋包',type:'bar',stack:'total',data:[6580,8120,9230,7650],itemStyle:{color:'#E84545'}},
        {name:'食品饮料',type:'bar',stack:'total',data:[3330,4150,4980,5620],itemStyle:{color:'#4CAF82'}},
        {name:'家居百货',type:'bar',stack:'total',data:[2870,3460,4120,5280],itemStyle:{color:'#4A90D9'}}
      ]
    }
  };
  c.setOption(optionMap[mode], true);
}

// ========================================
// 散点图
// ========================================
function updateScatterChart(mode, btn) {
  updateChartBtns('scatter', btn);
  const c = chartInstances.scatter;
  if (!c) return;
  const optionMap = {
    adSales: {
      title:{text:'广告投入与销售额相关性分析',left:'center',textStyle:{color:'#3E1F00',fontSize:14}},
      tooltip:{formatter:p=>'广告费：'+p.data[0]+'万元<br>销售额：'+p.data[1]+'万元'},
      xAxis:{type:'value',name:'月广告费（万元）',min:0,max:5},
      yAxis:{type:'value',name:'月销售额（万元）',min:0},
      series:[{type:'scatter',data:[[0.5,8.2],[1.2,15.6],[2.0,28.4],[0.8,12.1],[3.5,52.8],[1.8,24.3],[0.3,4.8],[4.2,63.5],[2.6,38.9],[1.5,21.7]],symbolSize:14,itemStyle:{color:'#C17F3A',borderColor:'#fff',borderWidth:2}}],
      graphic:[{type:'text',left:'15%',top:'25%',style:{text:'正相关 ↗',fill:'#E84545',fontSize:13,fontWeight:'bold'}}],
      grid:{left:'8%',right:'5%',bottom:'12%',containLabel:true}
    },
    priceQty: {
      title:{text:'商品均价与月销量关系',left:'center',textStyle:{color:'#3E1F00',fontSize:14}},
      tooltip:{formatter:p=>'均价：'+p.data[0]+'元<br>销量：'+p.data[1]+'件'},
      xAxis:{type:'value',name:'商品均价（元）'},yAxis:{type:'value',name:'月销量（件）'},
      series:[{type:'scatter',data:[[35,12400],[45,8920],[88,6850],[89,5640],[128,2380],[156,4280],[198,3150],[256,1820],[368,980],[520,620]],symbolSize:14,itemStyle:{color:'#4A90D9',borderColor:'#fff',borderWidth:2}}],
      graphic:[{type:'text',left:'55%',top:'20%',style:{text:'负相关 ↘',fill:'#4A90D9',fontSize:13,fontWeight:'bold'}}],
      grid:{left:'8%',right:'5%',bottom:'12%',containLabel:true}
    },
    scoreBuy: {
      title:{text:'商品评分与复购率关系',left:'center',textStyle:{color:'#3E1F00',fontSize:14}},
      tooltip:{formatter:p=>'评分：'+p.data[0]+'分<br>复购率：'+p.data[1]+'%'},
      xAxis:{type:'value',name:'商品评分（分）',min:3,max:5.2},
      yAxis:{type:'value',name:'复购率（%）',min:0,max:100},
      series:[{type:'scatter',data:[[3.2,18],[3.5,22],[3.8,28],[4.0,35],[4.1,38],[4.3,45],[4.5,52],[4.6,58],[4.7,61],[4.8,68],[4.9,75],[5.0,82]],symbolSize:12,itemStyle:{color:'#4CAF82',borderColor:'#fff',borderWidth:2}}],
      grid:{left:'8%',right:'5%',bottom:'12%',containLabel:true}
    }
  };
  c.setOption(optionMap[mode], true);
}

// ========================================
// 雷达图
// ========================================
function updateRadarChart(mode, btn) {
  updateChartBtns('radar', btn);
  const c = chartInstances.radar;
  if (!c) return;
  const optionMap = {
    shop: {
      title:{text:'三家店铺综合运营能力对比',left:'center',textStyle:{color:'#3E1F00',fontSize:14}},
      legend:{bottom:0,data:['A店铺','B店铺','C店铺']},
      radar:{indicator:[{name:'商品质量',max:100},{name:'客服响应',max:100},{name:'物流速度',max:100},{name:'价格竞争力',max:100},{name:'店铺设计',max:100},{name:'售后服务',max:100}],radius:'60%',center:['50%','52%'],
        splitArea:{areaStyle:{color:['rgba(245,230,200,0.3)','rgba(193,127,58,0.1)','rgba(245,230,200,0.3)','rgba(193,127,58,0.1)']}}},
      series:[{type:'radar',data:[
        {value:[88,95,82,76,91,87],name:'A店铺',areaStyle:{color:'rgba(193,127,58,0.3)'},lineStyle:{color:'#C17F3A'},itemStyle:{color:'#C17F3A'}},
        {value:[92,78,85,94,72,80],name:'B店铺',areaStyle:{color:'rgba(74,144,217,0.3)'},lineStyle:{color:'#4A90D9'},itemStyle:{color:'#4A90D9'}},
        {value:[76,89,91,88,85,93],name:'C店铺',areaStyle:{color:'rgba(76,175,130,0.3)'},lineStyle:{color:'#4CAF82'},itemStyle:{color:'#4CAF82'}}
      ]}]
    },
    product: {
      title:{text:'竞品多维度对比分析',left:'center',textStyle:{color:'#3E1F00',fontSize:14}},
      legend:{bottom:0,data:['我方产品','竞品A','竞品B']},
      radar:{indicator:[{name:'功能完整性',max:100},{name:'用户体验',max:100},{name:'价格优势',max:100},{name:'售后保障',max:100},{name:'品牌知名度',max:100}],radius:'60%',center:['50%','52%']},
      series:[{type:'radar',data:[
        {value:[85,90,70,88,75],name:'我方产品',areaStyle:{color:'rgba(232,69,69,0.3)'},lineStyle:{color:'#E84545'},itemStyle:{color:'#E84545'}},
        {value:[78,82,88,75,90],name:'竞品A',areaStyle:{color:'rgba(74,144,217,0.3)'},lineStyle:{color:'#4A90D9'},itemStyle:{color:'#4A90D9'}},
        {value:[92,75,65,92,85],name:'竞品B',areaStyle:{color:'rgba(245,200,66,0.3)'},lineStyle:{color:'#F5C842'},itemStyle:{color:'#F5C842'}}
      ]}]
    },
    staff: {
      title:{text:'客服团队能力评估',left:'center',textStyle:{color:'#3E1F00',fontSize:14}},
      legend:{bottom:0,data:['小王','小李','小张']},
      radar:{indicator:[{name:'响应速度',max:100},{name:'问题解决率',max:100},{name:'客户满意度',max:100},{name:'产品知识',max:100},{name:'沟通能力',max:100},{name:'投诉处理',max:100}],radius:'60%',center:['50%','52%']},
      series:[{type:'radar',data:[
        {value:[95,88,92,78,85,90],name:'小王',areaStyle:{color:'rgba(193,127,58,0.3)'},lineStyle:{color:'#C17F3A'},itemStyle:{color:'#C17F3A'}},
        {value:[82,92,85,95,78,88],name:'小李',areaStyle:{color:'rgba(76,175,130,0.3)'},lineStyle:{color:'#4CAF82'},itemStyle:{color:'#4CAF82'}},
        {value:[78,85,90,88,95,82],name:'小张',areaStyle:{color:'rgba(155,89,182,0.3)'},lineStyle:{color:'#9B59B6'},itemStyle:{color:'#9B59B6'}}
      ]}]
    }
  };
  c.setOption(optionMap[mode], true);
}

// ========================================
// 气泡图
// ========================================
function updateBubbleChart(mode, btn) {
  updateChartBtns('bubble', btn);
  const c = chartInstances.bubble;
  if (!c) return;
  const optionMap = {
    market: {
      title:{text:'电商品类综合分析（气泡大小=在售商品数）',left:'center',textStyle:{color:'#3E1F00',fontSize:13}},
      tooltip:{formatter:p=>{const cats=['手机数码','服装鞋包','食品饮料','家居百货','美妆护肤','母婴玩具','运动户外'];return '<b>'+cats[p.dataIndex]+'</b><br>月销量：'+p.data[0]+'件<br>利润率：'+p.data[1]+'%<br>在售商品：'+p.data[2]+'个';}},
      xAxis:{type:'value',name:'月销量（件）',min:0,splitLine:{lineStyle:{type:'dashed',color:'#ddd'}}},
      yAxis:{type:'value',name:'利润率（%）',min:0,max:70,splitLine:{lineStyle:{type:'dashed',color:'#ddd'}}},
      series:[{type:'scatter',data:[
        {value:[5680,18.5,320],symbolSize:Math.sqrt(320)*1.8,itemStyle:{color:'#C17F3A',opacity:0.8,borderColor:'#fff',borderWidth:2}},
        {value:[8920,42.3,1560],symbolSize:Math.sqrt(1560)*1.8,itemStyle:{color:'#E84545',opacity:0.8,borderColor:'#fff',borderWidth:2}},
        {value:[12400,28.6,890],symbolSize:Math.sqrt(890)*1.8,itemStyle:{color:'#4CAF82',opacity:0.8,borderColor:'#fff',borderWidth:2}},
        {value:[3250,35.8,680],symbolSize:Math.sqrt(680)*1.8,itemStyle:{color:'#4A90D9',opacity:0.8,borderColor:'#fff',borderWidth:2}},
        {value:[6890,55.2,420],symbolSize:Math.sqrt(420)*1.8,itemStyle:{color:'#F5C842',opacity:0.8,borderColor:'#fff',borderWidth:2}},
        {value:[2180,38.4,290],symbolSize:Math.sqrt(290)*1.8,itemStyle:{color:'#9B59B6',opacity:0.8,borderColor:'#fff',borderWidth:2}},
        {value:[4320,31.2,510],symbolSize:Math.sqrt(510)*1.8,itemStyle:{color:'#E67E22',opacity:0.8,borderColor:'#fff',borderWidth:2}}
      ],label:{show:true,formatter:p=>['手机数码','服装鞋包','食品饮料','家居百货','美妆护肤','母婴玩具','运动户外'][p.dataIndex],position:'top',fontSize:11,color:'#333'}}],
      grid:{left:'8%',right:'5%',bottom:'10%',top:'15%',containLabel:true}
    },
    customer: {
      title:{text:'客户价值分层（气泡大小=客户数量）',left:'center',textStyle:{color:'#3E1F00',fontSize:13}},
      tooltip:{formatter:p=>{const n=['高价值','成长型','潜力型','流失风险','普通'];return '<b>'+n[p.dataIndex]+'</b><br>频次：'+p.data[0]+'次/年<br>客单价：'+p.data[1]+'元';}},
      xAxis:{type:'value',name:'年均消费频次（次）',min:0},yAxis:{type:'value',name:'客单价（元）',min:0},
      series:[{type:'scatter',data:[
        {value:[88,92,580],symbolSize:Math.sqrt(580)*2.2,itemStyle:{color:'#E84545',opacity:0.8,borderColor:'#fff',borderWidth:2}},
        {value:[65,75,320],symbolSize:Math.sqrt(320)*2.2,itemStyle:{color:'#C17F3A',opacity:0.8,borderColor:'#fff',borderWidth:2}},
        {value:[45,60,250],symbolSize:Math.sqrt(250)*2.2,itemStyle:{color:'#F5C842',opacity:0.8,borderColor:'#fff',borderWidth:2}},
        {value:[25,40,180],symbolSize:Math.sqrt(180)*2.2,itemStyle:{color:'#4A90D9',opacity:0.8,borderColor:'#fff',borderWidth:2}},
        {value:[50,35,420],symbolSize:Math.sqrt(420)*2.2,itemStyle:{color:'#4CAF82',opacity:0.8,borderColor:'#fff',borderWidth:2}}
      ],label:{show:true,formatter:p=>['高价值','成长型','潜力型','流失风险','普通'][p.dataIndex],position:'top',fontSize:11,color:'#333'}}],
      grid:{left:'8%',right:'5%',bottom:'10%',top:'15%',containLabel:true}
    },
    product: {
      title:{text:'商品ROI分析（气泡大小=月销量）',left:'center',textStyle:{color:'#3E1F00',fontSize:13}},
      tooltip:{formatter:p=>{const n=['A商品','B商品','C商品','D商品','E商品','F商品'];return '<b>'+n[p.dataIndex]+'</b><br>广告费率：'+p.data[0]+'%<br>ROI：'+p.data[1];}},
      xAxis:{type:'value',name:'广告费率（%）',min:0},yAxis:{type:'value',name:'ROI',min:0},
      series:[{type:'scatter',data:[
        {value:[45,3.2,8650],symbolSize:Math.sqrt(8650)*0.9,itemStyle:{color:'#E84545',opacity:0.85,borderColor:'#fff',borderWidth:2}},
        {value:[28,5.8,3200],symbolSize:Math.sqrt(3200)*0.9,itemStyle:{color:'#C17F3A',opacity:0.85,borderColor:'#fff',borderWidth:2}},
        {value:[62,2.1,12400],symbolSize:Math.sqrt(12400)*0.9,itemStyle:{color:'#4CAF82',opacity:0.85,borderColor:'#fff',borderWidth:2}},
        {value:[35,4.5,5680],symbolSize:Math.sqrt(5680)*0.9,itemStyle:{color:'#4A90D9',opacity:0.85,borderColor:'#fff',borderWidth:2}},
        {value:[18,8.2,1200],symbolSize:Math.sqrt(1200)*0.9,itemStyle:{color:'#F5C842',opacity:0.85,borderColor:'#fff',borderWidth:2}},
        {value:[52,1.8,9800],symbolSize:Math.sqrt(9800)*0.9,itemStyle:{color:'#9B59B6',opacity:0.85,borderColor:'#fff',borderWidth:2}}
      ],label:{show:true,formatter:p=>['A商品','B商品','C商品','D商品','E商品','F商品'][p.dataIndex],position:'top',fontSize:11,color:'#333'}}],
      grid:{left:'8%',right:'5%',bottom:'10%',top:'15%',containLabel:true}
    }
  };
  c.setOption(optionMap[mode], true);
}

// ========================================
// 图表 resize
// ========================================
window.addEventListener('resize', () => {
  Object.values(chartInstances).forEach(c => c && c.resize());
});
