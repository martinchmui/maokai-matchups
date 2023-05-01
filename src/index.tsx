import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import App from './components/App';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ChampionDetails from './components/ChampionDetails';
import ErrorPage from './components/ErrorPage';
import './styles/root.css';
import { fetchRiotData, fetchRiotVersion } from './redux/slices/searchSlice';
import { fetchSheetData } from './redux/slices/dataSlice';

const container = document.getElementById('root')!;
const root = createRoot(container);
async function loader() {
  const latestVersion = await fetchRiotVersion();
  const [riotData, sheetData] = await Promise.all([
    fetchRiotData(latestVersion),
    fetchSheetData(),
  ]);
  return { latestVersion, riotData, sheetData };
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    loader,
    errorElement: <ErrorPage />,
  },
  {
    path: ':championName',
    element: <ChampionDetails />,
    loader,
    errorElement: <ErrorPage />,
  },
]);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
