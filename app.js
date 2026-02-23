/**
 * Emotional Mastery - Participant Portal
 * Action Items Tracker, Progress Reports & Reminders
 */

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    // =====================
    // DATA LAYER
    // =====================
    const STORAGE_KEYS = {
        USER: 'em_user',
        ACTION_ITEMS: 'em_action_items',
        ACTIVITY_LOG: 'em_activity_log',
        REMINDERS: 'em_reminders'
    };

    // Default action items seeded per module
    const DEFAULT_ACTION_ITEMS = [
        // Module 1: Emotional Intelligence
        {
            id: generateId(),
            title: 'Practice the 6-Second Pause before responding in stressful conversations',
            module: 'emotional-intelligence',
            priority: 'high',
            status: 'not-started',
            dueDate: getFutureDate(7),
            notes: '',
            createdAt: new Date().toISOString(),
            completedAt: null
        },
        {
            id: generateId(),
            title: 'Identify and journal 3 emotional triggers from the past week',
            module: 'emotional-intelligence',
            priority: 'high',
            status: 'not-started',
            dueDate: getFutureDate(5),
            notes: '',
            createdAt: new Date().toISOString(),
            completedAt: null
        },
        {
            id: generateId(),
            title: 'Complete the self-awareness assessment from the workbook',
            module: 'emotional-intelligence',
            priority: 'medium',
            status: 'not-started',
            dueDate: getFutureDate(10),
            notes: '',
            createdAt: new Date().toISOString(),
            completedAt: null
        },
        {
            id: generateId(),
            title: 'Schedule a 15-minute weekly reflection session on your calendar',
            module: 'emotional-intelligence',
            priority: 'medium',
            status: 'not-started',
            dueDate: getFutureDate(3),
            notes: '',
            createdAt: new Date().toISOString(),
            completedAt: null
        },
        // Module 2: Anger Management
        {
            id: generateId(),
            title: 'Practice Box Breathing (4-4-4-4) daily for one week',
            module: 'anger-management',
            priority: 'high',
            status: 'not-started',
            dueDate: getFutureDate(7),
            notes: '',
            createdAt: new Date().toISOString(),
            completedAt: null
        },
        {
            id: generateId(),
            title: 'Apply the ABCDE Cognitive Restructuring model to a recent frustration',
            module: 'anger-management',
            priority: 'high',
            status: 'not-started',
            dueDate: getFutureDate(10),
            notes: '',
            createdAt: new Date().toISOString(),
            completedAt: null
        },
        {
            id: generateId(),
            title: 'Map your personal anger iceberg: identify 3 emotions beneath your anger',
            module: 'anger-management',
            priority: 'medium',
            status: 'not-started',
            dueDate: getFutureDate(14),
            notes: '',
            createdAt: new Date().toISOString(),
            completedAt: null
        },
        {
            id: generateId(),
            title: 'Create a personal anger response plan for high-stress situations',
            module: 'anger-management',
            priority: 'medium',
            status: 'not-started',
            dueDate: getFutureDate(21),
            notes: '',
            createdAt: new Date().toISOString(),
            completedAt: null
        },
        // Module 3: Conflict Resolution
        {
            id: generateId(),
            title: 'Write a DESC script for a current workplace friction point',
            module: 'conflict-resolution',
            priority: 'high',
            status: 'not-started',
            dueDate: getFutureDate(7),
            notes: '',
            createdAt: new Date().toISOString(),
            completedAt: null
        },
        {
            id: generateId(),
            title: 'Identify your default Thomas-Kilmann conflict style and journal about it',
            module: 'conflict-resolution',
            priority: 'medium',
            status: 'not-started',
            dueDate: getFutureDate(10),
            notes: '',
            createdAt: new Date().toISOString(),
            completedAt: null
        },
        {
            id: generateId(),
            title: 'Practice active listening in 3 conversations this week (no interrupting)',
            module: 'conflict-resolution',
            priority: 'high',
            status: 'not-started',
            dueDate: getFutureDate(7),
            notes: '',
            createdAt: new Date().toISOString(),
            completedAt: null
        },
        {
            id: generateId(),
            title: 'Use collaborative conflict style in at least one team disagreement',
            module: 'conflict-resolution',
            priority: 'medium',
            status: 'not-started',
            dueDate: getFutureDate(21),
            notes: '',
            createdAt: new Date().toISOString(),
            completedAt: null
        }
    ];

    const MODULE_META = {
        'emotional-intelligence': {
            name: 'Emotional Intelligence',
            dotColor: 'blue',
            barColor: 'var(--primary)',
            iconBg: 'bg-blue',
            icon: 'brain'
        },
        'anger-management': {
            name: 'Anger Management',
            dotColor: 'red',
            barColor: 'var(--red)',
            iconBg: 'bg-red',
            icon: 'flame'
        },
        'conflict-resolution': {
            name: 'Conflict Resolution',
            dotColor: 'teal',
            barColor: 'var(--teal)',
            iconBg: 'bg-teal',
            icon: 'shield-check'
        },
        'custom': {
            name: 'Custom / General',
            dotColor: 'purple',
            barColor: 'var(--purple)',
            iconBg: 'bg-purple',
            icon: 'star'
        }
    };

    function generateId() {
        return 'item_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
    }

    function getFutureDate(days) {
        const d = new Date();
        d.setDate(d.getDate() + days);
        return d.toISOString().split('T')[0];
    }

    function loadData(key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch {
            return fallback;
        }
    }

    function saveData(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    // =====================
    // STATE
    // =====================
    let currentUser = loadData(STORAGE_KEYS.USER, null);
    let actionItems = loadData(STORAGE_KEYS.ACTION_ITEMS, []);
    let activityLog = loadData(STORAGE_KEYS.ACTIVITY_LOG, []);
    let reminderSettings = loadData(STORAGE_KEYS.REMINDERS, {
        daily: true,
        dailyTime: '09:00',
        weekly: true,
        weeklyDay: 5,
        overdue: true
    });
    let currentFilter = 'all';
    let editingItemId = null;
    let updatingItemId = null;
    let reminderIntervalId = null;

    // =====================
    // DOM REFS
    // =====================
    const loginScreen = document.getElementById('login-screen');
    const appEl = document.getElementById('app');
    const loginForm = document.getElementById('login-form');

    // =====================
    // INIT
    // =====================
    if (currentUser) {
        showApp();
    }

    // =====================
    // LOGIN
    // =====================
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('login-name').value.trim();
        const email = document.getElementById('login-email').value.trim();
        const training = document.getElementById('login-training').value;

        if (!name || !email || !training) return;

        currentUser = {
            name,
            email,
            training,
            loginDate: new Date().toISOString()
        };

        saveData(STORAGE_KEYS.USER, currentUser);

        // Seed default items if first login
        if (actionItems.length === 0) {
            actionItems = DEFAULT_ACTION_ITEMS.map(item => ({
                ...item,
                id: generateId(),
                createdAt: new Date().toISOString()
            }));
            saveData(STORAGE_KEYS.ACTION_ITEMS, actionItems);
            addActivity('Logged in and started the 30-day action plan', 'blue');
        }

        showApp();
    });

    document.getElementById('btn-logout').addEventListener('click', () => {
        currentUser = null;
        localStorage.removeItem(STORAGE_KEYS.USER);
        if (reminderIntervalId) clearInterval(reminderIntervalId);
        loginScreen.classList.remove('hidden');
        appEl.classList.add('hidden');
        loginForm.reset();
    });

    function showApp() {
        loginScreen.classList.add('hidden');
        appEl.classList.remove('hidden');
        lucide.createIcons();

        document.getElementById('user-display-name').textContent = currentUser.name.split(' ')[0];
        document.getElementById('dashboard-name').textContent = currentUser.name.split(' ')[0];

        // Calculate days since training
        const loginDate = new Date(currentUser.loginDate);
        const today = new Date();
        const daysSince = Math.max(1, Math.floor((today - loginDate) / (1000 * 60 * 60 * 24)) + 1);
        document.getElementById('days-since-training').textContent = `Day ${daysSince} of 30`;

        loadReminderSettings();
        renderAll();
        startReminderChecker();
    }

    // =====================
    // NAVIGATION
    // =====================
    const sidebarLinks = document.querySelectorAll('.sidebar-link[data-view]');
    const mobileTabs = document.querySelectorAll('.mobile-tab[data-view]');
    const views = document.querySelectorAll('.view');
    const linkBtns = document.querySelectorAll('.link-btn[data-view]');

    function switchView(viewId) {
        views.forEach(v => v.classList.remove('active'));
        document.getElementById('view-' + viewId)?.classList.add('active');

        sidebarLinks.forEach(l => l.classList.toggle('active', l.dataset.view === viewId));
        mobileTabs.forEach(t => t.classList.toggle('active', t.dataset.view === viewId));

        renderAll();
    }

    sidebarLinks.forEach(link => link.addEventListener('click', () => switchView(link.dataset.view)));
    mobileTabs.forEach(tab => tab.addEventListener('click', () => switchView(tab.dataset.view)));
    linkBtns.forEach(btn => btn.addEventListener('click', () => switchView(btn.dataset.view)));

    // =====================
    // RENDER ALL
    // =====================
    function renderAll() {
        renderStats();
        renderProgressBar();
        renderDashboardUpcoming();
        renderDashboardActivity();
        renderActionItems();
        renderModuleProgress();
        renderTimeline();
        renderReflections();
        renderScheduledReminders();
        lucide.createIcons();
    }

    // =====================
    // STATS
    // =====================
    function renderStats() {
        const today = new Date().toISOString().split('T')[0];
        const total = actionItems.length;
        const completed = actionItems.filter(i => i.status === 'completed').length;
        const inProgress = actionItems.filter(i => i.status === 'in-progress').length;
        const overdue = actionItems.filter(i => i.status !== 'completed' && i.dueDate < today).length;

        document.getElementById('stat-total').textContent = total;
        document.getElementById('stat-completed').textContent = completed;
        document.getElementById('stat-in-progress').textContent = inProgress;
        document.getElementById('stat-overdue').textContent = overdue;
    }

    function renderProgressBar() {
        const total = actionItems.length;
        const completed = actionItems.filter(i => i.status === 'completed').length;
        const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

        document.getElementById('progress-percent').textContent = percent + '%';
        document.getElementById('progress-bar-fill').style.width = percent + '%';
    }

    // =====================
    // DASHBOARD
    // =====================
    function renderDashboardUpcoming() {
        const container = document.getElementById('dashboard-upcoming');
        const today = new Date().toISOString().split('T')[0];
        const upcoming = actionItems
            .filter(i => i.status !== 'completed')
            .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
            .slice(0, 5);

        if (upcoming.length === 0) {
            container.innerHTML = `<div class="empty-state"><i data-lucide="check-circle-2"></i><p>All caught up! Great work.</p></div>`;
            return;
        }

        container.innerHTML = upcoming.map(item => renderActionItemRow(item, today)).join('');
        attachActionItemListeners(container);
    }

    function renderDashboardActivity() {
        const container = document.getElementById('dashboard-activity');
        const recent = activityLog.slice(-10).reverse();

        if (recent.length === 0) {
            container.innerHTML = `<div class="empty-state"><i data-lucide="clock"></i><p>No activity yet. Start completing action items!</p></div>`;
            return;
        }

        container.innerHTML = recent.map(a => `
            <div class="activity-item">
                <div class="activity-dot ${a.color}"></div>
                <div>
                    <div class="activity-text">${a.text}</div>
                    <div class="activity-time">${formatRelativeTime(a.timestamp)}</div>
                </div>
            </div>
        `).join('');
    }

    // =====================
    // ACTION ITEMS
    // =====================
    function renderActionItems() {
        const container = document.getElementById('action-items-container');
        const today = new Date().toISOString().split('T')[0];

        let filtered = [...actionItems];
        if (currentFilter === 'not-started') {
            filtered = filtered.filter(i => i.status === 'not-started');
        } else if (currentFilter === 'in-progress') {
            filtered = filtered.filter(i => i.status === 'in-progress');
        } else if (currentFilter === 'completed') {
            filtered = filtered.filter(i => i.status === 'completed');
        } else if (currentFilter === 'overdue') {
            filtered = filtered.filter(i => i.status !== 'completed' && i.dueDate < today);
        }

        // Group by module
        const grouped = {};
        filtered.forEach(item => {
            if (!grouped[item.module]) grouped[item.module] = [];
            grouped[item.module].push(item);
        });

        if (filtered.length === 0) {
            container.innerHTML = `<div class="empty-state"><i data-lucide="inbox"></i><p>No action items match this filter.</p></div>`;
            return;
        }

        let html = '';
        for (const [moduleKey, items] of Object.entries(grouped)) {
            const meta = MODULE_META[moduleKey] || MODULE_META['custom'];
            html += `
                <div class="module-section">
                    <div class="module-section-header">
                        <div class="module-dot ${meta.dotColor}"></div>
                        <h3 class="module-section-title">${meta.name}</h3>
                        <span class="module-section-count">${items.length} item${items.length !== 1 ? 's' : ''}</span>
                    </div>
                    <div class="action-list">
                        ${items.map(item => renderActionItemRow(item, today)).join('')}
                    </div>
                </div>
            `;
        }

        container.innerHTML = html;
        attachActionItemListeners(container);
    }

    function renderActionItemRow(item, today) {
        const isOverdue = item.status !== 'completed' && item.dueDate < today;
        const checkClass = item.status === 'completed' ? 'completed' : item.status === 'in-progress' ? 'in-progress' : '';
        const checkIcon = item.status === 'completed' ? 'check' : item.status === 'in-progress' ? 'loader' : 'circle';
        const statusClass = isOverdue ? 'status-overdue' : `status-${item.status}`;
        const statusLabel = isOverdue ? 'Overdue' : item.status.replace('-', ' ').replace(/^\w/, c => c.toUpperCase()).replace(' ', ' ');

        return `
            <div class="action-item ${item.status === 'completed' ? 'status-completed' : ''}" data-id="${item.id}">
                <button class="action-item-check ${checkClass}" data-action="toggle-status" data-id="${item.id}">
                    <i data-lucide="${checkIcon}"></i>
                </button>
                <div class="action-item-body" data-action="update" data-id="${item.id}">
                    <span class="action-item-title">${escapeHtml(item.title)}</span>
                    <div class="action-item-meta">
                        <span><i data-lucide="calendar"></i> ${formatDate(item.dueDate)}</span>
                        <span class="priority-badge priority-${item.priority}">${item.priority}</span>
                        <span class="status-badge ${statusClass}">${statusLabel}</span>
                    </div>
                </div>
                <div class="action-item-actions">
                    <button class="item-action-btn" data-action="edit" data-id="${item.id}" title="Edit">
                        <i data-lucide="pencil"></i>
                    </button>
                    <button class="item-action-btn delete" data-action="delete" data-id="${item.id}" title="Delete">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
            </div>
        `;
    }

    function attachActionItemListeners(container) {
        container.querySelectorAll('[data-action="toggle-status"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.dataset.id;
                const item = actionItems.find(i => i.id === id);
                if (!item) return;

                // Cycle: not-started -> in-progress -> completed -> not-started
                if (item.status === 'not-started') {
                    item.status = 'in-progress';
                    addActivity(`Started: <strong>${escapeHtml(item.title)}</strong>`, 'amber');
                } else if (item.status === 'in-progress') {
                    item.status = 'completed';
                    item.completedAt = new Date().toISOString();
                    addActivity(`Completed: <strong>${escapeHtml(item.title)}</strong>`, 'green');
                    showToast('Action item completed!', 'success');
                } else {
                    item.status = 'not-started';
                    item.completedAt = null;
                }

                saveData(STORAGE_KEYS.ACTION_ITEMS, actionItems);
                renderAll();
            });
        });

        container.querySelectorAll('[data-action="update"]').forEach(el => {
            el.addEventListener('click', () => {
                const id = el.dataset.id;
                openUpdateStatusModal(id);
            });
        });

        container.querySelectorAll('[data-action="edit"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                openEditModal(btn.dataset.id);
            });
        });

        container.querySelectorAll('[data-action="delete"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.dataset.id;
                const item = actionItems.find(i => i.id === id);
                if (item && confirm(`Delete "${item.title}"?`)) {
                    actionItems = actionItems.filter(i => i.id !== id);
                    saveData(STORAGE_KEYS.ACTION_ITEMS, actionItems);
                    addActivity(`Removed: <strong>${escapeHtml(item.title)}</strong>`, 'amber');
                    renderAll();
                    showToast('Action item deleted', 'info');
                }
            });
        });
    }

    // Filters
    document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            currentFilter = chip.dataset.filter;
            renderActionItems();
            lucide.createIcons();
        });
    });

    // =====================
    // ADD/EDIT MODAL
    // =====================
    const modalActionItem = document.getElementById('modal-action-item');
    const formActionItem = document.getElementById('form-action-item');

    document.getElementById('btn-add-item').addEventListener('click', () => {
        editingItemId = null;
        document.getElementById('modal-action-title').textContent = 'Add Custom Action Item';
        document.getElementById('modal-save-btn').innerHTML = '<i data-lucide="save"></i> Save Item';
        formActionItem.reset();
        document.getElementById('item-due').value = getFutureDate(7);
        openModal('modal-action-item');
    });

    function openEditModal(id) {
        const item = actionItems.find(i => i.id === id);
        if (!item) return;

        editingItemId = id;
        document.getElementById('modal-action-title').textContent = 'Edit Action Item';
        document.getElementById('modal-save-btn').innerHTML = '<i data-lucide="save"></i> Update Item';
        document.getElementById('item-title').value = item.title;
        document.getElementById('item-module').value = item.module;
        document.getElementById('item-priority').value = item.priority;
        document.getElementById('item-due').value = item.dueDate;
        document.getElementById('item-notes').value = item.notes || '';
        document.getElementById('item-id').value = id;
        openModal('modal-action-item');
    }

    formActionItem.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('item-title').value.trim();
        const module = document.getElementById('item-module').value;
        const priority = document.getElementById('item-priority').value;
        const dueDate = document.getElementById('item-due').value;
        const notes = document.getElementById('item-notes').value.trim();

        if (!title || !dueDate) return;

        if (editingItemId) {
            const item = actionItems.find(i => i.id === editingItemId);
            if (item) {
                item.title = title;
                item.module = module;
                item.priority = priority;
                item.dueDate = dueDate;
                item.notes = notes;
                addActivity(`Updated: <strong>${escapeHtml(title)}</strong>`, 'blue');
                showToast('Action item updated', 'success');
            }
        } else {
            const newItem = {
                id: generateId(),
                title,
                module,
                priority,
                status: 'not-started',
                dueDate,
                notes,
                createdAt: new Date().toISOString(),
                completedAt: null
            };
            actionItems.push(newItem);
            addActivity(`Added: <strong>${escapeHtml(title)}</strong>`, 'blue');
            showToast('Action item added', 'success');
        }

        saveData(STORAGE_KEYS.ACTION_ITEMS, actionItems);
        closeModal('modal-action-item');
        renderAll();
    });

    // =====================
    // UPDATE STATUS MODAL
    // =====================
    function openUpdateStatusModal(id) {
        const item = actionItems.find(i => i.id === id);
        if (!item) return;

        updatingItemId = id;
        document.getElementById('update-item-name').textContent = item.title;
        document.getElementById('update-reflection').value = item.notes || '';

        const statusOptions = document.querySelectorAll('.status-option');
        statusOptions.forEach(opt => {
            opt.classList.toggle('selected', opt.dataset.status === item.status);
        });

        openModal('modal-update-status');
    }

    document.querySelectorAll('.status-option').forEach(opt => {
        opt.addEventListener('click', () => {
            document.querySelectorAll('.status-option').forEach(o => o.classList.remove('selected'));
            opt.classList.add('selected');
        });
    });

    document.getElementById('btn-confirm-update').addEventListener('click', () => {
        if (!updatingItemId) return;

        const item = actionItems.find(i => i.id === updatingItemId);
        if (!item) return;

        const selectedStatus = document.querySelector('.status-option.selected');
        if (selectedStatus) {
            const newStatus = selectedStatus.dataset.status;
            const oldStatus = item.status;
            item.status = newStatus;

            if (newStatus === 'completed' && oldStatus !== 'completed') {
                item.completedAt = new Date().toISOString();
                addActivity(`Completed: <strong>${escapeHtml(item.title)}</strong>`, 'green');
                showToast('Action item completed!', 'success');
            } else if (newStatus === 'in-progress' && oldStatus !== 'in-progress') {
                addActivity(`Started working on: <strong>${escapeHtml(item.title)}</strong>`, 'amber');
            } else if (newStatus === 'not-started') {
                item.completedAt = null;
            }
        }

        const reflection = document.getElementById('update-reflection').value.trim();
        if (reflection) {
            item.notes = reflection;
            if (reflection !== item.notes) {
                addActivity(`Added reflection on: <strong>${escapeHtml(item.title)}</strong>`, 'blue');
            }
        }

        saveData(STORAGE_KEYS.ACTION_ITEMS, actionItems);
        closeModal('modal-update-status');
        renderAll();
    });

    // =====================
    // PROGRESS REPORT
    // =====================
    function renderModuleProgress() {
        const container = document.getElementById('module-progress-container');
        let html = '';

        for (const [key, meta] of Object.entries(MODULE_META)) {
            const items = actionItems.filter(i => i.module === key);
            if (items.length === 0 && key === 'custom') continue;

            const completed = items.filter(i => i.status === 'completed').length;
            const percent = items.length > 0 ? Math.round((completed / items.length) * 100) : 0;

            // Map icon bg colors
            const iconBgStyle = {
                'bg-blue': `background: var(--primary-muted); color: var(--primary-light);`,
                'bg-red': `background: var(--red-muted); color: var(--red);`,
                'bg-teal': `background: var(--teal-muted); color: var(--teal);`,
                'bg-purple': `background: var(--purple-muted); color: var(--purple);`
            }[meta.iconBg] || '';

            html += `
                <div class="module-progress-card">
                    <div class="module-progress-header">
                        <div class="module-progress-icon" style="${iconBgStyle}">
                            <i data-lucide="${meta.icon}"></i>
                        </div>
                        <div class="module-progress-name">${meta.name}</div>
                    </div>
                    <div class="module-progress-stats">
                        <span>${completed} of ${items.length} completed</span>
                        <span>${percent}%</span>
                    </div>
                    <div class="module-progress-bar">
                        <div class="module-progress-fill" style="width: ${percent}%; background: ${meta.barColor};"></div>
                    </div>
                </div>
            `;
        }

        container.innerHTML = html;
    }

    function renderTimeline() {
        const container = document.getElementById('timeline-chart');

        // Group completed items by week
        const loginDate = currentUser ? new Date(currentUser.loginDate) : new Date();
        const weeks = [
            { label: 'Week 1', start: 0, end: 7 },
            { label: 'Week 2', start: 7, end: 14 },
            { label: 'Week 3', start: 14, end: 21 },
            { label: 'Week 4', start: 21, end: 30 }
        ];

        const total = actionItems.length || 1;
        const colors = ['var(--primary)', 'var(--purple)', 'var(--teal)', 'var(--green)'];

        let html = '';
        weeks.forEach((week, idx) => {
            const weekStart = new Date(loginDate);
            weekStart.setDate(weekStart.getDate() + week.start);
            const weekEnd = new Date(loginDate);
            weekEnd.setDate(weekEnd.getDate() + week.end);

            const completedInWeek = actionItems.filter(item => {
                if (!item.completedAt) return false;
                const completedDate = new Date(item.completedAt);
                return completedDate >= weekStart && completedDate < weekEnd;
            }).length;

            const dueInWeek = actionItems.filter(item => {
                const dueDate = new Date(item.dueDate);
                return dueDate >= weekStart && dueDate < weekEnd;
            }).length;

            const percent = Math.round((completedInWeek / Math.max(dueInWeek, 1)) * 100);
            const barWidth = Math.max(dueInWeek > 0 ? percent : 0, 2);

            html += `
                <div class="timeline-bar-row">
                    <div class="timeline-bar-label">${week.label}</div>
                    <div class="timeline-bar-track">
                        <div class="timeline-bar-fill" style="width: ${barWidth}%; background: ${colors[idx]};">
                            ${completedInWeek > 0 ? `${completedInWeek}/${dueInWeek}` : ''}
                        </div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    function renderReflections() {
        const container = document.getElementById('reflections-list');
        const withNotes = actionItems.filter(i => i.notes && i.notes.trim().length > 0);

        if (withNotes.length === 0) {
            container.innerHTML = `<div class="empty-state"><i data-lucide="pen-line"></i><p>No reflections yet. Add notes to your action items to see them here.</p></div>`;
            return;
        }

        container.innerHTML = withNotes.map(item => `
            <div class="reflection-item">
                <div class="reflection-item-title">${escapeHtml(item.title)}</div>
                <div class="reflection-item-text">"${escapeHtml(item.notes)}"</div>
                <div class="reflection-item-date">${MODULE_META[item.module]?.name || 'General'} &bull; Due ${formatDate(item.dueDate)}</div>
            </div>
        `).join('');
    }

    // Export Report
    document.getElementById('btn-export-report').addEventListener('click', () => {
        const total = actionItems.length;
        const completed = actionItems.filter(i => i.status === 'completed').length;
        const inProgress = actionItems.filter(i => i.status === 'in-progress').length;
        const notStarted = actionItems.filter(i => i.status === 'not-started').length;
        const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

        let report = `EMOTIONAL MASTERY - PROGRESS REPORT\n`;
        report += `========================================\n`;
        report += `Participant: ${currentUser.name}\n`;
        report += `Email: ${currentUser.email}\n`;
        report += `Training: ${currentUser.training}\n`;
        report += `Report Date: ${new Date().toLocaleDateString()}\n\n`;
        report += `OVERALL PROGRESS: ${percent}% (${completed}/${total} items completed)\n`;
        report += `In Progress: ${inProgress} | Not Started: ${notStarted}\n\n`;

        for (const [key, meta] of Object.entries(MODULE_META)) {
            const items = actionItems.filter(i => i.module === key);
            if (items.length === 0) continue;

            const modCompleted = items.filter(i => i.status === 'completed').length;
            report += `${meta.name.toUpperCase()} (${modCompleted}/${items.length})\n`;
            report += `----------------------------------------\n`;
            items.forEach(item => {
                const statusSymbol = item.status === 'completed' ? '[x]' : item.status === 'in-progress' ? '[~]' : '[ ]';
                report += `  ${statusSymbol} ${item.title}\n`;
                report += `      Due: ${item.dueDate} | Priority: ${item.priority}\n`;
                if (item.notes) {
                    report += `      Notes: ${item.notes}\n`;
                }
            });
            report += `\n`;
        }

        report += `========================================\n`;
        report += `Generated by Emotional Mastery Portal\n`;

        const blob = new Blob([report], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `progress-report-${new Date().toISOString().split('T')[0]}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('Progress report downloaded', 'success');
    });

    // =====================
    // REMINDERS
    // =====================
    function loadReminderSettings() {
        const settings = loadData(STORAGE_KEYS.REMINDERS, reminderSettings);
        reminderSettings = settings;

        document.getElementById('toggle-daily-reminder').checked = settings.daily;
        document.getElementById('daily-reminder-time').value = settings.dailyTime || '09:00';
        document.getElementById('toggle-weekly-reminder').checked = settings.weekly;
        document.getElementById('weekly-reminder-day').value = settings.weeklyDay ?? 5;
        document.getElementById('toggle-overdue-reminder').checked = settings.overdue;

        updateNotificationCard();
    }

    function updateNotificationCard() {
        const card = document.getElementById('notification-permission-card');
        if ('Notification' in window && Notification.permission === 'granted') {
            card.style.display = 'none';
        }
    }

    document.getElementById('btn-save-reminders').addEventListener('click', () => {
        reminderSettings = {
            daily: document.getElementById('toggle-daily-reminder').checked,
            dailyTime: document.getElementById('daily-reminder-time').value,
            weekly: document.getElementById('toggle-weekly-reminder').checked,
            weeklyDay: parseInt(document.getElementById('weekly-reminder-day').value, 10),
            overdue: document.getElementById('toggle-overdue-reminder').checked
        };
        saveData(STORAGE_KEYS.REMINDERS, reminderSettings);
        renderScheduledReminders();
        showToast('Reminder settings saved', 'success');
    });

    function requestNotificationPermission() {
        if (!('Notification' in window)) {
            showToast('Your browser does not support notifications', 'warning');
            return;
        }
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                showToast('Notifications enabled!', 'success');
                updateNotificationCard();
                new Notification('Emotional Mastery', {
                    body: 'You will now receive reminders for your action items.',
                    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">⚡</text></svg>'
                });
            } else {
                showToast('Notification permission denied', 'warning');
            }
        });
    }

    document.getElementById('btn-request-notifications')?.addEventListener('click', requestNotificationPermission);
    document.getElementById('btn-enable-notifications')?.addEventListener('click', requestNotificationPermission);

    function sendNotification(title, body) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, {
                body,
                icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">⚡</text></svg>'
            });
        }
    }

    function startReminderChecker() {
        if (reminderIntervalId) clearInterval(reminderIntervalId);

        // Check every minute
        reminderIntervalId = setInterval(() => {
            const now = new Date();
            const currentTime = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
            const today = now.toISOString().split('T')[0];

            // Daily reminder
            if (reminderSettings.daily && currentTime === reminderSettings.dailyTime) {
                const pending = actionItems.filter(i => i.status !== 'completed').length;
                if (pending > 0) {
                    sendNotification('Emotional Mastery - Daily Check-in',
                        `You have ${pending} action item${pending !== 1 ? 's' : ''} to work on today. Keep building those habits!`);
                }
            }

            // Weekly reminder
            if (reminderSettings.weekly && now.getDay() === reminderSettings.weeklyDay && currentTime === '10:00') {
                const completed = actionItems.filter(i => i.status === 'completed').length;
                const total = actionItems.length;
                const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
                sendNotification('Emotional Mastery - Weekly Progress',
                    `Weekly summary: ${percent}% complete (${completed}/${total} items). Keep up the momentum!`);
            }

            // Overdue alerts (check at noon)
            if (reminderSettings.overdue && currentTime === '12:00') {
                const overdue = actionItems.filter(i => i.status !== 'completed' && i.dueDate < today);
                if (overdue.length > 0) {
                    sendNotification('Emotional Mastery - Overdue Items',
                        `${overdue.length} action item${overdue.length !== 1 ? 's are' : ' is'} overdue. Review your tasks and update your progress.`);
                }
            }
        }, 60000); // 1 minute
    }

    function renderScheduledReminders() {
        const container = document.getElementById('scheduled-reminders-list');
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        let html = '';

        html += `
            <div class="reminder-row">
                <div class="reminder-row-icon" style="background: var(--primary-muted); color: var(--primary-light);">
                    <i data-lucide="sun"></i>
                </div>
                <div class="reminder-row-text">
                    <div class="reminder-row-title">Daily Check-in</div>
                    <div class="reminder-row-desc">Every day at ${reminderSettings.dailyTime || '09:00'}</div>
                </div>
                <span class="reminder-row-status ${reminderSettings.daily ? 'reminder-active' : 'reminder-inactive'}">
                    ${reminderSettings.daily ? 'Active' : 'Off'}
                </span>
            </div>
        `;

        html += `
            <div class="reminder-row">
                <div class="reminder-row-icon" style="background: var(--purple-muted); color: var(--purple);">
                    <i data-lucide="calendar-check"></i>
                </div>
                <div class="reminder-row-text">
                    <div class="reminder-row-title">Weekly Progress Report</div>
                    <div class="reminder-row-desc">Every ${days[reminderSettings.weeklyDay ?? 5]} at 10:00 AM</div>
                </div>
                <span class="reminder-row-status ${reminderSettings.weekly ? 'reminder-active' : 'reminder-inactive'}">
                    ${reminderSettings.weekly ? 'Active' : 'Off'}
                </span>
            </div>
        `;

        html += `
            <div class="reminder-row">
                <div class="reminder-row-icon" style="background: var(--red-muted); color: var(--red);">
                    <i data-lucide="alert-triangle"></i>
                </div>
                <div class="reminder-row-text">
                    <div class="reminder-row-title">Overdue Item Alerts</div>
                    <div class="reminder-row-desc">Daily at 12:00 PM when items are past due</div>
                </div>
                <span class="reminder-row-status ${reminderSettings.overdue ? 'reminder-active' : 'reminder-inactive'}">
                    ${reminderSettings.overdue ? 'Active' : 'Off'}
                </span>
            </div>
        `;

        container.innerHTML = html;
    }

    // =====================
    // MODAL UTILITIES
    // =====================
    function openModal(id) {
        document.getElementById(id).classList.add('open');
        lucide.createIcons();
    }

    function closeModal(id) {
        document.getElementById(id).classList.remove('open');
    }

    // Close modal buttons
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
        btn.addEventListener('click', () => closeModal(btn.dataset.closeModal));
    });

    // Close modal on overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('open');
            }
        });
    });

    // =====================
    // ACTIVITY LOG
    // =====================
    function addActivity(text, color) {
        activityLog.push({
            text,
            color: color || 'blue',
            timestamp: new Date().toISOString()
        });
        // Keep only last 50 entries
        if (activityLog.length > 50) {
            activityLog = activityLog.slice(-50);
        }
        saveData(STORAGE_KEYS.ACTIVITY_LOG, activityLog);
    }

    // =====================
    // TOAST NOTIFICATIONS
    // =====================
    function showToast(message, type) {
        const container = document.getElementById('toast-container');
        const iconMap = {
            success: 'check-circle-2',
            info: 'info',
            warning: 'alert-triangle'
        };
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
            <i data-lucide="${iconMap[type] || 'info'}" class="toast-icon ${type}"></i>
            <span class="toast-message">${message}</span>
        `;
        container.appendChild(toast);
        lucide.createIcons();

        setTimeout(() => {
            toast.classList.add('toast-out');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // =====================
    // UTILITIES
    // =====================
    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function formatDate(dateStr) {
        const date = new Date(dateStr + 'T00:00:00');
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    function formatRelativeTime(isoStr) {
        const now = new Date();
        const then = new Date(isoStr);
        const diffMs = now - then;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays}d ago`;
        return then.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
});
