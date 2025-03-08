from flask import Flask, request, jsonify
from flask_cors import CORS
from scrapy.crawler import CrawlerProcess
from scrapy.utils.project import get_project_settings
from scrapy.signalmanager import dispatcher
from scraper.scraper.spiders.my_spider import MySpider
from scrapy import signals
import requests
import os
import time
import threading

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

scraped_data = []

# ✅ Collecting scraped data from Scrapy
def crawler_results(signal, sender, item, response, spider):
    scraped_data.append(dict(item))

dispatcher.connect(crawler_results, signal=signals.item_scraped)

# ✅ Function to run Scrapy spider from Flask
def run_scrapy_spider(url):
    global scraped_data
    scraped_data.clear()
    
    # ✅ Using CrawlerProcess instead of CrawlerRunner
    process = CrawlerProcess(get_project_settings())
    process.crawl(MySpider, url=url)
    process.start(stop_after_crawl=False)

# ✅ Function to summarize content using Groq API
def generate_summary(scraped_data):
    url = "https://api.groq.com/openai/v1/chat/completions"
    api_key = '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'

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }

    payload = {
        "model": "llama-3.3-70b-versatile",
        "messages": [{
            "role": "user",
            "content": f"Summarize the following content and give important points where necessay and if u give content in point please use numbering in short:\n{scraped_data}"
        }]
    }

    response = requests.post(url, headers=headers, json=payload)

    if response.status_code == 200:
        return response.json().get('choices', [{}])[0].get('message', {}).get('content', "Failed to generate summary.")
    else:
        return "Failed to generate summary."

# ✅ Flask API endpoint to trigger Scrapy Spider
@app.route('/scrape', methods=['POST'])
def scrape_website():
    data = request.get_json()
    url = data.get('url')

    if not url:
        return jsonify({"error": "URL is required"}), 400

    print(f"✅ [INFO] Starting Scrapy Spider for URL: {url}")
    
    # ✅ Run the spider in a new thread
    thread = threading.Thread(target=run_scrapy_spider, args=(url,))
    thread.start()
    
    # ✅ Wait for Scrapy to complete
    time.sleep(10)

    if len(scraped_data) == 0:
        return jsonify({
            "message": "No data was scraped from the website.",
            "data": [],
            "summary": ""
        }), 400

    # ✅ Generate summary
    summary = generate_summary(scraped_data)

    return jsonify({
        "message": "Scraping completed successfully.",
        "data": scraped_data,
        "summary": summary
    }), 200

if __name__ == '__main__':
    print("✅ [INFO] Flask Server Started on port 8000 🚀")
    app.run(port=8000, debug=True)
