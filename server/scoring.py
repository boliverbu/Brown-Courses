from sklearn.feature_extraction.text import TfidfVectorizer 
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer

# Initialize models once (important for speed)
vectorizer = TfidfVectorizer(stop_words="english")
semantic_model = SentenceTransformer('all-MiniLM-L6-v2')

def score_tfidf(user_blurb, course_list):
    documents = [user_blurb] + course_list
    tfidf_matrix = vectorizer.fit_transform(documents)
    
    user_vector = tfidf_matrix[0]
    course_vectors = tfidf_matrix[1:]
    
    similarities = cosine_similarity(user_vector, course_vectors)
    return similarities.flatten().tolist()

def score_semantic(user_blurb, course_list):
    embeddings = semantic_model.encode([user_blurb] + course_list)
    
    user_embedding = embeddings[0].reshape(1, -1)
    course_embeddings = embeddings[1:]
    
    similarities = cosine_similarity(user_embedding, course_embeddings)
    return similarities.flatten().tolist()

def score_combined(user_blurb, all_courses,  pref_departments, alpha=0.5,):

    course_list = [course["description"] for course in all_courses]
    
    # Get separate scores
    tfidf_scores = score_tfidf(user_blurb, course_list)
    semantic_scores = score_semantic(user_blurb, course_list)
    
    boost = [0.1 if course["department"] in pref_departments else 0.0 for course in all_courses]
    
    # Weighted combination
    combined_scores = [
        alpha * tfidf + (1 - alpha) * semantic
        for tfidf, semantic in zip(tfidf_scores, semantic_scores)
    ]

    combined_scores = [
        score + boost_val for score, boost_val in zip(combined_scores, boost)
    ]
    return combined_scores

