import './TrendingWidgetItem.css';

const TrendingWidgetItem = ({
  id,
  url = '',
  urlImage = '',
  title = '',
  description = '',
  sourceName = '',
  loading = false,
}) => (
  <li className={`container_trending_item ${loading ? 'trending_item__loading' : ''}`}>
    {loading ? (
      <div className='trending_item__img'></div>
    ) : (
      <img className='trending_item__img' src={urlImage} alt={`trendingitem${id}`} />
    )}
    <a className='trending_item__title' href={url} target='_blank' rel='noreferrer'>
      {title}
    </a>
    <p className='trending_item__description'>{description}</p>
    <p className='trending_item__source' style={{ fontWeight: 'bold' }}>
      {sourceName}
    </p>
  </li>
);

export default TrendingWidgetItem;
