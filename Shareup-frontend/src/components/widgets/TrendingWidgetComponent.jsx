import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../css/trending-style.css'; //From Lawrence for Whats Trending styling

const DUMMY_NEWS_API_RESPONSE = {
  status: 'ok',
  totalResults: 112,
  articles: [
    {
      source: {
        id: 'reuters',
        name: 'Reuters',
      },
      author: null,
      title: 'UAE to host Club World Cup in early 2022 - Reuters',
      description:
        "The United Arab Emirates (UAE) will host this season's Club World Cup in early 2022, FIFA president Gianni Infantino said on Wednesday.",
      url: 'https://www.reuters.com/lifestyle/sports/uae-host-club-world-cup-early-2022-2021-10-20/',
      urlToImage:
        'https://www.reuters.com/resizer/GVTqfhtna11di17HdI0Eeds-Pa0=/1200x628/smart/filters:quality(80)/cloudfront-us-east-2.images.arcpublishing.com/reuters/TZUOIQUKZRPSFIYL5SZOXKDOY4.jpg',
      publishedAt: '2021-10-20T15:43:00Z',
      content:
        'A general view shows the Al Janoub Stadium built for the upcoming 2022 FIFA World Cup soccer championship during a stadium tour in Al Wakrah, Qatar, December 16, 2019. REUTERS/Corinna KernOct 20 (Reu… [+694 chars]',
    },
    {
      source: {
        id: 'reuters',
        name: 'Reuters',
      },
      author: null,
      title: 'Asian Cup qualifiers final round to held in round-robin format - Reuters',
      description:
        'The final round of qualifiers for the 2023 Asian Cup will be changed from the home and away format to single round-robin ties and played in centralised venues due to the COVID-19 pandemic, the Asian Football Confederation said on Wednesday.',
      url: 'https://www.reuters.com/world/china/asian-cup-qualifiers-final-round-held-round-robin-format-2021-10-20/',
      urlToImage: 'https://www.reuters.com/pf/resources/images/reuters/reuters-default.png?d=53',
      publishedAt: '2021-10-20T05:15:00Z',
      content:
        'Oct 20 (Reuters) - The final round of qualifiers for the 2023 Asian Cup will be changed from the home and away format to single round-robin ties and played in centralised venues due to the COVID-19 p… [+1069 chars]',
    },
    {
      source: {
        id: 'reuters',
        name: 'Reuters',
      },
      author: null,
      title: "FIFA's Infantino seeks consensus over World Cup plans - Reuters",
      description:
        'FIFA president Gianni Infantino said on Wednesday he wanted to seek consensus over plans for a biennial World Cup and changes to the international match calendar after facing fierce criticism from European federations.',
      url: 'https://www.reuters.com/lifestyle/sports/fifas-infantino-seeks-consensus-over-world-cup-plans-2021-10-20/',
      urlToImage:
        'https://www.reuters.com/resizer/Y3t9Pc278IdKHBK9eytkZcsFwwU=/1200x628/smart/filters:quality(80)/cloudfront-us-east-2.images.arcpublishing.com/reuters/BN6EBM37PFMG3OFAJ72DT6BH5Q.jpg',
      publishedAt: '2021-10-20T17:16:00Z',
      content:
        'FIFA President Gianni Infantino visits Venezuela - Universidad central de Venezuela stadium - Caracas, Venezuela - October 15, 2021 FIFA President Gianni Infantino attends a news conference REUTERS/L… [+2456 chars]',
    },
    {
      source: {
        id: 'reuters',
        name: 'Reuters',
      },
      author: null,
      title: 'Aramex drives Dubai bourse higher, Saudi at 15-year high - Reuters',
      description:
        "Dubai's stock market ended higher on Wednesday, outperforming its Gulf peers, led by a surge in logistic firm Aramex, while the Saudi index extended gains a day after hitting a 15-year peak.",
      url: 'https://www.reuters.com/world/middle-east/aramex-drives-dubai-bourse-higher-saudi-15-year-high-2021-10-20/',
      urlToImage: 'https://www.reuters.com/pf/resources/images/reuters/reuters-default.png?d=53',
      publishedAt: '2021-10-20T13:26:00Z',
      content:
        "Oct 20 (Reuters) - Dubai's stock market ended higher on Wednesday, outperforming its Gulf peers, led by a surge in logistic firm Aramex, while the Saudi index extended gains a day after hitting a 15-… [+2364 chars]",
    },
    {
      source: {
        id: null,
        name: 'The Points Guy',
      },
      author: 'Ryan Smith',
      title: '6 common airline award travel pitfalls and how to avoid them',
      description:
        'You may have heard some travelers grumbling that frequent-flyer miles are a waste of time. In particular, travelers sometimes claim that it’s challenging (or even impossible) to use miles for the flights they actually want to take. Unfortunately, there are in…',
      url: 'http://thepointsguy.com/guide/avoid-frequent-flyer-miles-mistakes/',
      urlToImage:
        'https://thepointsguy.global.ssl.fastly.net/us/originals/2021/08/Aerial-view-of-LAX-airport-with-assorted-planes.jpg',
      publishedAt: '2021-10-20T13:00:40Z',
      content:
        'You may have heard some travelers grumbling that frequent-flyer miles are a waste of time. In particular, travelers sometimes claim that it’s challenging (or even impossible) to use miles for the fli… [+15636 chars]',
    },
    {
      source: {
        id: null,
        name: 'The Points Guy',
      },
      author: 'Chris Dong',
      title: 'Expectations that were too high: A review of Turkish Airlines business class on the Boeing 777',
      description:
        'For aviation geeks like me, flying an airline for the first time is a thrill. Earlier this fall, I had an introduction to Turkey’s flag carrier when I took Turkish Airlines from New York-JFK to Istanbul (IST). Excited was an understatement for how I felt. I e…',
      url: 'http://thepointsguy.com/reviews/turkish-airlines-business-777-review/',
      urlToImage:
        'https://thepointsguy.global.ssl.fastly.net/us/originals/2021/09/20210923_Turkish-Business-Class_JFK-IST-MLE_CDong-75.jpg',
      publishedAt: '2021-10-20T12:00:32Z',
      content:
        'For aviation geeks like me, flying an airline for the first time is a thrill. Earlier this fall, I had an introduction to Turkey’s flag carrier when I took Turkish Airlines from New York-JFK to Istan… [+21394 chars]',
    },
    {
      source: {
        id: null,
        name: 'Phys.Org',
      },
      author: 'Linda Givetash',
      title: "Helium: South Africa strikes new 'gold'",
      description:
        "In a grassy plain in South Africa, once the world's largest gold producer, prospectors have stumbled upon a new treasure: helium.",
      url: 'https://phys.org/news/2021-10-helium-south-africa-gold.html',
      urlToImage: 'https://scx2.b-cdn.net/gfx/news/2021/a-south-african-firm-b.jpg',
      publishedAt: '2021-10-20T09:56:51Z',
      content:
        "In a grassy plain in South Africa, once the world's largest gold producer, prospectors have stumbled upon a new treasure: helium.\r\nPopularly known for birthday balloons and squeaky voices, helium pla… [+4019 chars]",
    },
    {
      source: {
        id: null,
        name: 'The New York Review of Books',
      },
      author: 'Michael Massing',
      title: 'The Story the Media Missed in Afghanistan',
      description:
        'Since the US withdrawal from Afghanistan, the American press has focused on the fates of three groups that are of special interest to Western readers. One is the many thousands of Afghans who had worked with the US government and military or other Western org…',
      url: 'https://www.nybooks.com/daily/2021/10/20/the-story-the-media-missed-in-afghanistan/',
      urlToImage: 'https://www.nybooks.com/wp-content/uploads/2021/10/91496697.jpeg',
      publishedAt: '2021-10-20T18:32:53Z',
      content:
        'Since the US withdrawal from Afghanistan, the American press has focused on the fates of three groups that are of special interest to Western readers. One is the many thousands of Afghans who had wor… [+27189 chars]',
    },
    {
      source: {
        id: 'bloomberg',
        name: 'Bloomberg',
      },
      author: 'Daniel Avis',
      title: 'Israel Allows In More Gaza Merchants, Trying to Prop Up Truce',
      description: '',
      url: 'https://www.bloomberg.com/news/articles/2021-10-20/israel-allows-in-more-gaza-merchants-trying-to-prop-up-truce',
      urlToImage: 'https://assets.bwbx.io/images/users/iqjWHBFdfxIU/iiLtpFJcPrVA/v1/1200x900.jpg',
      publishedAt: '2021-10-20T13:13:11Z',
      content:
        'Israel will open its borders to 3,000 more Palestinian businesspeople from the Gaza Strip on Thursday, trying to shore up the fragile cease-fire that ended its conflict with the territorys militant H… [+1517 chars]',
    },
    {
      source: {
        id: 'bbc-news',
        name: 'BBC News',
      },
      author: null,
      title: 'Muslim Athlete Charter: Football Association of Wales signs pledge on equality and diversity',
      description:
        'The Football Association of Wales becomes the first footballing body to sign the Muslim Athlete Charter.',
      url: 'https://www.bbc.co.uk/sport/football/58919073',
      urlToImage:
        'https://ichef.bbci.co.uk/live-experience/cps/624/cpsprodpb/0C5C/production/_121146130_wales-index.jpg',
      publishedAt: '2021-10-20T06:00:27Z',
      content:
        'Wales remain in contention for a place at the 2022 World Cup in Qatar\r\nThe Football Association of Wales (FAW) has become the first footballing body to sign the Muslim Athlete Charter.\r\nBy signing th… [+1749 chars]',
    },
    {
      source: {
        id: null,
        name: 'Motley Fool',
      },
      author: 'newsfeedback@fool.com (Motley Fool Transcribers)',
      title: 'Baker Hughes Co (BKR) Q3 2021 Earnings Call Transcript',
      description: 'BKR earnings call for the period ending September 30, 2021.',
      url: 'https://www.fool.com/earnings/call-transcripts/2021/10/20/baker-hughes-co-bkr-q3-2021-earnings-call-transcri/',
      urlToImage: 'https://g.foolcdn.com/editorial/images/1/featured-transcript-logo-template.jpg',
      publishedAt: '2021-10-20T18:00:52Z',
      content:
        'Image source: The Motley Fool.\r\nBaker Hughes Co (NYSE:BKR)Q3 2021 Earnings CallOct 20, 2021, 8:30 a.m. ET\r\nContents:\r\n<ul><li>Prepared Remarks</li><li>Questions and Answers</li><li>Call Participants<… [+62615 chars]',
    },
    {
      source: {
        id: null,
        name: 'The Indian Express',
      },
      author: 'Express News Service',
      title: 'Design district on lines of Dubai’s d3 to come up in Bengaluru, says Karnataka minister',
      description:
        'Science and Technology Minister Dr CN  Ashwath Narayan had visited the d3 (Dubai Design District) along with senior officials on Sunday. After returning home from his four-day trip to the Dubai Expo, he announced the plans of setting up the ‘Bengaluru Design …',
      url: 'https://indianexpress.com/article/cities/bangalore/bengaluru-design-district-cn-ashwath-narayan-7582107/',
      urlToImage: 'https://images.indianexpress.com/2021/09/Karnataka-NEP.jpg',
      publishedAt: '2021-10-20T15:32:46Z',
      content:
        'The Karnataka government is planning to establish a Bengaluru Design District on the lines of the Dubai Design District, which is popularly known as the d3. The Bengaluru Design District will be set … [+1517 chars]',
    },
    {
      source: {
        id: null,
        name: 'Yahoo Entertainment',
      },
      author: 'PR Newswire',
      title:
        'AXA Gulf, A Leading Insurance Provider In The GCC, Selects GEP SMART Unified Procurement Software Platform To Transform Its Sourcing',
      description:
        'GEP®, a leading provider of procurement and supply chain strategy, software and managed services to Fortune 500 and Global 2000 enterprises worldwide...',
      url: 'https://finance.yahoo.com/news/axa-gulf-leading-insurance-provider-141500584.html',
      urlToImage:
        'https://s.yimg.com/uu/api/res/1.2/RcpqoO0G0U6JTXSoSx0R9w--~B/aD05Njt3PTQwMDthcHBpZD15dGFjaHlvbg--/https://media.zenfs.com/en/prnewswire.com/0256380f4603894d44ca233707b34620',
      publishedAt: '2021-10-20T14:15:00Z',
      content:
        '-- Chooses GEP SOFTWARE for its entire source-to-contract process to deliver greater value to customers across 13 countries\r\nABU DHABI, United Arab Emirates, Oct. 20, 2021 /PRNewswire/ -- GEP®, a lea… [+4161 chars]',
    },
    {
      source: {
        id: null,
        name: 'Yahoo Entertainment',
      },
      author: 'ReportLinker',
      title:
        'Blood Clot Retrieval Devices Market Research Report by Stroke Type, by Device Type, by End User, by Region - Global Forecast to 2026 - Cumulative Impact of COVID-19',
      description:
        'Blood Clot Retrieval Devices Market Research Report by Stroke Type (Hemorrhagic Stroke, Ischemic Stroke, and Transient Ischemic Attack), by Device Type...',
      url: 'https://finance.yahoo.com/news/blood-clot-retrieval-devices-market-102900193.html',
      urlToImage:
        'https://s.yimg.com/uu/api/res/1.2/IN3_pUboxxFTZlP4bjcjcQ--~B/aD00MDA7dz00MDA7YXBwaWQ9eXRhY2h5b24-/https://media.zenfs.com/en/globenewswire.com/4ce8962afb8a41766b626a7e61c8413f',
      publishedAt: '2021-10-20T10:29:00Z',
      content:
        'Blood Clot Retrieval Devices Market Research Report by Stroke Type (Hemorrhagic Stroke, Ischemic Stroke, and Transient Ischemic Attack), by Device Type (Mechanical Embolus Removal Devices, Penumbra B… [+8119 chars]',
    },
    {
      source: {
        id: null,
        name: 'Yahoo Entertainment',
      },
      author: 'ReportLinker',
      title:
        'Blood Fluid Warming System Market Research Report by Product, by Distribution channel, by Application, by Region - Global Forecast to 2026 - Cumulative Impact of COVID-19',
      description:
        'Blood Fluid Warming System Market Research Report by Product (Intravenous Warming System, Patient Warming Accessories, and Surface Warming System), by...',
      url: 'https://finance.yahoo.com/news/blood-fluid-warming-system-market-102400977.html',
      urlToImage:
        'https://s.yimg.com/uu/api/res/1.2/IN3_pUboxxFTZlP4bjcjcQ--~B/aD00MDA7dz00MDA7YXBwaWQ9eXRhY2h5b24-/https://media.zenfs.com/en/globenewswire.com/4ce8962afb8a41766b626a7e61c8413f',
      publishedAt: '2021-10-20T10:24:00Z',
      content:
        'Blood Fluid Warming System Market Research Report by Product (Intravenous Warming System, Patient Warming Accessories, and Surface Warming System), by Distribution channel (Clinics, E-Commerce, and H… [+8101 chars]',
    },
    {
      source: {
        id: null,
        name: 'Yahoo Entertainment',
      },
      author: 'ReportLinker',
      title:
        'Blockchain in Aerospace & Defense Market Research Report by Component, by Application Area, by Region - Global Forecast to 2026 - Cumulative Impact of COVID-19',
      description:
        'Blockchain in Aerospace & Defense Market Research Report by Component (Services and Software Platforms), by Application Area (Certifications, Digital ID, and...',
      url: 'https://finance.yahoo.com/news/blockchain-aerospace-defense-market-research-104400066.html',
      urlToImage:
        'https://s.yimg.com/uu/api/res/1.2/IN3_pUboxxFTZlP4bjcjcQ--~B/aD00MDA7dz00MDA7YXBwaWQ9eXRhY2h5b24-/https://media.zenfs.com/en/globenewswire.com/4ce8962afb8a41766b626a7e61c8413f',
      publishedAt: '2021-10-20T10:44:00Z',
      content:
        'Blockchain in Aerospace &amp; Defense Market Research Report by Component (Services and Software Platforms), by Application Area (Certifications, Digital ID, and Provenance), by Region (Americas, Asi… [+7736 chars]',
    },
    {
      source: {
        id: null,
        name: 'Yahoo Entertainment',
      },
      author: 'ReportLinker',
      title:
        'Cryogenic Pump Market Research Report by Type, by Gas, by End-User, by Region - Global Forecast to 2026 - Cumulative Impact of COVID-19',
      description:
        'Cryogenic Pump Market Research Report by Type (Dynamic Pump and Positive Displacement Pump), by Gas (Argon, LNG, and Nitrogen), by End-User, by Region...',
      url: 'https://finance.yahoo.com/news/cryogenic-pump-market-research-report-123900192.html',
      urlToImage:
        'https://s.yimg.com/uu/api/res/1.2/IN3_pUboxxFTZlP4bjcjcQ--~B/aD00MDA7dz00MDA7YXBwaWQ9eXRhY2h5b24-/https://media.zenfs.com/en/globenewswire.com/4ce8962afb8a41766b626a7e61c8413f',
      publishedAt: '2021-10-20T12:39:00Z',
      content:
        'Cryogenic Pump Market Research Report by Type (Dynamic Pump and Positive Displacement Pump), by Gas (Argon, LNG, and Nitrogen), by End-User, by Region (Americas, Asia-Pacific, and Europe, Middle East… [+7645 chars]',
    },
    {
      source: {
        id: null,
        name: 'Yahoo Entertainment',
      },
      author: 'ReportLinker',
      title:
        'Brain Cancer Drugs Market Research Report by Therapy Type, by Indication, by Distribution Channel, by Region - Global Forecast to 2026 - Cumulative Impact of COVID-19',
      description:
        'Brain Cancer Drugs Market Research Report by Therapy Type (Chemotherapy, Immunotherapy, and Targeted Therapy), by Indication (Glioblastoma, Meningioma, and...',
      url: 'https://finance.yahoo.com/news/brain-cancer-drugs-market-research-101400366.html',
      urlToImage:
        'https://s.yimg.com/uu/api/res/1.2/IN3_pUboxxFTZlP4bjcjcQ--~B/aD00MDA7dz00MDA7YXBwaWQ9eXRhY2h5b24-/https://media.zenfs.com/en/globenewswire.com/4ce8962afb8a41766b626a7e61c8413f',
      publishedAt: '2021-10-20T10:14:00Z',
      content:
        'Brain Cancer Drugs Market Research Report by Therapy Type (Chemotherapy, Immunotherapy, and Targeted Therapy), by Indication (Glioblastoma, Meningioma, and Pituitary Tumors), by Distribution Channel,… [+8018 chars]',
    },
    {
      source: {
        id: null,
        name: 'Yahoo Entertainment',
      },
      author: 'ReportLinker',
      title:
        'Battery Electrolyte Market Research Report by Battery, by Form Type, by End-Use, by Region - Global Forecast to 2026 - Cumulative Impact of COVID-19',
      description:
        'Battery Electrolyte Market Research Report by Battery (Lead-Acid Battery and Lithium-Ion Battery), by Form Type (Dry Electrolyte, Gel Electrolyte, and Others...',
      url: 'https://finance.yahoo.com/news/battery-electrolyte-market-research-report-110900590.html',
      urlToImage:
        'https://s.yimg.com/uu/api/res/1.2/IN3_pUboxxFTZlP4bjcjcQ--~B/aD00MDA7dz00MDA7YXBwaWQ9eXRhY2h5b24-/https://media.zenfs.com/en/globenewswire.com/4ce8962afb8a41766b626a7e61c8413f',
      publishedAt: '2021-10-20T11:09:00Z',
      content:
        'Battery Electrolyte Market Research Report by Battery (Lead-Acid Battery and Lithium-Ion Battery), by Form Type (Dry Electrolyte, Gel Electrolyte, and Others), by End-Use, by Region (Americas, Asia-P… [+8126 chars]',
    },
    {
      source: {
        id: null,
        name: 'Yahoo Entertainment',
      },
      author: 'ReportLinker',
      title:
        'Anti-Obesity Therapeutics Market Research Report by Mechanism of Action, by Drug Type, by Region - Global Forecast to 2026 - Cumulative Impact of COVID-19',
      description:
        'Anti-Obesity Therapeutics Market Research Report by Mechanism of Action (Centrally Acting Drugs and Peripherally Acting Drugs), by Drug Type (OTC Drugs and...',
      url: 'https://finance.yahoo.com/news/anti-obesity-therapeutics-market-research-113900146.html',
      urlToImage:
        'https://s.yimg.com/uu/api/res/1.2/IN3_pUboxxFTZlP4bjcjcQ--~B/aD00MDA7dz00MDA7YXBwaWQ9eXRhY2h5b24-/https://media.zenfs.com/en/globenewswire.com/4ce8962afb8a41766b626a7e61c8413f',
      publishedAt: '2021-10-20T11:39:00Z',
      content:
        'Anti-Obesity Therapeutics Market Research Report by Mechanism of Action (Centrally Acting Drugs and Peripherally Acting Drugs), by Drug Type (OTC Drugs and Prescription Drugs), by Region (Americas, A… [+7604 chars]',
    },
  ],
};

