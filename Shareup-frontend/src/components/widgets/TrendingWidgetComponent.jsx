import '../../css/trending-style.css'; //From Lawrence for Whats Trending styling

const DEFAULT_TRENDING_DATA = [
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

// Will accept parameter as an array with url, title and content

const TrendingWidgetComponent = ({trendings = DEFAULT_TRENDING_DATA}) => {
  const trendingItems = trendings.map((item, index) => (
    <li class="container_trending_item" key={`trendings${index}`}>
      <a href={item.url} target="_blank" rel="noreferrer">
        {item.title}
      </a>
      <p>{item.content}</p>
    </li>
  ));

  return (
    <div class="widget friend-list stick-widget">
      <div class="row">
        <i class="ti-announcement"></i>
        <p class="widget-title">What's trending</p>
      </div>
      <ul class="container_trending">{trendingItems}</ul>
    </div>
  );
};
export default TrendingWidgetComponent;
