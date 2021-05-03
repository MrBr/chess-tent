import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { LoadMoreProps } from '@types';
import styled from '@emotion/styled';

const LoadMore = ({ loading, loadMore, noMore }: LoadMoreProps) => {
  const { ref, inView } = useInView();
  // Ready is used to debounce load more so that dom can actually rerender and hide "LoadMore"
  const [ready, setReady] = useState<boolean>(false);

  useEffect(() => {
    inView && !loading && !noMore && setTimeout(() => setReady(true), 50);
  }, [inView, loadMore, loading, noMore]);
  useEffect(() => {
    if (inView && !loading && !noMore && ready) {
      setReady(false);
      loadMore();
    }
  }, [inView, loadMore, loading, noMore, ready]);
  const className = loading ? '' : 'false-empty';
  return (
    <div ref={ref} className={className}>
      {loading ? 'Loading...' : ''}
    </div>
  );
};

export default styled(LoadMore)({
  // TODO
});
