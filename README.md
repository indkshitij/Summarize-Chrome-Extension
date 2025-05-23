
# 📝 Smart AI Summarizer

## 📜 Project Overview
The **Smart AI Summarizer** is a web application that allows users to extract content from any website and generate a concise, summarized version of the content using **AI (Groq API)**. This project uses **Scrapy (for web scraping)**, **Flask (for API integration)**, and **React (for the frontend interface)** to deliver fast and accurate content summaries.

---

## 🚀 Features
- ✅ **Web scraping**: Extracts content (title and paragraphs) from any webpage using **Scrapy**.
- ✅ **AI-generated summary**: Uses **Groq API** to generate a summarized version of the content.
- ✅ **Copy to clipboard**: Allows users to copy the summary with a single click.
- ✅ **Download summary**: Provides an option to download the summary as a `.txt` file.
- ✅ **Real-time processing**: Ensures quick summarization using multi-threading in Flask.
- ✅ **Cross-browser support**: Can summarize any page the user visits (by clicking the summarize button).

---

## 📂 Project Structure
The project contains three main components:

```
├── scraper/
│   ├── scraper/
│   │   ├── spiders/
│   │   │   ├── my_spider.py
├── backend/
│   ├── app.py
├── frontend/
│   ├── smartsummarizer.jsx
```

---

## 🕸 Tech Stack
| Technology         | Purpose                                                               |
|-------------------|-------------------------------------------------------------------------|
| **Scrapy**         | Used for web scraping to extract content from web pages.              |
| **Scrapy-Selenium**| Enables dynamic content scraping using Selenium inside Scrapy.         |
| **Flask**          | Backend API to trigger the Scrapy spider and generate summaries.      |
| **React.js**       | Frontend interface for users to interact with the summarizer.        |
| **Groq API**       | AI model to summarize the content generated by Scrapy.               |
| **Flask-CORS**     | Handles cross-origin requests between frontend and backend.          |

---

## 📜 How It Works
### ✅ Step 1: Extract Content Using Scrapy
- When the user clicks **Summarize**, the frontend sends the **current tab URL** to the Flask API.
- The Flask API triggers the **Scrapy spider** (`my_spider.py`) to extract:
  - **Title of the page**
  - **All paragraph content** from the page

---

### ✅ Step 2: Generate Summary Using Groq API
- The scraped content is sent to the **Groq API (AI model)** with a request to generate a summary.
- The API is configured to return concise and key-point-based summaries.

---

### ✅ Step 3: Display, Copy, or Download Summary
- The summarized content is displayed to the user.
- The user has the option to:
  - ✅ **Copy to clipboard** - Copies the summary text.
  - ✅ **Download summary** - Downloads the summary as a `.txt` file.

---

## 📜 Installation and Setup
Follow these steps to set up and run the project.

### 📥 Clone the Repository
```bash
git clone https://github.com/your-username/SmartAI-Summarizer.git
cd SmartAI-Summarizer
```

---

### ✅ 1. Setup Backend (Flask + Scrapy)
Navigate to the backend folder:
```bash
cd backend
```

Install dependencies:
```bash
pip install -r requirements.txt
```

Run the Flask server:
```bash
python app.py
```
The server will start at:
```
http://localhost:8000
```

---

### ✅ 2. Setup Frontend (React.js)
Navigate to the frontend folder:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Run the React app:
```bash
npm start
```
The frontend will open at:
```
http://localhost:3000
```

---

### ✅ 3. Chrome Extension Setup (Optional)
If you want to integrate it directly into the browser, follow these steps:
1. Build the React app:
```bash
npm run build
```
2. Open Chrome -> Extensions -> Enable Developer Mode.
3. Click **Load Unpacked** and select the `build` folder.
4. Now you can summarize any web page using the extension.

---

## 💻 API Endpoints
The backend exposes the following API:

### 🚀 **POST** `/scrape`
**Description:** This endpoint triggers the Scrapy spider and summarizes content.

**Request Body:**
```json
{
  "url": "https://example.com/article"
}
```

**Response:**
```json
{
  "message": "Scraping completed successfully.",
  "data": [
    {
      "title": "Sample Title",
      "content": "Extracted content from the page."
    }
  ],
  "summary": "AI summarized content in short."
}
```

---

## 📜 Code Explanation
### 📜 1. `my_spider.py` (Scrapy Spider)
- This file handles web scraping using Scrapy and Selenium.
- Extracts:
  - **Title** (`title::text`)
  - **Content** (`p::text`)
- Sends extracted data to Flask.

---

### 📜 2. `app.py` (Flask API)
- Handles requests from the frontend.
- Runs the Scrapy spider using `CrawlerProcess`.
- Sends extracted data to **Groq API** for summarization.

---

### 📜 3. `smartsummarizer.jsx` (React Component)
- Handles:
  - Sending the current URL to the backend.
  - Displaying the summary.
  - Copy and download functionality.

---

## 💎 Environment Variables
Create a `.env` file in the `backend` directory and add:
```
GROQ_API_KEY=your-api-key-here
```

---

## 💸 API Rate Limits
- The Groq API has a rate limit based on your plan.
- If you exhaust the limit, the summary may fail.

---

## 📊 Future Improvements
- ✅ Add multilingual support for summarizing content in different languages.
- ✅ Use OpenAI or Huggingface models for offline summarization.
- ✅ Improve content extraction by handling JavaScript-heavy websites.
- ✅ Add text-to-speech conversion for summary.
