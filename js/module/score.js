export function getScore(input_topic, topics) {
    let topics_lower = []
    const results = [];
    for (let x of topics){
        topics_lower.push(x.toLowerCase());
    }
    const stopWords = ['и', 'или', 'а', 'но', 'в', 'на', 'по', 'с', 'из', 'для', 'о', 'об', 'к'];

    let count = 0;

    const queryWords = input_topic.toLowerCase().trim().split(/\s+/);

    // Очищаем запрос один раз перед сравнением.
    for (const z of [...stopWords, '']) {
        let index = queryWords.indexOf(z);
        while (index !== -1) {
            queryWords.splice(index, 1);
            index = queryWords.indexOf(z);
        }
    }

    for (const y of topics_lower) {
        const list_of_topics = y.split(/\s+/);
        let count = 0;

        for (const g of queryWords) {
            for (const n of list_of_topics) {
            if (g === n) {
                count++;
                break;
            }
        }
    }

    const score = queryWords.length
        ? Math.round(count / queryWords.length * 100)
        : 0;

    results.push(score);
}
return results[0];
}