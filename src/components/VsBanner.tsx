import React from 'react';
import '../styles/vsBanner.css';
import Summoners from './Summoners';
import { useAppSelector } from '../redux/hooks';

interface VsBannerProps {
  name: string;
  imgUrl: string;
  difficulty: string;
  summoners: string[] | [];
}

const VsBanner: React.FC<VsBannerProps> = ({
  name,
  imgUrl,
  difficulty,
  summoners,
}) => {
  const mode = useAppSelector((state) => state.darkMode.mode);

  return (
    <div className="container-padding">
      <div className={`banner ${mode}`}>
        {name ? (
          <div className="banner-title">
            <img
              src={imgUrl.replace(/\/\w+\.png$/, `/Maokai.png`)}
              alt={name}
              height={50}
              width={50}
              className="icon"
            />
            <h3>Maokai vs {name}</h3>{' '}
            <img
              src={imgUrl}
              alt={name}
              height={50}
              width={50}
              className="icon"
            />
          </div>
        ) : null}
        {difficulty ? (
          <div className="difficulty-container">
            <h3>{`Difficulty: ${difficulty}`}</h3>
            <div className="bar-size">
              <span className={`difficulty-bar ${difficulty.toLowerCase()}`} />
              <span
                className={`difficulty-bar ${difficulty.toLowerCase()} ${
                  difficulty === 'Easy' ? 'not-active' : ''
                }`}
              />
              <span
                className={`difficulty-bar ${difficulty.toLowerCase()} ${
                  difficulty === 'Easy' || difficulty === 'Moderate'
                    ? 'not-active'
                    : ''
                }`}
              />
            </div>
          </div>
        ) : null}
        {summoners.length > 0 ? (
          <div className="summoners-container">
            <h3>Summoners:</h3>
            <Summoners summoners={summoners} />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default VsBanner;
