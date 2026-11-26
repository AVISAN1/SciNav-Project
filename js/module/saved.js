const menu = document.querySelector('#sources-menu');
const summary = menu.querySelector('summary');
const list = document.querySelector('#sources-list');
const count = document.querySelector('#sources-count');
const empty = document.querySelector('#sources-empty');
const exportButton = document.querySelector('#sources-export');
const storageKey = 'scinav-saved-sources';
const sourceByCard = new WeakMap();

let saved = [];
try {
    const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
    if (Array.isArray(stored)) saved = stored;
} catch {
    // Список работает до перезагрузки, если браузер отключил хранилище.
}

export function makeSavedSource(title, authors = [], doi = '') {
    const author = authors.map(person =>
        person.name || [person.given, person.family].filter(Boolean).join(' ')
    ).filter(Boolean).join(', ');

    return { title: title || 'Без названия', author, doi: doi ?? '' };
}

export function rememberSource(card, source) {
    sourceByCard.set(card, source);
}

function sourceKey(source) {
    return source.doi
        ? 'doi:' + source.doi.toLowerCase()
        : 'title:' + source.title.trim().toLowerCase();
}

function updateSaved() {
    try {
        localStorage.setItem(storageKey, JSON.stringify(saved));
    } catch {
        // Продолжаем работать со списком в памяти.
    }
    renderSaved();
}

function renderSaved() {
    count.textContent = '(' + saved.length + ')';
    empty.hidden = saved.length > 0;
    exportButton.disabled = saved.length === 0;
    list.replaceChildren();

    for (const source of saved) {
        const row = document.createElement('li');
        row.textContent = source.title + (source.author ? ' — ' + source.author : '');

        const remove = document.createElement('button');
        remove.type = 'button';
        remove.textContent = 'Удалить';
        remove.addEventListener('click', () => {
            saved = saved.filter(item => sourceKey(item) !== sourceKey(source));
            updateSaved();
        });

        row.append(remove);
        list.append(row);
    }
}

function downloadText(sources) {
    const text = sources.map((source, i) => [
        (i + 1) + '. ' + source.title,
        source.author ? 'Авторы: ' + source.author : '',
        source.doi ? 'https://doi.org/' + source.doi : ''
    ].filter(Boolean).join('\r\n')).join('\r\n\r\n');

    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'scinav-sources.txt';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

document.querySelector('.Cards').addEventListener('click', event => {
    const button = event.target.closest('button.add, button.Export');
    if (!button) return;

    const card = button.closest('.Card');
    const source = sourceByCard.get(card) ?? {
        title: card.querySelector('h5').textContent.trim(),
        author: card.querySelector('.Author').textContent.trim(),
        doi: ''
    };

    if (button.classList.contains('Export')) {
        downloadText([source]);
        return;
    }

    const exists = saved.some(item => sourceKey(item) === sourceKey(source));
    if (!exists) {
        saved.push(source);
        updateSaved();
    }

    button.textContent = exists ? 'Уже в списке' : 'Добавлено';
    setTimeout(() => { button.textContent = 'Добавить в таблицу'; }, 1500);
});

exportButton.addEventListener('click', () => {
    if (saved.length) downloadText(saved);
});

menu.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.open) {
        menu.open = false;
        summary.focus();
    }
});

renderSaved();
