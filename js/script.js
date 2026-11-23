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
            for (let item of data.message.items) {
                for (let z in item) {
                    if (z == 'title') {
                        for (let y in item) {
                            if (y === 'author' || y === 'editor' || y === 'translator' || y === 'chair' || y === 'contributor') {
                                for (let w in item) {
                                    if (w === 'resource') {
                                        cards.push({ title: item[z][0], author: item[y][0] });

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
    const container = document.querySelector('.Cards');
    container.insertAdjacentHTML('beforeend', `
        <article class="Card">
            <div class="Card-Head">
                <img src="assets\images\Image tile.svg" alt="Notebook">
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
                        8/10
                    </p6>
                </div>    
        </article>
`);
} 

          }
});



});

