import { useEffect, useState } from 'react';
import axios from 'axios';
import '../../css/trending-style.css'; //From Lawrence for Whats Trending styling

const DUMMY_TRENDING_DATA = [
  {
    title: 'Aljazeera Qatar News',
    url: 'https://www.aljazeera.com/where/qatar/',
    content: 'Al Jazeera for truth and transparency....',
  },
  {
    title: 'Technology',
    url: 'https://www.theverge.com/tech',
    content: 'Technology Trends report examines the ever-evolving...',
  },
  {
    title: 'Business',
    url: 'https://thepeninsulaqatar.com/category/Qatar-Business',
    content: 'Comprehensive Guide to Qatar Business ....',
  },
  {
    title: 'Sports',
    url: 'https://thepeninsulaqatar.com/category/Qatar-Business',
    content: 'View the latest in Qatar, SOCCER team news here.Sports...',
  },
];

const TrendingItem = ({ key, url = '', urlImage = '', title = '', description = '' }) => (
  <li class="container_trending_item">
    <img src={urlImage} alt={key} />
    <a href={url} target="_blank" rel="noreferrer">
      {title}
    </a>
    <p>{description}</p>
  </li>
);
const newsApiKey = '78d61a4ab2fc4b5c92149f7c22e8acbe';

const TrendingWidgetComponent = () => {
  const [trendingItems, setTrendingItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiGetNews = async () => {
    try {
      setError(null);
      setIsLoading(true);
      const newsResult = await axios.get(`https://newsapi.org/v2/everything?q=Qatar&pageSize=3&apiKey=${newsApiKey}`);
      console.log('trending response', newsResult);
      setIsLoading(false);

      if (newsResult.data.status === 'ok')
        return setTrendingItems((prevVal) =>
          newsResult.data.articles.map((article, index) => (
            <TrendingItem
              key={index}
              url={article.url}
              urlImage={article.urlToImage}
              title={article.title}
              description={article.description}
            />
          ))
        );
    } catch (error) {
      console.log(error.message);
      setError(error.message);
    }
  };

  useEffect(() => {
    apiGetNews();
  }, []);

  const showTrending = isLoading ? <p>Loading</p> : <ul class="container_trending">{trendingItems}</ul>;
  const showError = error ? <p>error</p> : '';

  return (
    <div class="widget friend-list stick-widget">
      <div class="row">
        <i class="ti-announcement"></i>
        <p class="widget-title">What's trending</p>
        {showTrending}
        {showError}
      </div>
    </div>
  );
};

export default TrendingWidgetComponent;
