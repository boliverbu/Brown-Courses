# Brown Course Recommendation System

The **Brown Course Recommendation System** is a modern web application that helps students discover and get personalized course recommendations based on their interests, preferences, and academic goals. Built with Next.js and featuring AI-powered search capabilities, it provides an intuitive interface for exploring Brown University's course catalog.

---

## Project Details

- **Project Name**: Brown Course Recommendation System
- **Team Members**:
  - Oliver Tu (ostu) — Full-stack development, AI integration, and system architecture
  - Isaac Fernandez-Lopez (iferna17) - Data Scraper and backend services
  - Daniel Omondi (domondi1) - Frontend development and UI/UX
- **Technology Stack**: Next.js 15, TypeScript, Tailwind CSS, Pinecone Vector Database
- **GitHub Repository**: [https://github.com/cs0320-s25/term-project-oliver-isaac-daniel](https://github.com/cs0320-s25/term-project-oliver-isaac-daniel)

---

## Features

- **AI-Powered Search**: Semantic search using Pinecone vector database for intelligent course matching
- **Modern UI**: Clean, responsive interface built with Tailwind CSS
- **Real-time Feedback**: User feedback system to improve recommendations
- **Course Data**: Comprehensive course information scraped from Brown's CAB system
- **TypeScript**: Full type safety across the application

---

## Architecture

### Frontend (Next.js App)

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript
- **Key Components**:
  - `CourseSearchPage.tsx`: Main search interface
  - `CourseResults.tsx`: Displays search results
  - `BlurbInput.tsx`: User input component
  - `FeedbackWidget.tsx`: User feedback collection

### Backend Services

- **API Routes**: Next.js API routes for search and feedback
- **Vector Search**: Pinecone integration for semantic course matching
- **Database**: PostgreSQL for course data storage
- **Authentication**: Google Auth integration

### Data Pipeline

- **Scraper**: Python-based scraper using Playwright for course data collection
- **Data Processing**: Automated pipeline to process and index course information
- **Vector Embeddings**: Course descriptions converted to embeddings for semantic search

---

## Project Structure

```
Brown-Courses/
├── web/                          # Next.js frontend application
│   ├── src/
│   │   ├── app/                  # Next.js App Router
│   │   │   ├── api/              # API routes
│   │   │   │   ├── search/       # Search endpoint
│   │   │   │   └── feedback/     # Feedback endpoint
│   │   │   ├── layout.tsx        # Root layout
│   │   │   └── page.tsx          # Home page
│   │   ├── components/           # React components
│   │   └── styles/               # Global styles
│   ├── package.json              # Frontend dependencies
│   └── next.config.ts            # Next.js configuration
├── scraper/                      # Course data scraper
│   ├── scrape_and_upload.py      # Main scraping script
│   ├── scrape.py                 # Scraping utilities
│   └── requirements.txt          # Python dependencies
└── README.md                     # This file
```

---

## Setup Instructions

### Prerequisites

- Node.js 18+
- Python 3.8+
- PostgreSQL database
- Pinecone account and API key

### Frontend Setup

1. Navigate to the web directory:

```bash
cd web
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   Create a `.env.local` file in the `web` directory with:

```
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_NAME=your_index_name
DATABASE_URL=your_postgres_connection_string
GOOGLE_CLIENT_ID=your_google_client_id
```

4. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Scraper Setup

1. Navigate to the scraper directory:

```bash
cd scraper
```

2. Create a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Set up environment variables:
   Create a `.env` file in the `scraper` directory with:

```
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_NAME=your_index_name
DATABASE_URL=your_postgres_connection_string
```

5. Run the scraper:

```bash
python scrape_and_upload.py
```

---

## Development

### Available Scripts

**Frontend (in `web` directory):**

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Testing

The application includes comprehensive testing:

- **Frontend**: Component testing with Playwright
- **API**: Integration tests for search and feedback endpoints
- **Scraper**: Unit tests for data extraction logic

To run tests:

```bash
# Frontend tests
cd web
npx playwright test

# API tests
npm run test
```

---

## Technology Stack

### Frontend

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **React 19**: Latest React with concurrent features

### Backend & Services

- **Pinecone**: Vector database for semantic search
- **PostgreSQL**: Relational database for course data
- **Google Auth**: Authentication service
- **Vercel Analytics**: Performance monitoring

### Data Processing

- **Playwright**: Web scraping and automation
- **Python**: Data processing and ETL pipelines
- **BeautifulSoup**: HTML parsing

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

---

## Project History

This project began as a final project for **CS0320: Software Engineering** at Brown University, where the initial course recommendation system was developed. Over the summer, the project was entirely revamped and modernized with:

- Migration from a basic React/Flask stack to Next.js 15 with TypeScript
- Integration of AI-powered semantic search using Pinecone
- Implementation of modern UI/UX with Tailwind CSS
- Addition of comprehensive data processing pipelines
- Enhanced user feedback and analytics systems

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Originally developed for educational purposes as part of CS0320 at Brown University.

---

## Acknowledgments

### Academic Foundation

- **CS0320: Software Engineering** - Brown University course that provided the initial framework and learning foundation for this project
- **Brown University Computer Science Department** - For the educational opportunity and resources

### Original Team Members

- **Isaac Fernandez-Lopez (iferna17)** - Original data scraper development and backend services
- **Daniel Omondi (domondi1)** - Original frontend development and UI/UX contributions

### Technical Resources

- **ChatGPT (OpenAI)**: Used for debugging and code optimization
- **Stack Overflow**: Community support for technical challenges
- **Brown University CAB**: Course data source
