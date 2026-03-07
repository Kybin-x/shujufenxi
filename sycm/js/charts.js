/**
 * 图表管理器
 */
const ChartManager = (() => {
    const instances = {};
    const defaultColors = [
        '#ff6600', '#1a73e8', '#00b578', '#ff3141', '#8b5cf6',
        '#06b6d4', '#f59e0b', '#ec4899', '#10b981', '#6366f1'
    ];

    const defaultOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    padding: 16,
                    usePointStyle: true,
                    pointStyleWidth: 10,
                    font: { size: 12, family: '-apple-system, "Microsoft YaHei", sans-serif' }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0,0,0,0.8)',
                padding: 12,
                cornerRadius: 8,
                titleFont: { size: 13 },
                bodyFont: { size: 12 },
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { font: { size: 11 }, maxRotation: 45 }
            },
            y: {
                grid: { color: '#f0f0f0' },
                ticks: { font: { size: 11 } },
                beginAtZero: true
            }
        }
    };

    function destroy(id) {
        if (instances[id]) {
            instances[id].destroy();
            delete instances[id];
        }
    }

    function destroyAll() {
        Object.keys(instances).forEach(destroy);
    }

    function createLine(canvasId, labels, datasets, options = {}) {
        destroy(canvasId);
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        instances[canvasId] = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: datasets.map((ds, i) => ({
                    label: ds.label,
                    data: ds.data,
                    borderColor: ds.color || defaultColors[i],
                    backgroundColor: (ds.color || defaultColors[i]) + '15',
                    borderWidth: 2,
                    pointRadius: labels.length > 15 ? 0 : 3,
                    pointHoverRadius: 5,
                    tension: 0.3,
                    fill: ds.fill !== undefined ? ds.fill : false,
                    ...ds.extra,
                })),
            },
            options: {
                ...defaultOptions,
                ...options,
                plugins: { ...defaultOptions.plugins, ...options.plugins },
            }
        });
        return instances[canvasId];
    }

    function createBar(canvasId, labels, datasets, options = {}) {
        destroy(canvasId);
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        instances[canvasId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: datasets.map((ds, i) => ({
                    label: ds.label,
                    data: ds.data,
                    backgroundColor: ds.colors || (ds.color || defaultColors[i]) + 'cc',
                    borderColor: ds.colors ? ds.colors.map(c => c.replace('cc', '')) : (ds.color || defaultColors[i]),
                    borderWidth: 1,
                    borderRadius: 4,
                    maxBarThickness: 40,
                    ...ds.extra,
                })),
            },
            options: {
                ...defaultOptions,
                ...options,
                plugins: { ...defaultOptions.plugins, ...options.plugins },
            }
        });
        return instances[canvasId];
    }

    function createPie(canvasId, labels, data, options = {}) {
        destroy(canvasId);
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        instances[canvasId] = new Chart(ctx, {
            type: options.doughnut ? 'doughnut' : 'pie',
            data: {
                labels,
                datasets: [{
                    data,
                    backgroundColor: defaultColors.slice(0, data.length).map(c => c + 'dd'),
                    borderColor: '#fff',
                    borderWidth: 2,
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    ...defaultOptions.plugins,
                    legend: {
                        position: options.legendPosition || 'right',
                        labels: {
                            padding: 12,
                            usePointStyle: true,
                            font: { size: 12 }
                        }
                    },
                    ...options.plugins,
                },
            }
        });
        return instances[canvasId];
    }

    function createHorizontalBar(canvasId, labels, datasets, options = {}) {
        destroy(canvasId);
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        instances[canvasId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: datasets.map((ds, i) => ({
                    label: ds.label,
                    data: ds.data,
                    backgroundColor: ds.colors || (ds.color || defaultColors[i]) + 'cc',
                    borderRadius: 4,
                    maxBarThickness: 24,
                    ...ds.extra,
                })),
            },
            options: {
                ...defaultOptions,
                indexAxis: 'y',
                ...options,
                plugins: { ...defaultOptions.plugins, ...options.plugins },
                scales: {
                    x: { grid: { color: '#f0f0f0' }, ticks: { font: { size: 11 } }, beginAtZero: true },
                    y: { grid: { display: false }, ticks: { font: { size: 12 } } }
                }
            }
        });
        return instances[canvasId];
    }

    return { createLine, createBar, createPie, createHorizontalBar, destroy, destroyAll };
})();
