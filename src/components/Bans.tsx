import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { fetchBans } from '../redux/slices/dataSlice';
import '../styles/bans.css';

const Bans = () => {
  const bans = useAppSelector((state) => state.data.bans);
  const status = useAppSelector((state) => state.search.status);
  const champions = useAppSelector((state) => state.search.champions);
  const mode = useAppSelector((state) => state.darkMode.mode);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchBans());
  }, [dispatch]);
  return (
    <div className="container-padding">
      <div className={`bans-container ${mode}`}>
        <h2>Recommended Bans:</h2>
        <div className="champions-container">
          {bans.map((ban, key) => {
            const imgUrl = champions.find(
              (champion) => champion.name === ban.name
            )?.imgUrl;
            return (
              <div className="champion" key={key}>
                <div className="img-name">
                  <img
                    src={imgUrl}
                    alt={ban.name}
                    height={100}
                    width={100}
                    className={`ban-image ${
                      status === 'loading' ? 'hidden' : ''
                    }`}
                  />
                  <p className="ban-name">{ban.name}</p>
                </div>
                <p>{ban.comment}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Bans;
