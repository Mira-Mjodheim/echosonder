import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../../src/store';
import ContentEditor from '../../src/components/ContentEditor';

describe('ContentEditor component', () => {
  it('renders without crashing', () => {
    const { getByPlaceholderText } = render(
      <Provider store={store}>
        <ContentEditor />
      </Provider>
    );
    expect(getByPlaceholderText('Titre')).toBeInTheDocument();
  });

  it('calls onChange when input changes', () => {
    const { getByPlaceholderText } = render(
      <Provider store={store}>
        <ContentEditor />
      </Provider>
    );
    const input = getByPlaceholderText('Titre');
    fireEvent.change(input, { target: { value: 'Nouveau titre' } });
    expect(input.value).toBe('Nouveau titre');
  });

  it('calls onSubmit when form is submitted', async () => {
    const { getByPlaceholderText, getByText } = render(
      <Provider store={store}>
        <ContentEditor />
      </Provider>
    );
    const input = getByPlaceholderText('Titre');
    const submitButton = getByText('Enregistrer');
    fireEvent.change(input, { target: { value: 'Nouveau titre' } });
    fireEvent.click(submitButton);
    await waitFor(() => expect(submitButton).not.toBeDisabled());
  });

  it('displays error message when API call fails', async () => {
    // Mock API call failure
    global.fetch = jest.fn(() => Promise.reject(new Error('API call failed')));
    const { getByPlaceholderText, getByText } = render(
      <Provider store={store}>
        <ContentEditor />
      </Provider>
    );
    const input = getByPlaceholderText('Titre');
    const submitButton = getByText('Enregistrer');
    fireEvent.change(input, { target: { value: 'Nouveau titre' } });
    fireEvent.click(submitButton);
    await waitFor(() => expect(getByText('Erreur lors de l\'enregistrement')).toBeInTheDocument());
  });

  it('displays success message when API call succeeds', async () => {
    // Mock API call success
    global.fetch = jest.fn(() => Promise.resolve({ json: () => Promise.resolve({ message: 'Contenu enregistré avec succès' }) }));
    const { getByPlaceholderText, getByText } = render(
      <Provider store={store}>
        <ContentEditor />
      </Provider>
    );
    const input = getByPlaceholderText('Titre');
    const submitButton = getByText('Enregistrer');
    fireEvent.change(input, { target: { value: 'Nouveau titre' } });
    fireEvent.click(submitButton);
    await waitFor(() => expect(getByText('Contenu enregistré avec succès')).toBeInTheDocument());
  });
});