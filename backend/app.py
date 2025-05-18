from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from scrapy.crawler import CrawlerProcess
from scrapy.utils.project import get_project_settings
from scrapy.signalmanager import dispatcher
from scraper.scraper.spiders.my_spider import MySpider
from scrapy import signals
import os
import time
import threading
from crochet import setup, wait_for
import requests
import json

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
def generate_summary(scraped_data ,language,wordCount):
    url = "https://api.groq.com/openai/v1/chat/completions"
    # api_key = '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'
    api_key='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'
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }

    payload = {
        "model": "llama-3.3-70b-versatile",
        "messages": [{
            "role": "user",
            "content": 
                # f"Provide a concise summary of the following content in {language}. If key points are needed, use numbered lists. If there is nothing to summarize, simply state so. Ensure the summary starts with the main topic.\n\n{scraped_data}"
                f"Summarize the following content in {language} around {wordCount} words, adapting to its type: News Article → Headline + key takeaways Research Paper → Abstract + key conclusions Legal Document → Important clauses only Blog Post → Key insights + action points Code Documentation → Functionality overview + key methods YouTube Video Transcript → Short script summary Technical Report → Summary of findings + key recommendations Product Review → Pros, cons, and final verdict Interview/Podcast Transcript → Key quotes + major discussion points Social Media Post/Tweet Thread → Condensed key ideas Use numbered points where necessary. If no summary is possible, state so. Ensure the summary starts with the main topic. \n\n{scraped_data}"
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
    print("✅ Received a request at /scrape")
    data = request.get_json()
    print(f"✅ Raw request data: {data}")
    url = data.get('url')
    language = data.get('language', 'en')
    wordCount = data.get('wordCount')  
    
    print(f"✅ Received URL: {url}, Language: {language}, Word Count: {wordCount}")  # Check extracted values

    if not url:
        return jsonify({"error": "URL is required"}), 400

    print(f"✅ [INFO] Starting Scrapy Spider for URL: {url}")
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
    summary = generate_summary(scraped_data, language,wordCount)

    return jsonify({
        "message": "Scraping completed successfully.",
        "data": scraped_data,
        "summary": summary
    }), 200

if __name__ == '__main__':
    print("✅ [INFO] Flask Server Started on port 8000 🚀")
    app.run(port=8000, debug=True)
