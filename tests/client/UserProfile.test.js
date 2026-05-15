import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../src/store';
import UserProfile from '../src/components/UserProfile';
import api from '../src/utils/api';

jest.mock('../src/utils/api');

describe('UserProfile component', () => {
  const user = {
    _id: '123',
    name: 'John Doe',
    email: 'john@example.com',
  };

  const props = {
    user,
  };

  beforeEach(() => {
    api.get.mockReset();
  });

  it('renders user profile information', async () => {
    api.get.mockResolvedValue({ data: user });

    const { getByText } = render(
      <Provider store={store}>
        <UserProfile {...props} />
      </Provider>
    );

    await waitFor(() => getByText(user.name));
    await waitFor(() => getByText(user.email));

    expect(getByText(user.name)).toBeInTheDocument();
    expect(getByText(user.email)).toBeInTheDocument();
  });

  it('calls API to update user profile', async () => {
    const updatedUser = { ...user, name: 'Jane Doe' };
    api.put.mockResolvedValue({ data: updatedUser });

    const { getByText } = render(
      <Provider store={store}>
        <UserProfile {...props} />
      </Provider>
    );

    const editButton = getByText('Éditer');
    fireEvent.click(editButton);

    const input = getByPlaceholderText('Nom');
    fireEvent.change(input, { target: { value: updatedUser.name } });

    const saveButton = getByText('Sauvegarder');
    fireEvent.click(saveButton);

    await waitFor(() => expect(api.put).toHaveBeenCalledTimes(1));
    expect(api.put).toHaveBeenCalledWith(`/users/${user._id}`, updatedUser);
  });

  it('displays error message on API error', async () => {
    const error = new Error('API error');
    api.get.mockRejectedValue(error);

    const { getByText } = render(
      <Provider store={store}>
        <UserProfile {...props} />
      </Provider>
    );

    await waitFor(() => getByText('Erreur lors du chargement du profil'));
    expect(getByText('Erreur lors du chargement du profil')).toBeInTheDocument();
  });
});