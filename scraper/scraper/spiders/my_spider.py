import scrapy
from scrapy_selenium import SeleniumRequest

class MySpider(scrapy.Spider):
    name = 'my_spider'

    def __init__(self, url='', *args, **kwargs):
        super(MySpider, self).__init__(*args, **kwargs)
        self.start_urls = [url]

    def start_requests(self):
        yield SeleniumRequest(
            url=self.start_urls[0],
            callback=self.parse
        )

    def parse(self, response):
        title = response.css('title::text').get()
        paragraphs = response.css("p::text").getall()

        yield {
            'title': title,
            'content': "\n".join(paragraphs)
        }
