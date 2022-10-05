import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import { RecordBase } from '@types';

import { collectionRecipe, createRecord, useRecordInit } from '../index';
import { mockStore } from './_helpers';

describe('useRecordInit', () => {
  test('should init record', function () {
    // TODO - mock redux context
    const initRecord = createRecord<RecordBase<string[], { prop: string }>>({
      initialValue: ['test'],
      initialMeta: { prop: 'prop' },
      ...collectionRecipe,
    });
    const store = mockStore();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );
    const {
      result: { current: record },
    } = renderHook(() => useRecordInit(initRecord, 'key'), {
      wrapper,
    });
    expect(record.get()?.meta.prop).toStrictEqual('prop');
    expect(record.get()?.value).toStrictEqual(['test']);
  });
});
