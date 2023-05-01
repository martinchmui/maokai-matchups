import React, { useEffect } from 'react';
import ChampionTable from './ChampionTable';
import Header from './Header';
import Bans from './Bans';
import Footer from './Footer';
import { checkChannelLive } from '../redux/slices/dataSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import LiveNotification from './LiveNotification';

const App = () => {
  const dispatch = useAppDispatch();
  const mode = useAppSelector((state) => state.darkMode.mode);

  useEffect(() => {
    document.title = 'Maokai Matchups';
    dispatch(checkChannelLive());
  }, [dispatch]);

  return (
    <div id="root-container" className={`root-${mode}`}>
      <div className="main-content">
        <Header />
        <ChampionTable />
        <Bans />
      </div>
      <Footer />
      <LiveNotification />
    </div>
  );
};

export default App;
