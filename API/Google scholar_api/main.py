import requests

query = "Влияние ии на дизайн"  # Замените на ваш запрос
params = {
    "query": query,
    "rows": 5, # Количество статей для вывода
    "mailto": "your-email@example.com" # Замените на свою почту
}

response = requests.get("https://api.crossref.org/works", params=params)

cards = []
a = response.json()['message']

for item in a['items']:
    for z in item:
        if z == 'title':
            for y in item:
                if y == 'author' or y == 'editor' or y == 'translator' or y == 'chair' or y == 'contributor':
                    for w in item:
                        if w == 'resource':
                            cards.append({z: item[z][0], y: item[y][0], w: item[w]})

for h in cards:
    print('-' * 50)
    for key, value in h.items():
        if type(value) == dict:
            for k, v in value.items():
                print(f"{key}: {value}")
        print(f"{key}: {value}")