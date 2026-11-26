import { getScore } from './module/score.js';
import { makeSavedSource, rememberSource } from './module/saved.js';
import { startFilters, addFilterCard, getFilterData, applyFilters } from './module/filters.js';

const ButtonInput = document.getElementById('2');
let cards = [];

const params = {
    "query": null, // Параметр для поиска
    "rows": 5, // Количество статей для вывода
    "url": "https://api.crossref.org/works?query="
};

ButtonInput.addEventListener('click', () => {
    const topic = document.getElementById('1');
    const query = topic.value;
    params.query = query; // Обновляем параметр query в объекте params

    fetch(params.url + encodeURIComponent(params.query) + '&rows=' + params.rows)
        .then(response => response.json())
        .then(data => {
            cards = []; // Очистка массива cards перед добавлением новых данных
            startFilters();
            for (let item of data.message.items) {
                for (let z in item) {
                    if (z == 'title') {
                        for (let y in item) {
                            if (y === 'author' || y === 'editor' || y === 'translator' || y === 'chair' || y === 'contributor') {
                                for (let w in item) {
                                    if (w === 'resource') {

                                        cards.push({ title: item[z][0], author: item[y][0] });
                                        const addedCard = cards.at(-1);
                                        addedCard.savedSource = makeSavedSource(addedCard.title, item[y], item.DOI);
                                        addedCard.filterData = getFilterData(item, getScore(query, [addedCard.title ?? ""]));
                                        const scores = getScore(query, cards.map(card => card.title ?? ''));

                                        

                                    }
                                }
                         }
                        }
                    }
                }
            }
          for (let card of cards) {
            let author = card.author;
            for (let key in author) {
                if (key === 'given') {
                    card.author = author[key];
                    console.log(card);}

                
                else if (key === 'name') {
                    card.author = card.author[key];
                    console.log(card);    
                }
            }

          for (const n of cards) {
             const scores = getScore(query, cards.map(card => card.title ?? ''));
    const container = document.querySelector('.Cards');
    container.insertAdjacentHTML('beforeend', `
        <article class="Card">
            <div class="Card-Head">
                <img src="assets/images/Image%20tile.svg" alt="Notebook">
                   <div class="text-head">
                    <h5>
                        ${n.title}
                    </h5>
                    <h6 class="Author">
                        ${n.author}
                    </h6>
                </div>
            </div> 
                <div class="Under-buttons">
                    <button class="add">
                        Добавить в таблицу
                    </button>
                    <button class="Export">
                        Экспорт
                    </button>
                    <p6 Class="Score">
                        ${n.filterData.score}%
                    </p6>
                </div>    
        </article>
`);
    addFilterCard(container.lastElementChild, n.filterData);
    rememberSource(container.lastElementChild, n.savedSource);
} 

          }
            applyFilters();
});



});

