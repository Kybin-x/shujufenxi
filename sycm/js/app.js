/**
 * 生意参谋模拟平台 - 主应用程序
 */
(function () {
    'use strict';

    let currentPage = 'dashboard';
    let cachedData = {};

    // ===== 初始化 =====
    document.addEventListener('DOMContentLoaded', init);

    function init() {
        bindLogin();
        bindNavigation();
        bindTeachingTip();
        setUpdateTime();
    }

    // ===== 登录 =====
    function bindLogin() {
        document.getElementById('loginForm').addEventListener('submit', function (e) {
            e.preventDefault();
            const user = document.getElementById('loginUser').value.trim();
            if (!user) {
                showToast('请输入店铺账号', 'error');
                return;
            }
            document.getElementById('currentUser').textContent = user;
            document.getElementById('loginScreen').style.display = 'none';
            document.getElementById('mainApp').style.display = 'block';
            showPage('dashboard');
            showToast('登录成功，欢迎使用生意参谋教学平台！');
        });
    }

    window.handleLogout = function () {
        document.getElementById('mainApp').style.display = 'none';
        document.getElementById('loginScreen').style.display = 'flex';
        ChartManager.destroyAll();
        cachedData = {};
    };

    // ===== 导航 =====
    function bindNavigation() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', function () {
                const page = this.dataset.page;
                document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
                this.classList.add('active');
                showPage(page);
            });
        });
    }

    function showPage(page) {
        currentPage = page;
        ChartManager.destroyAll();
        const container = document.getElementById('contentArea');

        switch (page) {
            case 'dashboard': renderDashboard(container); break;
            case 'traffic': renderTraffic(container); break;
            case 'product': renderProduct(container); break;
            case 'transaction': renderTransaction(container); break;
            case 'market': renderMarket(container); break;
            case 'customer': renderCustomer(container); break;
            case 'keyword': renderKeyword(container); break;
            case 'competition': renderCompetition(container); break;
            default: renderDashboard(container);
        }

        updateTeachingTip(page);
        container.scrollTop = 0;
    }

    function setUpdateTime() {
        const now = new Date();
        document.getElementById('updateTime').textContent =
            `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    }

    // ===== 工具函数 =====
    function getToolbarHTML(title, subtitle = '') {
        const today = new Date().toISOString().split('T')[0];
        const d30 = new Date(); d30.setDate(d30.getDate() - 30);
        const thirtyAgo = d30.toISOString().split('T')[0];

        return `
        <div class="page-toolbar">
            <div class="page-title">
                <h2>${title}</h2>
                ${subtitle ? `<span class="subtitle">${subtitle}</span>` : ''}
            </div>
            <div class="toolbar-actions">
                <div class="date-shortcuts">
                    <button class="shortcut" onclick="refreshPageData(7)">近7天</button>
                    <button class="shortcut active" onclick="refreshPageData(30)">近30天</button>
                </div>
                <div class="date-picker-group">
                    <input type="date" value="${thirtyAgo}">
                    <span>至</span>
                    <input type="date" value="${today}">
                </div>
                <button class="btn" onclick="showExportModal()">
                    <i class="fas fa-download"></i> 导出
                </button>
                <button class="btn" onclick="refreshPageData()">
                    <i class="fas fa-sync-alt"></i> 刷新
                </button>
            </div>
        </div>`;
    }

    function metricCardHTML(label, value, change, icon, colorClass = '', isRate = false, isMoney = false) {
        const isUp = change >= 0;
        let displayValue = value;
        if (isMoney) displayValue = MockData.formatMoney(value);
        else if (isRate) displayValue = value + '%';
        else if (typeof value === 'number') displayValue = MockData.formatNum(value);

        return `
        <div class="metric-card ${colorClass}">
            <div class="metric-label"><i class="fas fa-${icon}"></i> ${label}</div>
            <div class="metric-value">${displayValue}</div>
            <div class="metric-change ${isUp ? 'up' : 'down'}">
                <span class="change-label">较昨日</span>
                <i class="fas fa-caret-${isUp ? 'up' : 'down'}"></i>
                ${Math.abs(change).toFixed(2)}%
            </div>
        </div>`;
    }

    // ===== 首页概况 =====
    function renderDashboard(container) {
        const data = MockData.getDashboardData();
        const rt = MockData.getRealtimeData();
        const trafficData = MockData.getTrafficData();
        const productData = MockData.getProductData().slice(0, 5);

        container.innerHTML = `
            ${getToolbarHTML('首页概况', '数据概览')}

            <div class="realtime-bar">
                <div class="realtime-item">
                    <div class="rt-label">今日实时访客</div>
                    <div class="rt-value highlight">${MockData.formatNum(rt.todayVisitors)}</div>
                </div>
                <div class="realtime-item">
                    <div class="rt-label">实时浏览量</div>
                    <div class="rt-value">${MockData.formatNum(rt.todayPageviews)}</div>
                </div>
                <div class="realtime-item">
                    <div class="rt-label">实时支付金额</div>
                    <div class="rt-value highlight">${MockData.formatMoney(rt.todayPayAmount)}</div>
                </div>
                <div class="realtime-item">
                    <div class="rt-label">实时订单数</div>
                    <div class="rt-value">${rt.todayPayOrders}</div>
                </div>
                <div class="realtime-item">
                    <div class="rt-label">当前在线</div>
                    <div class="rt-value">${rt.onlineVisitors}</div>
                </div>
                <div class="realtime-item">
                    <div class="rt-label">平均停留</div>
                    <div class="rt-value">${rt.todayAvgStay}</div>
                </div>
            </div>

            <div class="metrics-grid">
                ${metricCardHTML(data.visitors.label, data.visitors.value, data.visitors.change, 'users', '', false)}
                ${metricCardHTML(data.pageviews.label, data.pageviews.value, data.pageviews.change, 'eye', 'blue', false)}
                ${metricCardHTML(data.payAmount.label, data.payAmount.value, data.payAmount.change, 'yen-sign', 'green', false, true)}
                ${metricCardHTML(data.payBuyers.label, data.payBuyers.value, data.payBuyers.change, 'user-check', 'purple', false)}
                ${metricCardHTML(data.convRate.label, data.convRate.value, data.convRate.change, 'percentage', 'cyan', true)}
                ${metricCardHTML(data.avgPrice.label, data.avgPrice.value, data.avgPrice.change, 'tag', '', false, true)}
                ${metricCardHTML(data.collectAdd.label, data.collectAdd.value, data.collectAdd.change, 'heart', 'blue', false)}
                ${metricCardHTML(data.refundAmount.label, data.refundAmount.value, data.refundAmount.change, 'undo', 'red', false, true)}
            </div>

            <div class="charts-row">
                <div class="chart-section">
                    <div class="chart-header">
                        <div class="chart-title"><i class="fas fa-chart-line"></i> 流量趋势</div>
                    </div>
                    <div class="chart-body">
                        <div class="chart-canvas-wrap"><canvas id="dashVisitorChart"></canvas></div>
                    </div>
                </div>
                <div class="chart-section">
                    <div class="chart-header">
                        <div class="chart-title"><i class="fas fa-chart-pie"></i> 流量来源占比</div>
                    </div>
                    <div class="chart-body">
                        <div class="chart-canvas-wrap"><canvas id="dashSourceChart"></canvas></div>
                    </div>
                </div>
            </div>

            <div class="table-section">
                <div class="table-header">
                    <div class="table-title"><i class="fas fa-fire"></i> 商品销售TOP5</div>
                    <div class="table-actions">
                        <button class="btn btn-sm" onclick="showPage('product')">查看更多 <i class="fas fa-arrow-right"></i></button>
                    </div>
                </div>
                <div class="data-table-wrap">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>排名</th><th>商品</th><th>访客数</th><th>支付金额</th>
                                <th>支付件数</th><th>转化率</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${productData.map((p, i) => `
                                <tr>
                                    <td><span class="status-tag ${i < 3 ? 'hot' : 'normal'}">${i + 1}</span></td>
                                    <td>${p.img} ${p.name}</td>
                                    <td class="num">${MockData.formatNum(p.visitors)}</td>
                                    <td class="num">${MockData.formatMoney(p.payAmount)}</td>
                                    <td class="num">${MockData.formatNum(p.payQty)}</td>
                                    <td class="num">${p.convRate.toFixed(2)}%</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        setTimeout(() => {
            ChartManager.createLine('dashVisitorChart', trafficData.dates,
                [
                    { label: '访客数', data: trafficData.visitors, color: '#ff6600', fill: true },
                    { label: '浏览量', data: trafficData.pageviews, color: '#1a73e8' }
                ]
            );
            ChartManager.createPie('dashSourceChart',
                trafficData.sources.map(s => s.name),
                trafficData.sources.map(s => s.visitors),
                { doughnut: true }
            );
        }, 100);
    }

    // ===== 流量分析 =====
    function renderTraffic(container) {
        const data = MockData.getTrafficData();

        container.innerHTML = `
            ${getToolbarHTML('流量分析', '全店流量')}

            <div class="metrics-grid">
                ${metricCardHTML('访客数', data.visitors.reduce((a, b) => a + b, 0), MockData.randFloat(-10, 15), 'users', '')}
                ${metricCardHTML('浏览量', data.pageviews.reduce((a, b) => a + b, 0), MockData.randFloat(-8, 12), 'eye', 'blue')}
                ${metricCardHTML('平均停留时长', Math.round(data.avgStayTime.reduce((a, b) => a + b, 0) / data.avgStayTime.length) + '秒', MockData.randFloat(-5, 10), 'clock', 'green')}
                ${metricCardHTML('跳失率', (data.bounceRate.reduce((a, b) => a + b, 0) / data.bounceRate.length).toFixed(1) + '%', MockData.randFloat(-3, 5), 'sign-out-alt', 'red', false)}
            </div>

            <div class="chart-section">
                <div class="chart-header">
                    <div class="chart-title"><i class="fas fa-chart-area"></i> 流量趋势</div>
                    <div class="chart-tabs">
                        <span class="chart-tab active" onclick="switchTrafficChart(this,'visitors')">访客数</span>
                        <span class="chart-tab" onclick="switchTrafficChart(this,'pageviews')">浏览量</span>
                        <span class="chart-tab" onclick="switchTrafficChart(this,'bounce')">跳失率</span>
                    </div>
                </div>
                <div class="chart-body">
                    <div class="chart-canvas-wrap"><canvas id="trafficTrendChart"></canvas></div>
                </div>
            </div>

            <div class="charts-row">
                <div class="chart-section">
                    <div class="chart-header">
                        <div class="chart-title"><i class="fas fa-sitemap"></i> 流量来源分布</div>
                    </div>
                    <div class="chart-body">
                        <div class="chart-canvas-wrap"><canvas id="trafficSourceChart"></canvas></div>
                    </div>
                </div>
                <div class="chart-section">
                    <div class="chart-header">
                        <div class="chart-title"><i class="fas fa-mobile-alt"></i> 设备分布</div>
                    </div>
                    <div class="chart-body">
                        <div class="chart-canvas-wrap"><canvas id="deviceChart"></canvas></div>
                    </div>
                </div>
            </div>

            <div class="chart-section">
                <div class="chart-header">
                    <div class="chart-title"><i class="fas fa-clock"></i> 24小时访客分布</div>
                </div>
                <div class="chart-body">
                    <div class="chart-canvas-wrap"><canvas id="hourlyChart"></canvas></div>
                </div>
            </div>

            <div class="table-section">
                <div class="table-header">
                    <div class="table-title"><i class="fas fa-list"></i> 流量来源明细</div>
                    <div class="table-actions">
                        <button class="btn btn-sm" onclick="showExportModal()"><i class="fas fa-download"></i> 导出</button>
                    </div>
                </div>
                <div class="data-table-wrap">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>来源渠道</th><th>访客数 <i class="fas fa-sort sort-icon"></i></th>
                                <th>占比</th><th>较前日</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.sources.map(s => `
                                <tr>
                                    <td><i class="fas fa-circle" style="font-size:8px;color:${s.pct > 15 ? '#ff6600' : '#1a73e8'};margin-right:6px;"></i>${s.name}</td>
                                    <td class="num">${MockData.formatNum(s.visitors)}</td>
                                    <td>${s.pct}%</td>
                                    <td class="${s.change >= 0 ? 'positive' : 'negative'}">
                                        <i class="fas fa-caret-${s.change >= 0 ? 'up' : 'down'}"></i> ${Math.abs(s.change).toFixed(2)}%
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        cachedData.traffic = data;

        setTimeout(() => {
            ChartManager.createLine('trafficTrendChart', data.dates,
                [{ label: '访客数', data: data.visitors, color: '#ff6600', fill: true }]
            );
            ChartManager.createHorizontalBar('trafficSourceChart',
                data.sources.map(s => s.name),
                [{ label: '访客数', data: data.sources.map(s => s.visitors) }]
            );
            ChartManager.createPie('deviceChart',
                ['PC端', '移动端', '其他'],
                [data.devices.pc, data.devices.mobile, data.devices.other],
                { doughnut: true }
            );
            ChartManager.createBar('hourlyChart',
                Array.from({ length: 24 }, (_, i) => `${i}时`),
                [{ label: '访客数', data: data.hourly, color: '#1a73e8' }],
                { plugins: { legend: { display: false } } }
            );
        }, 100);
    }

    window.switchTrafficChart = function (el, type) {
        el.parentElement.querySelectorAll('.chart-tab').forEach(t => t.classList.remove('active'));
        el.classList.add('active');
        const data = cachedData.traffic;
        if (!data) return;

        const configs = {
            visitors: { label: '访客数', data: data.visitors, color: '#ff6600' },
            pageviews: { label: '浏览量', data: data.pageviews, color: '#1a73e8' },
            bounce: { label: '跳失率(%)', data: data.bounceRate, color: '#ff3141' },
        };
        const c = configs[type];
        ChartManager.createLine('trafficTrendChart', data.dates,
            [{ label: c.label, data: c.data, color: c.color, fill: true }]
        );
    };

    // ===== 商品分析 =====
    function renderProduct(container) {
        const data = MockData.getProductData();

        container.innerHTML = `
            ${getToolbarHTML('商品分析', '商品效果')}

            <div class="metrics-grid">
                ${metricCardHTML('在售商品数', data.length, MockData.randFloat(0, 5), 'box-open', '')}
                ${metricCardHTML('被访问商品数', data.filter(p => p.visitors > 100).length, MockData.randFloat(-5, 10), 'eye', 'blue')}
                ${metricCardHTML('被支付商品数', data.filter(p => p.payQty > 0).length, MockData.randFloat(-3, 8), 'shopping-bag', 'green')}
                ${metricCardHTML('商品平均转化率', (data.reduce((a, b) => a + b.convRate, 0) / data.length).toFixed(2) + '%', MockData.randFloat(-2, 5), 'funnel-dollar', 'purple', false)}
            </div>

            <div class="charts-row">
                <div class="chart-section">
                    <div class="chart-header">
                        <div class="chart-title"><i class="fas fa-trophy"></i> 商品销售额TOP10</div>
                    </div>
                    <div class="chart-body">
                        <div class="chart-canvas-wrap"><canvas id="productSalesChart"></canvas></div>
                    </div>
                </div>
                <div class="chart-section">
                    <div class="chart-header">
                        <div class="chart-title"><i class="fas fa-tags"></i> 类目销售分布</div>
                    </div>
                    <div class="chart-body">
                        <div class="chart-canvas-wrap"><canvas id="categorySalesChart"></canvas></div>
                    </div>
                </div>
            </div>

            <div class="table-section">
                <div class="table-header">
                    <div class="table-title"><i class="fas fa-table"></i> 商品明细数据</div>
                    <div class="table-actions">
                        <div class="filter-bar" style="margin:0;">
                            <input type="text" placeholder="搜索商品名称..." id="productSearch" oninput="filterProducts()" style="width:180px;">
                            <select id="categoryFilter" onchange="filterProducts()">
                                <option value="">全部类目</option>
                                ${MockData.categories.map(c => `<option value="${c}">${c}</option>`).join('')}
                            </select>
                        </div>
                        <button class="btn btn-sm" onclick="showExportModal()"><i class="fas fa-download"></i> 导出</button>
                    </div>
                </div>
                <div class="data-table-wrap">
                    <table class="data-table" id="productTable">
                        <thead>
                            <tr>
                                <th onclick="sortProductTable(0)">商品 <i class="fas fa-sort sort-icon"></i></th>
                                <th onclick="sortProductTable(1)">类目</th>
                                <th onclick="sortProductTable(2)">单价</th>
                                <th onclick="sortProductTable(3)">访客数 <i class="fas fa-sort sort-icon"></i></th>
                                <th onclick="sortProductTable(4)">支付金额 <i class="fas fa-sort sort-icon"></i></th>
                                <th onclick="sortProductTable(5)">支付件数</th>
                                <th onclick="sortProductTable(6)">转化率</th>
                                <th onclick="sortProductTable(7)">收藏率</th>
                                <th onclick="sortProductTable(8)">加购率</th>
                                <th>退款率</th>
                            </tr>
                        </thead>
                        <tbody id="productTableBody">
                            ${renderProductRows(data)}
                        </tbody>
                    </table>
                </div>
                <div class="table-footer">
                    <span>共 ${data.length} 件商品</span>
                    <div class="pagination">
                        <button class="active">1</button>
                    </div>
                </div>
            </div>
        `;

        cachedData.products = data;

        setTimeout(() => {
            const top10 = data.slice(0, 10);
            ChartManager.createHorizontalBar('productSalesChart',
                top10.map(p => p.name.substring(0, 10) + '...'),
                [{ label: '支付金额', data: top10.map(p => p.payAmount), color: '#ff6600' }]
            );

            const catData = {};
            data.forEach(p => {
                catData[p.category] = (catData[p.category] || 0) + p.payAmount;
            });
            ChartManager.createPie('categorySalesChart',
                Object.keys(catData),
                Object.values(catData).map(v => +v.toFixed(2)),
                { doughnut: true }
            );
        }, 100);
    }

    function renderProductRows(data) {
        return data.map(p => `
            <tr>
                <td>${p.img} ${p.name}</td>
                <td><span class="status-tag normal">${p.category}</span></td>
                <td class="num">${MockData.formatMoney(p.price)}</td>
                <td class="num">${MockData.formatNum(p.visitors)}</td>
                <td class="num">${MockData.formatMoney(p.payAmount)}</td>
                <td class="num">${MockData.formatNum(p.payQty)}</td>
                <td class="num">${p.convRate.toFixed(2)}%</td>
                <td class="num">${p.collectRate.toFixed(2)}%</td>
                <td class="num">${p.cartRate.toFixed(2)}%</td>
                <td class="num ${p.refundRate > 5 ? 'positive' : ''}">${p.refundRate.toFixed(2)}%</td>
            </tr>
        `).join('');
    }

    window.filterProducts = function () {
        const search = document.getElementById('productSearch').value.toLowerCase();
        const category = document.getElementById('categoryFilter').value;
        let filtered = cachedData.products || [];

        if (search) filtered = filtered.filter(p => p.name.toLowerCase().includes(search));
        if (category) filtered = filtered.filter(p => p.category === category);

        document.getElementById('productTableBody').innerHTML = renderProductRows(filtered);
    };

    window.sortProductTable = function (col) {
        let data = cachedData.products || [];
        const keys = ['name', 'category', 'price', 'visitors', 'payAmount', 'payQty', 'convRate', 'collectRate', 'cartRate'];
        const key = keys[col];
        if (!key) return;

        cachedData.productSortDir = cachedData.productSortDir === 'asc' ? 'desc' : 'asc';
        const dir = cachedData.productSortDir === 'asc' ? 1 : -1;
        data.sort((a, b) => typeof a[key] === 'string' ? a[key].localeCompare(b[key]) * dir : (a[key] - b[key]) * dir);

        document.getElementById('productTableBody').innerHTML = renderProductRows(data);
    };

    // ===== 交易分析 =====
    function renderTransaction(container) {
        const data = MockData.getTransactionData();

        container.innerHTML = `
            ${getToolbarHTML('交易分析', '交易概况')}

            <div class="metrics-grid">
                ${metricCardHTML('总支付金额', data.summary.totalAmount, MockData.randFloat(-5, 20), 'yen-sign', 'green', false, true)}
                ${metricCardHTML('总订单数', data.summary.totalOrders, MockData.randFloat(-3, 15), 'receipt', 'blue')}
                ${metricCardHTML('笔单价', data.summary.avgOrderAmount, MockData.randFloat(-5, 10), 'calculator', '')}
                ${metricCardHTML('退款率', data.summary.refundRate, MockData.randFloat(-2, 3), 'undo', 'red', true)}
            </div>

            <div class="chart-section">
                <div class="chart-header">
                    <div class="chart-title"><i class="fas fa-chart-line"></i> 交易趋势</div>
                    <div class="chart-tabs">
                        <span class="chart-tab active" onclick="switchTxChart(this,'amount')">支付金额</span>
                        <span class="chart-tab" onclick="switchTxChart(this,'orders')">订单数</span>
                        <span class="chart-tab" onclick="switchTxChart(this,'refund')">退款金额</span>
                    </div>
                </div>
                <div class="chart-body">
                    <div class="chart-canvas-wrap"><canvas id="txTrendChart"></canvas></div>
                </div>
            </div>

            <div class="charts-row">
                <div class="chart-section">
                    <div class="chart-header">
                        <div class="chart-title"><i class="fas fa-tasks"></i> 订单状态分布</div>
                    </div>
                    <div class="chart-body">
                        <div class="chart-canvas-wrap"><canvas id="orderStatusChart"></canvas></div>
                    </div>
                </div>
                <div class="chart-section">
                    <div class="chart-header">
                        <div class="chart-title"><i class="fas fa-credit-card"></i> 支付方式分布</div>
                    </div>
                    <div class="chart-body">
                        <div class="chart-canvas-wrap"><canvas id="payMethodChart"></canvas></div>
                    </div>
                </div>
            </div>

            <div class="table-section">
                <div class="table-header">
                    <div class="table-title"><i class="fas fa-calendar-alt"></i> 每日交易明细</div>
                    <button class="btn btn-sm" onclick="showExportModal()"><i class="fas fa-download"></i> 导出</button>
                </div>
                <div class="data-table-wrap">
                    <table class="data-table">
                        <thead>
                            <tr><th>日期</th><th>支付金额</th><th>订单数</th><th>退款金额</th><th>笔单价</th></tr>
                        </thead>
                        <tbody>
                            ${data.dates.slice(-10).map((d, i) => {
            const idx = data.dates.length - 10 + i;
            const avg = data.orderTrend[idx] > 0 ? (data.payAmountTrend[idx] / data.orderTrend[idx]).toFixed(2) : '0.00';
            return `<tr>
                                    <td>${d}</td>
                                    <td class="num">${MockData.formatMoney(data.payAmountTrend[idx])}</td>
                                    <td class="num">${data.orderTrend[idx]}</td>
                                    <td class="num positive">${MockData.formatMoney(data.refundTrend[idx])}</td>
                                    <td class="num">¥${avg}</td>
                                </tr>`;
        }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        cachedData.transaction = data;

        setTimeout(() => {
            ChartManager.createLine('txTrendChart', data.dates,
                [{ label: '支付金额', data: data.payAmountTrend, color: '#00b578', fill: true }]
            );
            ChartManager.createPie('orderStatusChart',
                ['已付款', '已发货', '已完成', '退款中'],
                Object.values(data.orderStatusDist),
                { doughnut: true }
            );
            ChartManager.createPie('payMethodChart',
                Object.keys(data.payMethodDist),
                Object.values(data.payMethodDist),
                { doughnut: true }
            );
        }, 100);
    }

    window.switchTxChart = function (el, type) {
        el.parentElement.querySelectorAll('.chart-tab').forEach(t => t.classList.remove('active'));
        el.classList.add('active');
        const data = cachedData.transaction;
        if (!data) return;

        const configs = {
            amount: { label: '支付金额', data: data.payAmountTrend, color: '#00b578' },
            orders: { label: '订单数', data: data.orderTrend, color: '#1a73e8' },
            refund: { label: '退款金额', data: data.refundTrend, color: '#ff3141' },
        };
        const c = configs[type];
        ChartManager.createLine('txTrendChart', data.dates,
            [{ label: c.label, data: c.data, color: c.color, fill: true }]
        );
    };

    // ===== 市场行情 =====
    function renderMarket(container) {
        const data = MockData.getMarketData();

        container.innerHTML = `
            ${getToolbarHTML('市场行情', '行业分析')}

            <div class="chart-section">
                <div class="chart-header">
                    <div class="chart-title"><i class="fas fa-chart-area"></i> 行业大盘趋势</div>
                    <div class="chart-tabs">
                        <span class="chart-tab active">搜索指数</span>
                        <span class="chart-tab">交易指数</span>
                    </div>
                </div>
                <div class="chart-body">
                    <div class="chart-canvas-wrap"><canvas id="marketTrendChart"></canvas></div>
                </div>
            </div>

            <div class="charts-row">
                <div class="chart-section">
                    <div class="chart-header">
                        <div class="chart-title"><i class="fas fa-layer-group"></i> 类目搜索热度</div>
                    </div>
                    <div class="chart-body">
                        <div class="chart-canvas-wrap"><canvas id="categoryHeatChart"></canvas></div>
                    </div>
                </div>
                <div class="chart-section">
                    <div class="chart-header">
                        <div class="chart-title"><i class="fas fa-money-bill-wave"></i> 价格区间分布</div>
                    </div>
                    <div class="chart-body">
                        <div class="chart-canvas-wrap"><canvas id="priceRangeChart"></canvas></div>
                    </div>
                </div>
            </div>

            <div class="table-section">
                <div class="table-header">
                    <div class="table-title"><i class="fas fa-ranking-star"></i> 类目排行</div>
                </div>
                <div class="data-table-wrap">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>排名</th><th>类目</th><th>搜索量</th><th>成交量</th>
                                <th>均价</th><th>增长率</th><th>在线商家</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.categoryRanking.map((c, i) => `
                                <tr>
                                    <td><span class="status-tag ${i < 3 ? 'hot' : 'normal'}">${i + 1}</span></td>
                                    <td>${c.name}</td>
                                    <td class="num">${MockData.formatNum(c.searchVolume)}</td>
                                    <td class="num">${MockData.formatNum(c.transactionVolume)}</td>
                                    <td class="num">¥${c.avgPrice.toFixed(2)}</td>
                                    <td class="${c.growth >= 0 ? 'positive' : 'negative'}">
                                        <i class="fas fa-caret-${c.growth >= 0 ? 'up' : 'down'}"></i> ${Math.abs(c.growth).toFixed(1)}%
                                    </td>
                                    <td class="num">${MockData.formatNum(c.shops)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        setTimeout(() => {
            ChartManager.createLine('marketTrendChart', data.industryTrend.dates, [
                { label: '搜索指数', data: data.industryTrend.searchIndex, color: '#ff6600' },
                { label: '交易指数', data: data.industryTrend.transactionIndex, color: '#1a73e8' },
                { label: '点击指数', data: data.industryTrend.clickIndex, color: '#00b578' },
            ]);
            ChartManager.createBar('categoryHeatChart',
                data.categoryRanking.map(c => c.name),
                [{ label: '搜索量', data: data.categoryRanking.map(c => c.searchVolume), color: '#ff6600' }],
                { plugins: { legend: { display: false } } }
            );
            ChartManager.createBar('priceRangeChart',
                data.priceRange.map(p => p.range),
                [{ label: '占比(%)', data: data.priceRange.map(p => p.pct), color: '#1a73e8' }],
                { plugins: { legend: { display: false } } }
            );
        }, 100);
    }

    // ===== 客户分析 =====
    function renderCustomer(container) {
        const data = MockData.getCustomerData();

        container.innerHTML = `
            ${getToolbarHTML('客户分析', '客户画像')}

            <div class="metrics-grid">
                ${metricCardHTML('新客占比', data.newVsOld.newBuyers + '%', MockData.randFloat(-5, 10), 'user-plus', 'blue', false)}
                ${metricCardHTML('老客占比', data.newVsOld.oldBuyers + '%', MockData.randFloat(-5, 10), 'user-check', 'green', false)}
                ${metricCardHTML('复购率', data.repurchaseRate.toFixed(1) + '%', MockData.randFloat(-2, 5), 'redo', 'purple', false)}
                ${metricCardHTML('女性占比', data.genderDist.female + '%', MockData.randFloat(-3, 5), 'venus', '', false)}
            </div>

            <div class="charts-row">
                <div class="chart-section">
                    <div class="chart-header">
                        <div class="chart-title"><i class="fas fa-venus-mars"></i> 性别分布</div>
                    </div>
                    <div class="chart-body">
                        <div class="chart-canvas-wrap"><canvas id="genderChart"></canvas></div>
                    </div>
                </div>
                <div class="chart-section">
                    <div class="chart-header">
                        <div class="chart-title"><i class="fas fa-birthday-cake"></i> 年龄分布</div>
                    </div>
                    <div class="chart-body">
                        <div class="chart-canvas-wrap"><canvas id="ageChart"></canvas></div>
                    </div>
                </div>
            </div>

            <div class="charts-row">
                <div class="chart-section">
                    <div class="chart-header">
                        <div class="chart-title"><i class="fas fa-user-friends"></i> 新老客户对比</div>
                    </div>
                    <div class="chart-body">
                        <div class="chart-canvas-wrap"><canvas id="newOldChart"></canvas></div>
                    </div>
                </div>
                <div class="chart-section">
                    <div class="chart-header">
                        <div class="chart-title"><i class="fas fa-shopping-bag"></i> 消费频次分布</div>
                    </div>
                    <div class="chart-body">
                        <div class="chart-canvas-wrap"><canvas id="freqChart"></canvas></div>
                    </div>
                </div>
            </div>

            <div class="table-section">
                <div class="table-header">
                    <div class="table-title"><i class="fas fa-map-marker-alt"></i> 地域分布TOP15</div>
                    <button class="btn btn-sm" onclick="showExportModal()"><i class="fas fa-download"></i> 导出</button>
                </div>
                <div class="data-table-wrap">
                    <table class="data-table">
                        <thead>
                            <tr><th>排名</th><th>省份</th><th>买家数</th><th>消费金额</th><th>占比</th><th>占比条</th></tr>
                        </thead>
                        <tbody>
                            ${data.regionDist.map((r, i) => `
                                <tr>
                                    <td><span class="status-tag ${i < 3 ? 'hot' : 'normal'}">${i + 1}</span></td>
                                    <td>${r.name}</td>
                                    <td class="num">${MockData.formatNum(r.buyers)}</td>
                                    <td class="num">${MockData.formatMoney(r.amount)}</td>
                                    <td class="num">${r.pct.toFixed(1)}%</td>
                                    <td style="min-width:120px;">
                                        <div class="progress-bar">
                                            <div class="fill orange" style="width:${r.pct * 5}%"></div>
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        setTimeout(() => {
            ChartManager.createPie('genderChart',
                ['男性', '女性', '未知'],
                [data.genderDist.male, data.genderDist.female, data.genderDist.unknown],
                { doughnut: true }
            );
            ChartManager.createBar('ageChart',
                data.ageDist.map(a => a.range),
                [{ label: '占比(%)', data: data.ageDist.map(a => a.pct), color: '#8b5cf6' }],
                { plugins: { legend: { display: false } } }
            );
            ChartManager.createPie('newOldChart',
                ['新客户', '老客户'],
                [data.newVsOld.newBuyers, data.newVsOld.oldBuyers],
                { doughnut: true }
            );
            ChartManager.createBar('freqChart',
                Object.keys(data.avgConsumption),
                [{ label: '客户占比(%)', data: Object.values(data.avgConsumption), color: '#06b6d4' }],
                { plugins: { legend: { display: false } } }
            );
        }, 100);
    }

    // ===== 搜索词分析 =====
    function renderKeyword(container) {
        const data = MockData.getKeywordData();

        container.innerHTML = `
            ${getToolbarHTML('搜索词分析', '关键词洞察')}

            <div class="chart-section">
                <div class="chart-header">
                    <div class="chart-title"><i class="fas fa-cloud"></i> 热门搜索词</div>
                </div>
                <div class="keyword-cloud">
                    ${data.topKeywords.map((k, i) => {
            const size = i < 3 ? 'lg' : i < 7 ? 'md' : 'sm';
            return `<span class="keyword-tag ${size}">${k.word} <small>(${MockData.formatNum(k.searches)})</small></span>`;
        }).join('')}
                </div>
            </div>

            <div class="chart-section">
                <div class="chart-header">
                    <div class="chart-title"><i class="fas fa-chart-bar"></i> 关键词搜索量对比</div>
                </div>
                <div class="chart-body">
                    <div class="chart-canvas-wrap"><canvas id="keywordBarChart"></canvas></div>
                </div>
            </div>

            <div class="table-section">
                <div class="table-header">
                    <div class="table-title"><i class="fas fa-fire"></i> 热门搜索词明细</div>
                    <button class="btn btn-sm" onclick="showExportModal()"><i class="fas fa-download"></i> 导出</button>
                </div>
                <div class="data-table-wrap">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>排名</th><th>搜索词</th><th>搜索人气</th><th>点击人气</th>
                                <th>点击率</th><th>转化率</th><th>竞争度</th><th>趋势</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.topKeywords.map((k, i) => `
                                <tr>
                                    <td><span class="status-tag ${i < 3 ? 'hot' : 'normal'}">${i + 1}</span></td>
                                    <td><strong>${k.word}</strong></td>
                                    <td class="num">${MockData.formatNum(k.searches)}</td>
                                    <td class="num">${MockData.formatNum(k.clicks)}</td>
                                    <td class="num">${((k.clicks / k.searches) * 100).toFixed(2)}%</td>
                                    <td class="num">${k.convRate.toFixed(2)}%</td>
                                    <td>
                                        <div class="progress-bar" style="width:80px;display:inline-block;vertical-align:middle;">
                                            <div class="fill ${k.competition > 60 ? 'orange' : k.competition > 30 ? 'blue' : 'green'}" style="width:${k.competition}%"></div>
                                        </div>
                                        <span style="font-size:11px;margin-left:4px;">${k.competition.toFixed(0)}%</span>
                                    </td>
                                    <td class="${k.trend >= 0 ? 'positive' : 'negative'}">
                                        <i class="fas fa-caret-${k.trend >= 0 ? 'up' : 'down'}"></i> ${Math.abs(k.trend).toFixed(1)}%
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="table-section">
                <div class="table-header">
                    <div class="table-title"><i class="fas fa-search-plus"></i> 长尾词推荐</div>
                </div>
                <div class="data-table-wrap">
                    <table class="data-table">
                        <thead>
                            <tr><th>搜索词</th><th>搜索人气</th><th>点击人气</th><th>转化率</th><th>竞争度</th></tr>
                        </thead>
                        <tbody>
                            ${data.longTailKeywords.map(k => `
                                <tr>
                                    <td>${k.word}</td>
                                    <td class="num">${MockData.formatNum(k.searches)}</td>
                                    <td class="num">${MockData.formatNum(k.clicks)}</td>
                                    <td class="num">${k.convRate.toFixed(2)}%</td>
                                    <td class="num ${k.competition < 30 ? 'negative' : ''}">${k.competition.toFixed(1)}%</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        setTimeout(() => {
            ChartManager.createHorizontalBar('keywordBarChart',
                data.topKeywords.map(k => k.word),
                [
                    { label: '搜索人气', data: data.topKeywords.map(k => k.searches), color: '#ff6600' },
                    { label: '点击人气', data: data.topKeywords.map(k => k.clicks), color: '#1a73e8' },
                ]
            );
        }, 100);
    }

    // ===== 竞争分析 =====
    function renderCompetition(container) {
        const data = MockData.getCompetitionData();

        container.innerHTML = `
            ${getToolbarHTML('竞争分析', '竞品对标')}

            <div class="metrics-grid">
                ${metricCardHTML('行业排名(访客)', '第' + data.myRanking.visitors + '名', MockData.randFloat(-5, 5), 'trophy', 'green')}
                ${metricCardHTML('行业排名(销售额)', '第' + data.myRanking.payAmount + '名', MockData.randFloat(-3, 8), 'medal', 'blue')}
                ${metricCardHTML('行业排名(转化率)', '第' + data.myRanking.convRate + '名', MockData.randFloat(-2, 6), 'star', 'purple')}
                ${metricCardHTML('同行商家数', data.myRanking.totalShops, MockData.randFloat(1, 5), 'store', '')}
            </div>

            <div class="chart-section">
                <div class="chart-header">
                    <div class="chart-title"><i class="fas fa-chess-queen"></i> 竞品流量对比</div>
                </div>
                <div class="chart-body">
                    <div class="chart-canvas-wrap"><canvas id="compVisitorChart"></canvas></div>
                </div>
            </div>

            <div class="charts-row">
                <div class="chart-section">
                    <div class="chart-header">
                        <div class="chart-title"><i class="fas fa-dollar-sign"></i> 竞品销售额对比</div>
                    </div>
                    <div class="chart-body">
                        <div class="chart-canvas-wrap"><canvas id="compSalesChart"></canvas></div>
                    </div>
                </div>
                <div class="chart-section">
                    <div class="chart-header">
                        <div class="chart-title"><i class="fas fa-percentage"></i> 竞品转化率对比</div>
                    </div>
                    <div class="chart-body">
                        <div class="chart-canvas-wrap"><canvas id="compConvChart"></canvas></div>
                    </div>
                </div>
            </div>

            <div class="table-section">
                <div class="table-header">
                    <div class="table-title"><i class="fas fa-table"></i> 竞品详细对比</div>
                    <button class="btn btn-sm" onclick="showExportModal()"><i class="fas fa-download"></i> 导出</button>
                </div>
                <div class="data-table-wrap">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>店铺名称</th><th>访客数</th><th>支付金额</th><th>商品数</th>
                                <th>均价</th><th>转化率</th><th>收藏率</th><th>店铺评分</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="background:#fff8e6;">
                                <td><strong>🏠 优品生活旗舰店（本店）</strong></td>
                                <td class="num">${MockData.formatNum(MockData.rand(3000, 8000))}</td>
                                <td class="num">${MockData.formatMoney(MockData.randFloat(30000, 80000))}</td>
                                <td class="num">${MockData.products.length}</td>
                                <td class="num">¥${MockData.randFloat(50, 120).toFixed(2)}</td>
                                <td class="num">${MockData.randFloat(2, 5).toFixed(2)}%</td>
                                <td class="num">${MockData.randFloat(5, 12).toFixed(2)}%</td>
                                <td class="num">⭐ ${MockData.randFloat(4.7, 5.0, 1)}</td>
                            </tr>
                            ${data.competitors.map(c => `
                                <tr>
                                    <td>${c.name}</td>
                                    <td class="num">${MockData.formatNum(c.visitors)}</td>
                                    <td class="num">${MockData.formatMoney(c.payAmount)}</td>
                                    <td class="num">${c.productCount}</td>
                                    <td class="num">¥${c.avgPrice.toFixed(2)}</td>
                                    <td class="num">${c.convRate.toFixed(2)}%</td>
                                    <td class="num">${c.collectRate.toFixed(2)}%</td>
                                    <td class="num">⭐ ${c.score}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        setTimeout(() => {
            const allShops = ['本店', ...data.competitors.map(c => c.name.substring(0, 6))];
            const myVisitors = MockData.rand(3000, 8000);
            const mySales = MockData.randFloat(30000, 80000);
            const myConv = MockData.randFloat(2, 5);

            ChartManager.createBar('compVisitorChart', allShops,
                [{
                    label: '访客数', data: [myVisitors, ...data.competitors.map(c => c.visitors)],
                    colors: ['#ff6600cc', ...data.competitors.map(() => '#1a73e8cc')]
                }],
                { plugins: { legend: { display: false } } }
            );
            ChartManager.createBar('compSalesChart', allShops,
                [{
                    label: '支付金额', data: [mySales, ...data.competitors.map(c => c.payAmount)],
                    colors: ['#ff6600cc', ...data.competitors.map(() => '#00b578cc')]
                }],
                { plugins: { legend: { display: false } } }
            );
            ChartManager.createBar('compConvChart', allShops,
                [{
                    label: '转化率(%)', data: [myConv, ...data.competitors.map(c => c.convRate)],
                    colors: ['#ff6600cc', ...data.competitors.map(() => '#8b5cf6cc')]
                }],
                { plugins: { legend: { display: false } } }
            );
        }, 100);
    }

    // ===== 数据导出 =====
    window.showExportModal = function () {
        document.getElementById('exportModal').style.display = 'flex';
    };

    window.closeExportModal = function () {
        document.getElementById('exportModal').style.display = 'none';
    };

    window.executeExport = function () {
        let csvContent = '';
        const tables = document.querySelectorAll('#contentArea .data-table');

        if (tables.length > 0) {
            tables.forEach(table => {
                const rows = table.querySelectorAll('tr');
                rows.forEach(row => {
                    const cells = row.querySelectorAll('th, td');
                    const rowData = Array.from(cells).map(cell => {
                        return '"' + cell.textContent.trim().replace(/"/g, '""') + '"';
                    });
                    csvContent += rowData.join(',') + '\n';
                });
                csvContent += '\n';
            });
        } else {
            csvContent = '暂无可导出的表格数据\n';
        }

        const BOM = '\uFEFF';
        const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `生意参谋_${currentPage}_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);

        closeExportModal();
        showToast('数据导出成功！');
    };

    // ===== 刷新数据 =====
    window.refreshPageData = function (days) {
        if (days) {
            document.querySelectorAll('.date-shortcuts .shortcut').forEach(b => b.classList.remove('active'));
            event.target.classList.add('active');
        }
        cachedData = {};
        showPage(currentPage);
        showToast('数据已刷新');
    };

    // ===== 教学提示 =====
    function bindTeachingTip() {
        document.getElementById('teachingToggle').addEventListener('click', function () {
            const tip = document.getElementById('teachingTip');
            tip.style.display = tip.style.display === 'none' ? 'block' : 'none';
            updateTeachingTip(currentPage);
        });
    }

    function updateTeachingTip(page) {
        const tip = MockData.teachingTips[page];
        if (!tip) return;
        document.getElementById('tipContent').innerHTML = tip.content;
    }

    window.closeTeachingTip = function () {
        document.getElementById('teachingTip').style.display = 'none';
    };

    // ===== Toast 消息 =====
    function showToast(message, type = 'success') {
        const existing = document.querySelector('.toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}" 
               style="color:${type === 'success' ? 'var(--success)' : 'var(--danger)'}; font-size:18px;"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

})();
