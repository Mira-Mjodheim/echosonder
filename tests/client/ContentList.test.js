import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from '../src/reducers';
import ContentList from '../src/components/ContentList';
import { getContents } from '../src/utils/api';

jest.mock('../src/utils/api');

describe('ContentList component', () => {
  const store = createStore(rootReducer);
  const contents = [
    { _id: '1', title: 'Content 1', text: 'This is content 1' },
    { _id: '2', title: 'Content 2', text: 'This is content 2' },
  ];

  beforeEach(() => {
    getContents.mockResolvedValue(contents);
  });

  it('renders content list', async () => {
    const { getByText } = render(
      <Provider store={store}>
        <ContentList />
      </Provider>
    );

    await waitFor(() => getByText('Content 1'));
    expect(getByText('Content 1')).toBeInTheDocument();
    expect(getByText('This is content 1')).toBeInTheDocument();

    await waitFor(() => getByText('Content 2'));
    expect(getByText('Content 2')).toBeInTheDocument();
    expect(getByText('This is content 2')).toBeInTheDocument();
  });

  it('calls getContents on mount', async () => {
    render(
      <Provider store={store}>
        <ContentList />
      </Provider>
    );

    await waitFor(() => expect(getContents).toHaveBeenCalledTimes(1));
  });

  it('renders loading indicator while fetching contents', () => {
    getContents.mockImplementation(() => new Promise((resolve) => {}));

    const { getByText } = render(
      <Provider store={store}>
        <ContentList />
      </Provider>
    );

    expect(getByText('Loading...')).toBeInTheDocument();
  });

  it('renders error message on error', async () => {
    getContents.mockRejectedValue(new Error('Failed to fetch contents'));

    const { getByText } = render(
      <Provider store={store}>
        <ContentList />
      </Provider>
    );

    await waitFor(() => getByText('Error: Failed to fetch contents'));
    expect(getByText('Error: Failed to fetch contents')).toBeInTheDocument();
  });
});