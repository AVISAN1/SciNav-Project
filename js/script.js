// Получаем элементы по их идентификаторам
const topic_input = document.getElementById('1');
const ButtonInput = document.getElementById('2');
const topic = {
    title: null
}

// Добавляем обработчик события на кнопку
ButtonInput.addEventListener('click', () => {
    topic.title = topic_input.value;
    console.log(topic);
})

