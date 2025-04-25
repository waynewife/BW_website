import requests
from bs4 import BeautifulSoup
import json

def scrape_books():
    url = 'https://books.toscrape.com/'
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    books = []

    for article in soup.find_all('article', class_='product_pod'):
        title = article.h3.a.get('title')
        price = article.find('p', class_='price_color').get_text()
        availability = article.find('p', class_='instock availability').get_text().strip()
        books.append({'title': title, 'price': price, 'availability': availability})

    with open('books.json', 'w') as f:
        json.dump(books, f, indent=2)

if __name__ == '__main__':
    scrape_books()