const delay = (ms) => new Promise((resolve) => setTimeout(() => resolve(), ms));

const getDummyNewsApiResponse = async (msDelay = 1500) => {
  const { status, totalResults, articles } = DUMMY_NEWS_API_RESPONSE;
  await delay(msDelay);

  return { data: { status, totalResults, articles } };
};

const TrendingItem = ({
  id,
  url = '',
  urlImage = '',
  title = '',
  description = '',
  sourceName = '',
  loading = false,
}) => (
  <li className={`container_trending_item ${loading ? 'trending_item__loading' : ''}`}>
    <figure class="small">
      {loading ? (
        <div className='trending_item__img'></div>
      ) : (
        <img className='trending_item__img' src={urlImage} alt={`trendingitem${id}`} />
      )}
      <figcaption className="transition opacity">
        <a href={url}>
          <strong className="text transition title">{title}</strong>
          <span className="text transition desc">{description}</span></a>
      </figcaption>
    </figure>
  </li>
);

const newsApiKey1 = '63dba4402f7e429aa0c9e818baf2e314';
const newsApiKey2 = '78d61a4ab2fc4b5c92149f7c22e8acbe';

const NEWS_ACTIONS = {
  PREV: 'PREV',
  NEXT: 'NEXT',
};

const TrendingWidgetComponent = ({ pageSize = 1, isAutoPlay = true, autoPlayInterval = 10000, isDummyData = true }) => {
  const [pageCurrent, setPageCurrent] = useState(1);
  const [pageMax, setPageMax] = useState(0);
  const [trendingItems, setTrendingItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newsError, setNewsError] = useState(null);
  const [autoPlayIntervalId, setAutoPlayIntervalId] = useState(null);
  const [isButtonPrevDisabled, setIsButtonPrevDisabled] = useState(true);
  const [isButtonNextDisabled, setIsButtonNextDisabled] = useState(true);

  const getNews = async () => {
    try {
      setNewsError(null);
      setIsLoading(true);

      const todayDate = new Date();
      const todayString = `${todayDate.getFullYear()}-${todayDate.getMonth() + 1}-${todayDate.getDate()}`;
      const yesterdayString = `${todayDate.getFullYear()}-${todayDate.getMonth() + 1}-${todayDate.getDate() - 1}`;

      let newsResult;

      if (isDummyData) {
        newsResult = await getDummyNewsApiResponse();
      } else {
        newsResult = await axios.get(
          `https://newsapi.org/v2/everything?q=qatar&from=${yesterdayString}&to=${todayString}&sortBy=popularity&language=en&apiKey=${newsApiKey2}`
        );

        // https://newsapi.org/v2/everything?q=qatar&from=2021-10-21&to=2021-10-22&sortBy=popularity&language=en&apiKey=78d61a4ab2fc4b5c92149f7c22e8acbe
      }

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
              description={article.content.replace(/\[[^\]]*\]/i, '')}
              sourceName={article.source.name}
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
    autoPlayStop();
    for (let index = 0; index < pageSize; index++) {
      itemArray.push(<TrendingItem id={index} key={index} loading={true} url='' urlImage='' title='' description='' />);
    }
    autoPlayStart();
    await setTrendingItems(itemArray);
  };

  const navigateNews = (e, action = NEWS_ACTIONS.NEXT) => {
    if (e) e.preventDefault();

    if (action === NEWS_ACTIONS.NEXT) {
      setPageCurrent((val) => val + 1);
    }

    if (action === NEWS_ACTIONS.PREV) {
      setPageCurrent((val) => val - 1);
    }
  };

  const autoPlayStart = () => {
    if (isAutoPlay) {
      const autoPlayId = setInterval(() => {
        navigateNews(null, NEWS_ACTIONS.NEXT);
      }, autoPlayInterval);
      console.log('Trending Autoplay Playing', autoPlayId);
      setAutoPlayIntervalId(autoPlayId);
    }
  };

  const autoPlayStop = () => {
    if (isAutoPlay) {
      clearInterval(autoPlayIntervalId);
      console.log('Trending Autoplay Cleared', autoPlayIntervalId);
    }
  };

  const checkNavButtonsDisabled = () => {
    if (pageCurrent - 1 === 0) {
      setIsButtonPrevDisabled(true);
    } else {
      setIsButtonPrevDisabled(false);
    }

    if (pageCurrent >= pageMax) {
      setIsButtonNextDisabled(true);
    } else {
      setIsButtonNextDisabled(false);
    }
  };

  useEffect(() => {
    showNewsLoading();
    getNews();
    checkNavButtonsDisabled();
  }, []);

  useEffect(() => {
    if (isLoading) showNewsLoading();
  }, [isLoading]);

  useEffect(() => {
    if (pageCurrent < 1 || pageCurrent > pageMax) {
      setPageCurrent(1);
    }

    checkNavButtonsDisabled();
  }, [pageCurrent, pageMax]);

  useEffect(() => {
    setPageMax(Math.floor(trendingItems.length / pageSize));
  }, [trendingItems]);

  const ShowTrendingItems = () => {
    const pageStart = (pageCurrent - 1) * pageSize;
    const pageEnd = pageCurrent * pageSize;

    return (
      <ul className='container_trending'>
        {newsError ? (
          <li className='container_trending_item'>
            <p>{newsError}</p>
          </li>
        ) : (
          trendingItems.slice(pageStart, pageEnd)
        )}
      </ul>
    );
  };

  const NavNewsButtons = () => (
    <div className='container_trending_nav'>
      <button
        onClick={(e) => {
          navigateNews(e, NEWS_ACTIONS.PREV);
        }}
        disabled={isButtonPrevDisabled}
      >
        <i className='ti-arrow-left'></i>
      </button>
      <button
        onClick={(e) => {
          navigateNews(e, NEWS_ACTIONS.NEXT);
        }}
        disabled={isButtonNextDisabled}
      >
        <i className='ti-arrow-right'></i>
      </button>
    </div>
  );

  return (
    <div
      className='widget friend-list stick-widget'
      onMouseEnter={() => autoPlayStop()}
      onMouseLeave={() => autoPlayStart()}
      onTouchStart={() => autoPlayStop()}
    //onTouchStop={() => autoPlayStart()}
    >
      <div className='row'>
        <i className='ti-announcement'></i>
        <p className='widget-title'>What's trending</p>
        <NavNewsButtons />
        <ShowTrendingItems />
      </div>
    </div>
  );
};

export default TrendingWidgetComponent;
