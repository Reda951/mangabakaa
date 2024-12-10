from django.shortcuts import render
from django.shortcuts import render, redirect
from .forms import RegisterForm


import requests
import time

def home(request):
    base_url = "https://api.jikan.moe/v4/anime"
    page = int(request.GET.get('page', 1))  # Page actuelle
    per_page = 20  # Nombre d'animes par page

    # Requête pour récupérer les animes en cours de diffusion, triés par popularité décroissante
    response = requests.get(
        f"{base_url}?status=airing&order_by=popularity&sort=desc&page={page}&limit={per_page}"
    )
    data = response.json()

    # Récupération des données et gestion des erreurs
    anime_list = data.get('data', [])  # Liste des animes
    pagination = data.get('pagination', {})  # Informations sur la pagination

    context = {
        'anime_list': anime_list,          # Liste des animes populaires en cours de diffusion
        'current_page': page,             # Page actuelle
        'has_next_page': pagination.get('has_next_page', False),  # Page suivante disponible
        'has_prev_page': page > 1,        # Page précédente disponible
    }

    return render(request, 'animes.html', context)


def search_anime(request):
    query = request.GET.get('q')  
    anime_list = []

    if query:
        base_url = "https://api.jikan.moe/v4/anime"
        response = requests.get(f"{base_url}?q={query}&order_by=score&sort=desc")
        data = response.json()
        anime_list = data.get('data', [])  

    context = {
        'anime_list': anime_list,
        'query': query,  
    }
    
    return render(request, 'search_results.html', context)






def apropos(request):
    return render(request, 'apropos.html')

def contact(request):
    return render(request, 'contact.html')

def faq(request):
    return render(request, 'faq.html')
