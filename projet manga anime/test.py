import requests

url = "https://api.jikan.moe/v4/anime?q=naruto&sfw"

response = requests.get(url)

data = response.json()

anime_list = data.get('data', [])
total_anime = len(anime_list)
    
for i, anime in enumerate(anime_list[:total_anime]):
    print(f"{i+1}. Title: {anime['title']}")