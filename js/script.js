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
            console.log(data);
            for (let item of data.message.items) {
                for (let z in item) {
                    if (z == 'title') {
                        for (let y in item) {
                            if (y === 'author' || y === 'editor' || y === 'translator' || y === 'chair' || y === 'contributor') {
                                for (let w in item) {
                                    if (w === 'resource') {
                                        cards.push({ title: item[z][0], author: item[y][0] });
                                        console.log(cards);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
});

