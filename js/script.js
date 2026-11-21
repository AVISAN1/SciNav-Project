// Получаем элементы по их идентификаторам
const topic_input = document.getElementById('1');
const ButtonInput = document.getElementById('2');
const topic = {
    title: null
}

const topic_received = {
    title: null
    authour: null
    score: null
}

// Добавляем обработчик события на кнопку
ButtonInput.addEventListener('click', () => {
    topic.title = topic_input.value;
    console.log(topic);
    fetch('https://api.crossref.org/works?' + topic.title)
        .then(response => response.json())
        .then(data => {
            console.log(data);
        });
});
