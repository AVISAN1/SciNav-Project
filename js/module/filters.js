const buttons = [...document.querySelectorAll('.Filters button')];
const container = document.querySelector('.Cards');
const modes = ['all', 'popular', 'recent', 'date', 'score'];

let cards = [];
let mode = 'all';
let hasResults = false;

export function startFilters() {
    cards = [];
    hasResults = true;
    container.replaceChildren();
}

export function addFilterCard(element, article) {
    cards.push({ element, ...article });
}

function dateNumber(year = 0, month = 1, day = 1) {
    return year ? year * 10000 + month * 100 + day : 0;
}

export function getFilterData(item, score) {
    const date = item.published ?? item.issued ?? item['published-online'] ?? item['published-print'];
    return {
        date: dateNumber(...(date?.['date-parts']?.[0] ?? [])),
        citations: item['is-referenced-by-count'] ?? 0,
        score
    };
}

export function applyFilters() {
    if (!hasResults) return;

    let visible = [...cards];

    if (mode === 'popular') visible.sort((a, b) => b.citations - a.citations);
    if (mode === 'date') visible.sort((a, b) => b.date - a.date);
    if (mode === 'score') visible.sort((a, b) => b.score - a.score);
    if (mode === 'recent') {
        const now = new Date();
        const earliest = dateNumber(now.getFullYear() - 1, now.getMonth() + 1, now.getDate());
        const today = dateNumber(now.getFullYear(), now.getMonth() + 1, now.getDate());
        visible = visible.filter(card => card.date >= earliest && card.date <= today);
        visible.sort((a, b) => b.date - a.date);
    }

    if (visible.length === 0) {
        const message = document.createElement('p');
        message.textContent = mode === 'recent' && cards.length
            ? 'Нет публикаций за последние 12 месяцев.'
            : 'Публикации не найдены.';
        container.replaceChildren(message);
        return;
    }

    container.replaceChildren(...visible.map(card => card.element));
}

for (const [index, button] of buttons.entries()) {
    button.setAttribute('aria-pressed', String(index === 0));
    button.addEventListener('click', () => {
        mode = modes[index] ?? 'all';
        for (const option of buttons) {
            option.setAttribute('aria-pressed', String(option === button));
        }
        applyFilters();
    });
}
