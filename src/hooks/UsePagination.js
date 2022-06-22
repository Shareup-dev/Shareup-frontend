import {useEffect, useState} from 'react';

const usePagination = (
  pageSize,
  initPageNumber,
  paginationService
) => {
  const [loading, setLoading] = useState(false);
  const [pageNo, setPageNo] = useState(initPageNumber?initPageNumber:0);
  const [endReached, setEndReached] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    // console.log(pageNo,'useef')
    const fetchData = async () => {
      await setLoading(true);
      try {
        if(!endReached){
          const {data} = await paginationService(pageNo, pageSize);
          await setData(data);
          // console.log(data.length,pageNo,pageSize)
          if (data.length < pageSize) {
            console.log(endReached,data.length , pageSize)
            await setEndReached(true);
            // return;
          }
        }
        // else if (endReached) setEndReached(false);
      } catch (e) {
        console.log(e);
      }

      await setLoading(false);
    };
    fetchData();
  },[pageNo,endReached]);

  useEffect (()=>{

  });

  const onBeforeReachEnd = () => {
    // console.log(pageNo,endReached,'before')
    if (endReached) {
      return; 
    }else {
      setPageNo(prev => prev + 1);
    }
  };

  return {
    data,
    endReached,
    loading,
    onBeforeReachEnd,
    pageNo,
  };
};



export default usePagination;