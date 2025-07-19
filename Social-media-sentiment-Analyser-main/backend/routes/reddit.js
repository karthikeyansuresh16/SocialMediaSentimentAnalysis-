import express from 'express';
import axios from 'axios';
import Sentiment from 'sentiment';

const router = express.Router();

router.post('/analyze', async (req, res) => {
  try {
    const {topic} = req.body;
    
    const response = await axios.get(
      `https://www.reddit.com/search.json?q=${encodeURIComponent(topic)}&limit=25`,
      {
        headers: {
          'User-Agent': 'SentimentAnalyzer/1.0.0'
        }
      }
    );
    
    const posts = response.data.data.children.map(child => ({
      id: child.data.id,
      title: child.data.title,
      text: child.data.selftext || '',
      created: new Date(child.data.created_utc * 1000),
      author: child.data.author,
      score: child.data.score
    }
  ));
    
    const analyzer = new Sentiment();
    const analyzedPosts = posts.map(post => {
      const text = `${post.title} ${post.text}`;
      const result = analyzer.analyze(text);
      console.log(result);
      return {
        ...post,
        sentiment: {
          score: result.score,
          category: getSentimentCategory(result.score),
          positive: result.positive,
          negative: result.negative
        }
      };
    });
    
    const summary = generateSummary(analyzedPosts);
    
    res.json({
      topic,
      posts: analyzedPosts,
      summary
    });
  } catch (error) {
    console.error('Error analyzing Reddit posts:', error);
    res.status(500).json({ error: 'Error analyzing Reddit posts' });
  }
});

function getSentimentCategory(score) {
  if (score > 0) return 'positive';
  if (score < 0) return 'negative';
  return 'neutral';
}

function generateSummary(posts) {
  const categoryCounts = {
    positive: 0,
    neutral: 0,
    negative: 0
  };
  
  let totalScore = 0;

  const timelineData = [];
  
  posts.forEach(post => {
    const category = post.sentiment.category;
    categoryCounts[category]++;
    totalScore += post.sentiment.score;
    
    timelineData.push({
      date: post.created,
      score: post.sentiment.score,
      category: category
    });
  });
  
  timelineData.sort((a, b) => a.date - b.date);
  console.log(timelineData);
  
  return {
    totalPosts: posts.length,
    categoryCounts,
    averageScore: posts.length > 0 ? totalScore / posts.length : 0,
    timeline: timelineData
  };
}

export default router;
