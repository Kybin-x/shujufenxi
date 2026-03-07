/**
 * 生意参谋模拟数据生成器
 * 为教学演示提供真实感的模拟数据
 */

const MockData = (() => {
    // ===== 工具函数 =====
    const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const randFloat = (min, max, dec = 2) => +(Math.random() * (max - min) + min).toFixed(dec);
    const pick = (arr) => arr[rand(0, arr.length - 1)];
    const formatNum = (n) => n.toLocaleString('zh-CN');
    const formatMoney = (n) => '¥' + n.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const formatPct = (n) => n.toFixed(2) + '%';

    // ===== 基础数据 =====
    const categories = ['女装', '男装', '美妆护肤', '数码配件', '家居日用', '零食食品', '母婴用品', '运动户外'];

    const products = [
        { id: 'P001', name: '轻薄透气防晒衣 UPF50+', category: '女装', price: 89.00, img: '🧥' },
        { id: 'P002', name: '纯棉宽松短袖T恤 男', category: '男装', price: 59.00, img: '👕' },
        { id: 'P003', name: '玻尿酸补水面膜 30片装', category: '美妆护肤', price: 69.90, img: '🧴' },
        { id: 'P004', name: '无线蓝牙耳机 降噪版', category: '数码配件', price: 129.00, img: '🎧' },
        { id: 'P005', name: '北欧风陶瓷马克杯', category: '家居日用', price: 29.90, img: '☕' },
        { id: 'P006', name: '坚果混合大礼包 1000g', category: '零食食品', price: 49.90, img: '🥜' },
        { id: 'P007', name: '婴儿纯棉连体衣 春秋款', category: '母婴用品', price: 45.00, img: '👶' },
        { id: 'P008', name: '瑜伽裤高腰弹力紧身裤', category: '运动户外', price: 79.00, img: '🧘' },
        { id: 'P009', name: '真皮小白鞋 百搭休闲', category: '女装', price: 199.00, img: '👟' },
        { id: 'P010', name: '夏季冰丝凉席三件套', category: '家居日用', price: 158.00, img: '🛏️' },
        { id: 'P011', name: '防蓝光电脑护目镜', category: '数码配件', price: 39.90, img: '👓' },
        { id: 'P012', name: '氨基酸洁面慕斯 200ml', category: '美妆护肤', price: 55.00, img: '🧼' },
        { id: 'P013', name: '儿童积木拼装玩具200粒', category: '母婴用品', price: 68.00, img: '🧱' },
        { id: 'P014', name: '速干运动短裤 男款', category: '运动户外', price: 49.00, img: '🩳' },
        { id: 'P015', name: '手工牛轧糖礼盒 500g', category: '零食食品', price: 38.80, img: '🍬' },
    ];

    const trafficSources = [
        { name: '手淘搜索', pct: 35 },
        { name: '直通车', pct: 18 },
        { name: '手淘推荐', pct: 15 },
        { name: '淘宝客', pct: 10 },
        { name: '购物车', pct: 8 },
        { name: '我的淘宝', pct: 6 },
        { name: '活动会场', pct: 4 },
        { name: '其他', pct: 4 },
    ];

    const keywords = [
        { word: '防晒衣', searches: rand(50000, 90000), clicks: rand(15000, 35000), competition: randFloat(30, 95) },
        { word: '面膜补水', searches: rand(40000, 80000), clicks: rand(12000, 30000), competition: randFloat(40, 90) },
        { word: '蓝牙耳机', searches: rand(60000, 120000), clicks: rand(20000, 45000), competition: randFloat(50, 98) },
        { word: '短袖t恤 男', searches: rand(35000, 70000), clicks: rand(10000, 25000), competition: randFloat(35, 85) },
        { word: '马克杯', searches: rand(20000, 50000), clicks: rand(6000, 15000), competition: randFloat(20, 70) },
        { word: '坚果零食', searches: rand(30000, 60000), clicks: rand(9000, 20000), competition: randFloat(25, 75) },
        { word: '瑜伽裤', searches: rand(25000, 55000), clicks: rand(8000, 18000), competition: randFloat(30, 80) },
        { word: '小白鞋', searches: rand(45000, 90000), clicks: rand(15000, 35000), competition: randFloat(45, 95) },
        { word: '凉席', searches: rand(15000, 40000), clicks: rand(5000, 12000), competition: randFloat(15, 60) },
        { word: '婴儿连体衣', searches: rand(10000, 30000), clicks: rand(3000, 10000), competition: randFloat(15, 55) },
        { word: '护目镜 防蓝光', searches: rand(8000, 25000), clicks: rand(2000, 8000), competition: randFloat(10, 50) },
        { word: '洁面慕斯', searches: rand(12000, 35000), clicks: rand(4000, 12000), competition: randFloat(20, 65) },
    ];

    const provinces = [
        '广东', '浙江', '江苏', '上海', '北京', '山东', '四川', '福建',
        '河南', '湖北', '湖南', '安徽', '河北', '辽宁', '陕西'
    ];

    // ===== 日期生成 =====
    function getDates(days = 30) {
        const dates = [];
        const now = new Date();
        for (let i = days - 1; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            dates.push(d.toISOString().split('T')[0]);
        }
        return dates;
    }

    function getDateLabels(days = 30) {
        return getDates(days).map(d => {
            const parts = d.split('-');
            return `${parts[1]}-${parts[2]}`;
        });
    }

    // ===== 趋势数据生成 =====
    function generateTrend(baseValue, days = 30, volatility = 0.15) {
        const data = [];
        let current = baseValue;
        for (let i = 0; i < days; i++) {
            const dayOfWeek = new Date(getDates(days)[i]).getDay();
            let modifier = 1;
            if (dayOfWeek === 0 || dayOfWeek === 6) modifier = 1.15;
            if (dayOfWeek === 1) modifier = 0.85;

            current = current * (1 + (Math.random() - 0.48) * volatility) * modifier;
            current = Math.max(current, baseValue * 0.3);
            data.push(Math.round(current));
        }
        return data;
    }

    function generateMoneyTrend(baseValue, days = 30) {
        return generateTrend(baseValue, days, 0.2).map(v => +(v + Math.random() * 100).toFixed(2));
    }

    // ===== 首页概览数据 =====
    function getDashboardData() {
        const visitors = rand(3000, 8000);
        const pageviews = Math.round(visitors * randFloat(2.5, 4.0));
        const payAmount = randFloat(15000, 65000);
        const payBuyers = Math.round(visitors * randFloat(0.02, 0.06));
        const payOrders = Math.round(payBuyers * randFloat(1.0, 1.3));
        const avgPrice = +(payAmount / payBuyers).toFixed(2);
        const convRate = +((payBuyers / visitors) * 100).toFixed(2);
        const collectAdd = Math.round(visitors * randFloat(0.05, 0.12));
        const refundAmount = +(payAmount * randFloat(0.02, 0.08)).toFixed(2);

        return {
            visitors: { value: visitors, change: randFloat(-15, 25), label: '访客数' },
            pageviews: { value: pageviews, change: randFloat(-12, 20), label: '浏览量' },
            payAmount: { value: payAmount, change: randFloat(-20, 30), label: '支付金额' },
            payBuyers: { value: payBuyers, change: randFloat(-18, 28), label: '支付买家数' },
            payOrders: { value: payOrders, change: randFloat(-15, 25), label: '支付订单数' },
            convRate: { value: convRate, change: randFloat(-2, 3), label: '支付转化率' },
            avgPrice: { value: avgPrice, change: randFloat(-10, 15), label: '客单价' },
            collectAdd: { value: collectAdd, change: randFloat(-10, 20), label: '收藏加购' },
            refundAmount: { value: refundAmount, change: randFloat(-25, 15), label: '退款金额' },
        };
    }

    // ===== 实时数据 =====
    function getRealtimeData() {
        const hour = new Date().getHours();
        const factor = hour < 6 ? 0.2 : hour < 9 ? 0.5 : hour < 12 ? 0.9 :
            hour < 14 ? 0.7 : hour < 18 ? 1.0 : hour < 21 ? 1.2 : 0.8;

        return {
            todayVisitors: Math.round(rand(800, 3000) * factor),
            todayPageviews: Math.round(rand(2000, 8000) * factor),
            todayPayAmount: +(randFloat(3000, 20000) * factor).toFixed(2),
            todayPayOrders: Math.round(rand(20, 150) * factor),
            todayAvgStay: randFloat(60, 180, 0) + '秒',
            onlineVisitors: rand(20, 200),
        };
    }

    // ===== 流量分析数据 =====
    function getTrafficData(days = 30) {
        return {
            dates: getDateLabels(days),
            visitors: generateTrend(5000, days),
            pageviews: generateTrend(15000, days),
            bounceRate: generateTrend(45, days, 0.08).map(v => Math.min(v, 80)),
            avgStayTime: generateTrend(120, days, 0.1),
            sources: trafficSources.map(s => ({
                ...s,
                visitors: Math.round(rand(500, 3000) * s.pct / 35),
                change: randFloat(-15, 20),
            })),
            devices: { pc: rand(20, 35), mobile: rand(55, 72), other: rand(3, 10) },
            hourly: Array.from({ length: 24 }, (_, i) => {
                const factor = i < 6 ? 0.1 : i < 9 ? 0.4 : i < 12 ? 0.8 :
                    i < 14 ? 0.6 : i < 18 ? 0.9 : i < 22 ? 1.0 : 0.3;
                return Math.round(rand(100, 400) * factor);
            }),
        };
    }

    // ===== 商品分析数据 =====
    function getProductData() {
        return products.map(p => ({
            ...p,
            visitors: rand(200, 3000),
            pageviews: rand(400, 8000),
            payAmount: randFloat(500, 25000),
            payQty: rand(5, 300),
            payBuyers: rand(5, 250),
            convRate: randFloat(1, 8),
            collectRate: randFloat(2, 15),
            cartRate: randFloat(3, 18),
            avgStay: rand(30, 200),
            refundRate: randFloat(0.5, 8),
        })).sort((a, b) => b.payAmount - a.payAmount);
    }

    // ===== 交易分析数据 =====
    function getTransactionData(days = 30) {
        const payAmountTrend = generateMoneyTrend(30000, days);
        const orderTrend = generateTrend(100, days, 0.15);

        return {
            dates: getDateLabels(days),
            payAmountTrend,
            orderTrend,
            refundTrend: payAmountTrend.map(v => +(v * randFloat(0.02, 0.06)).toFixed(2)),
            orderStatusDist: {
                paid: rand(60, 75),
                shipped: rand(10, 20),
                completed: rand(5, 15),
                refunding: rand(2, 8),
            },
            payMethodDist: {
                '支付宝': rand(55, 70),
                '微信支付': rand(15, 25),
                '花呗': rand(8, 15),
                '信用卡': rand(3, 8),
                '其他': rand(1, 5),
            },
            summary: {
                totalAmount: randFloat(600000, 1500000),
                totalOrders: rand(5000, 15000),
                avgOrderAmount: randFloat(60, 150),
                maxDayAmount: randFloat(50000, 120000),
                minDayAmount: randFloat(5000, 15000),
                refundRate: randFloat(2, 6),
            },
        };
    }

    // ===== 市场行情数据 =====
    function getMarketData() {
        return {
            industryTrend: {
                dates: getDateLabels(30),
                searchIndex: generateTrend(100000, 30),
                transactionIndex: generateTrend(50000, 30),
                clickIndex: generateTrend(75000, 30),
            },
            categoryRanking: categories.map(c => ({
                name: c,
                searchVolume: rand(100000, 500000),
                transactionVolume: rand(50000, 250000),
                avgPrice: randFloat(30, 200),
                growth: randFloat(-10, 35),
                shops: rand(1000, 50000),
            })).sort((a, b) => b.searchVolume - a.searchVolume),
            priceRange: [
                { range: '0-50元', pct: rand(15, 30) },
                { range: '50-100元', pct: rand(20, 35) },
                { range: '100-200元', pct: rand(15, 25) },
                { range: '200-500元', pct: rand(8, 18) },
                { range: '500元以上', pct: rand(3, 10) },
            ],
        };
    }

    // ===== 客户分析数据 =====
    function getCustomerData() {
        return {
            genderDist: { male: rand(30, 45), female: rand(45, 65), unknown: rand(3, 10) },
            ageDist: [
                { range: '18岁以下', pct: rand(3, 8) },
                { range: '18-24岁', pct: rand(20, 30) },
                { range: '25-29岁', pct: rand(22, 32) },
                { range: '30-34岁', pct: rand(15, 22) },
                { range: '35-39岁', pct: rand(8, 15) },
                { range: '40岁以上', pct: rand(5, 12) },
            ],
            regionDist: provinces.map(p => ({
                name: p,
                buyers: rand(50, 800),
                amount: randFloat(2000, 50000),
                pct: randFloat(2, 15),
            })).sort((a, b) => b.buyers - a.buyers),
            newVsOld: { newBuyers: rand(60, 80), oldBuyers: rand(20, 40) },
            repurchaseRate: randFloat(8, 25),
            avgConsumption: {
                '1次': rand(50, 70),
                '2次': rand(15, 25),
                '3次': rand(5, 12),
                '4次以上': rand(3, 8),
            },
        };
    }

    // ===== 搜索词数据 =====
    function getKeywordData() {
        return {
            topKeywords: keywords.map(k => ({
                ...k,
                convRate: randFloat(1, 6),
                avgPrice: randFloat(20, 200),
                onlineProducts: rand(1000, 50000),
                trend: randFloat(-15, 30),
            })).sort((a, b) => b.searches - a.searches),
            longTailKeywords: [
                '夏季防晒衣女薄款', '补水面膜学生党平价', '蓝牙耳机运动跑步',
                '纯棉t恤男宽松大码', '陶瓷杯子带盖勺', '坚果礼盒过年送礼',
                '瑜伽裤提臀高腰', '小白鞋女2024新款', '婴儿衣服秋冬款',
                '护眼台灯学生专用', '洁面乳温和不刺激', '儿童益智玩具3-6岁'
            ].map(w => ({
                word: w,
                searches: rand(1000, 20000),
                clicks: rand(300, 8000),
                convRate: randFloat(1, 8),
                competition: randFloat(5, 60),
            })),
        };
    }

    // ===== 竞争分析数据 =====
    function getCompetitionData() {
        const competitors = [
            '花漾美衣旗舰店', '品质之选官方店', '潮流数码专营店',
            '美丽说官方旗舰', '乐享生活家居店', '鲜味坊食品店',
        ];

        return {
            competitors: competitors.map(name => ({
                name,
                visitors: rand(2000, 15000),
                payAmount: randFloat(20000, 200000),
                productCount: rand(50, 500),
                avgPrice: randFloat(30, 200),
                convRate: randFloat(1.5, 6),
                collectRate: randFloat(3, 15),
                score: randFloat(4.5, 5.0, 1),
            })),
            myRanking: {
                visitors: rand(1, 50),
                payAmount: rand(1, 50),
                convRate: rand(1, 50),
                totalShops: rand(500, 2000),
            },
        };
    }

    // ===== 教学提示 =====
    const teachingTips = {
        dashboard: {
            title: '首页概况 - 教学要点',
            content: `
                <h4>📊 核心指标说明</h4>
                <ul>
                    <li><strong>访客数(UV)</strong>：独立访问用户数，去重统计</li>
                    <li><strong>浏览量(PV)</strong>：页面被浏览的总次数</li>
                    <li><strong>支付转化率</strong>：支付买家数/访客数×100%</li>
                    <li><strong>客单价</strong>：支付金额/支付买家数</li>
                </ul>
                <div class="tip-highlight">💡 教学重点：让学生理解UV与PV的区别，以及转化率的计算方法</div>
                <h4>📈 数据解读方法</h4>
                <ul>
                    <li>关注指标的环比变化趋势</li>
                    <li>分析数据异常波动的原因</li>
                    <li>将多个指标关联分析</li>
                </ul>
            `
        },
        traffic: {
            title: '流量分析 - 教学要点',
            content: `
                <h4>🔍 流量来源分类</h4>
                <ul>
                    <li><strong>自然搜索</strong>：通过搜索关键词进入</li>
                    <li><strong>付费推广</strong>：直通车、钻展等</li>
                    <li><strong>活动流量</strong>：参加平台活动获得</li>
                    <li><strong>自主访问</strong>：收藏、购物车等</li>
                </ul>
                <div class="tip-highlight">💡 教学重点：理解不同流量渠道的特点和成本差异</div>
                <h4>📋 实践任务</h4>
                <ul>
                    <li>分析各渠道流量占比</li>
                    <li>计算各渠道的ROI</li>
                    <li>制定流量优化方案</li>
                </ul>
            `
        },
        product: {
            title: '商品分析 - 教学要点',
            content: `
                <h4>📦 商品核心指标</h4>
                <ul>
                    <li><strong>商品访客数</strong>：访问该商品的独立用户</li>
                    <li><strong>支付转化率</strong>：商品层面的成交效率</li>
                    <li><strong>收藏加购率</strong>：用户兴趣度指标</li>
                    <li><strong>退款率</strong>：商品质量与描述匹配度</li>
                </ul>
                <div class="tip-highlight">💡 教学重点：识别爆款商品特征，分析滞销品原因</div>
                <h4>📋 实践任务</h4>
                <ul>
                    <li>按销售额排序，找出TOP5商品</li>
                    <li>分析高转化商品的共同特征</li>
                    <li>找出需要优化的商品</li>
                </ul>
            `
        },
        transaction: {
            title: '交易分析 - 教学要点',
            content: `
                <h4>💰 交易核心概念</h4>
                <ul>
                    <li><strong>支付金额</strong>：买家实际支付总额</li>
                    <li><strong>订单转化漏斗</strong>：浏览→加购→下单→支付</li>
                    <li><strong>退款率</strong>：退款金额/支付金额×100%</li>
                </ul>
                <div class="tip-highlight">💡 教学重点：理解电商交易的完整流程和各环节转化</div>
            `
        },
        market: {
            title: '市场行情 - 教学要点',
            content: `
                <h4>🌐 市场分析维度</h4>
                <ul>
                    <li><strong>行业大盘</strong>：整体市场规模和趋势</li>
                    <li><strong>类目分析</strong>：细分市场的表现</li>
                    <li><strong>价格分布</strong>：了解市场价格策略</li>
                </ul>
                <div class="tip-highlight">💡 教学重点：培养学生的市场洞察能力和竞争意识</div>
            `
        },
        customer: {
            title: '客户分析 - 教学要点',
            content: `
                <h4>👥 客户画像构建</h4>
                <ul>
                    <li><strong>人口属性</strong>：性别、年龄、地域分布</li>
                    <li><strong>消费行为</strong>：购买频次、客单价</li>
                    <li><strong>新老客占比</strong>：获客与留存分析</li>
                    <li><strong>复购率</strong>：客户忠诚度指标</li>
                </ul>
                <div class="tip-highlight">💡 教学重点：理解客户分群和精准营销的基本方法</div>
            `
        },
        keyword: {
            title: '搜索词分析 - 教学要点',
            content: `
                <h4>🔎 搜索词价值</h4>
                <ul>
                    <li><strong>搜索人气</strong>：关键词被搜索的次数</li>
                    <li><strong>点击率</strong>：搜索后被点击的比例</li>
                    <li><strong>竞争度</strong>：同类商品的竞争激烈程度</li>
                    <li><strong>长尾词</strong>：更精准的搜索意图</li>
                </ul>
                <div class="tip-highlight">💡 教学重点：关键词选择与标题优化的方法</div>
            `
        },
        competition: {
            title: '竞争分析 - 教学要点',
            content: `
                <h4>⚔️ 竞争情报</h4>
                <ul>
                    <li>了解竞争对手的流量规模</li>
                    <li>分析竞品的价格策略</li>
                    <li>对标竞品的转化效率</li>
                    <li>找出自身的优势和不足</li>
                </ul>
                <div class="tip-highlight">💡 教学重点：SWOT分析法在电商竞争分析中的应用</div>
            `
        },
    };

    // ===== 公开接口 =====
    return {
        getDashboardData,
        getRealtimeData,
        getTrafficData,
        getProductData,
        getTransactionData,
        getMarketData,
        getCustomerData,
        getKeywordData,
        getCompetitionData,
        getDateLabels,
        getDates,
        teachingTips,
        formatNum,
        formatMoney,
        formatPct,
        products,
        categories,
        rand,
        randFloat,
    };
})();
