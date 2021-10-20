import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../css/trending-style.css'; //From Lawrence for Whats Trending styling

const TrendingItem = ({ id, url = '', urlImage = '', title = '', description = '', loading = false }) => (
  <li className={`container_trending_item ${loading && 'trending_item__loading'}`}>
    {loading ? (
      <div className="trending_item__img"></div>
    ) : (
      <img className="trending_item__img" src={urlImage} alt={`trendingitem${id}`} />
    )}
    <a className="trending_item__title" href={url} target="_blank" rel="noreferrer">
      {title}
    </a>
    <p className="trending_item__description">{description}</p>
  </li>
);

const newsApiKey = '63dba4402f7e429aa0c9e818baf2e314';

const NEWS_ACTIONS = {
  PREV: 'PREV',
  NEXT: 'NEXT',
};

const TrendingWidgetComponent = ({ pageSize = 3 }) => {
  const [pageCurrent, setPageCurrent] = useState(1);
  const [pageMax, setPageMax] = useState(0);
  const [trendingItems, setTrendingItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newsError, setNewsError] = useState(null);

  const apiGetNews = async () => {
    try {
      setNewsError(null);
      setIsLoading(true);
      const newsResult = await axios.get(
        `https://newsapi.org/v2/everything?q=Qatar&pageSize=${pageSize}&page=${pageCurrent}&apiKey=${newsApiKey}`
      );

      setPageMax(newsResult.data.totalResults / pageSize);
      setIsLoading(false);

      if (newsResult.data.status === 'ok')
        return setTrendingItems(() =>
          newsResult.data.articles.map((article, index) => (
            <TrendingItem
              key={index}
              id={index}
              url={article.url}
              urlImage={article.urlToImage}
              title={article.title}
              description={article.description}
            />
          ))
        );
    } catch (error) {
      console.log(error.response.data.message);
      setNewsError(error.response.data.message);
    }
  };

  const showNewsLoading = async () => {
    let itemArray = [];

    for (let index = 0; index < pageSize; index++) {
      itemArray.push(<TrendingItem id={index} key={index} loading={true} url="" urlImage="" title="" description="" />);
    }

    await setTrendingItems(itemArray);
  };

  const navigateNews = (e, action = NEWS_ACTIONS.NEXT) => {
    e.preventDefault();

    if (action === NEWS_ACTIONS.NEXT) {
      if (pageCurrent <= pageMax) setPageCurrent((val) => val + 1);
    }
    if (action === NEWS_ACTIONS.PREV) {
      if (pageCurrent > 1) setPageCurrent((val) => val - 1);
    }
  };

  useEffect(() => {
    showNewsLoading();
  }, []);

  useEffect(() => {
    if (isLoading) showNewsLoading();
  }, [isLoading]);

  useEffect(() => {
    apiGetNews();
    // showNewsLoading();
  }, [pageCurrent]);

  const ShowTrendingItems = () => (
    <ul className="container_trending">
      {newsError ? (
        <li className="container_trending_item">
          <p>{newsError}</p>
        </li>
      ) : (
        trendingItems
      )}
    </ul>
  );

  const NavNewsButtons = () => (
    <div className="container_trending_nav">
      <button
        onClick={(e) => {
          navigateNews(e, NEWS_ACTIONS.PREV);
        }}
      >
        <i class="ti-arrow-left"></i>
      </button>
      <button
        onClick={(e) => {
          navigateNews(e, NEWS_ACTIONS.NEXT);
        }}
      >
        <i class="ti-arrow-right"></i>
      </button>
    </div>
  );

  return (
    <div class="widget friend-list stick-widget">
      <div class="row">
        <i class="ti-announcement"></i>
        <p class="widget-title">What's trending</p>
        <NavNewsButtons />
        <ShowTrendingItems />
      </div>
    </div>
  );
};

export default TrendingWidgetComponent;
