import { hooks, requests } from '@application';
import { useEffect } from 'react';
import { Tag, TYPE_TAG } from '@chess-tent/models';

const { useRecord, useApi } = hooks;

export const useTags = () => {
  const { fetch, response, loading, error, reset } = useApi(requests.tags);
  const [tags, setTags] = useRecord<Tag[]>('tags', TYPE_TAG);
  useEffect(() => {
    if (!response || tags) {
      return;
    }
    setTags(response.data);
  }, [reset, response, setTags, tags]);
  useEffect(() => {
    if (loading || response || error) {
      return;
    }
    fetch();
  }, [fetch, loading, response, error]);
  return tags || [];
};
