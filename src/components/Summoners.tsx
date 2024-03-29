import React, { useEffect, useState } from 'react';
import { fetchRiotVersion } from '../redux/slices/searchSlice';
import '../styles/itemPath.css';

interface ItemPathProps {
  summoners: string[];
}

interface SummonerData {
  name: string;
  description: string;
  image: {
    full: string;
  };
}

const Summoners: React.FC<ItemPathProps> = ({ summoners }) => {
  const [summonersData, setSummoners] = useState<Record<
    string,
    SummonerData
  > | null>(null);
  const [latestVersion, setLatestVersion] = useState('');

  const getSummonersData = async () => {
    try {
      const latestVersion = await fetchRiotVersion();
      setLatestVersion(latestVersion);
      const response = await fetch(
        `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/summoner.json`
      );
      const data = await response.json();
      return data.data;
    } catch (error) {
      throw Error(error);
    }
  };

  const renderItems = () => {
    if (!summonersData) {
      return null;
    }

    return (
      <>
        {summoners.map((summoner, key) => {
          const summonerData = Object.values(summonersData).find(
            (object): object is SummonerData => object.name.includes(summoner)
          );

          return (
            summonerData && (
              <img
                src={`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/img/spell/${summonerData.image.full}`}
                key={key}
                alt={summonerData.name}
                data-tooltip-id="tooltip"
                data-tooltip-content={summonerData.name}
                data-tooltip-desc={summonerData.description}
                height={50}
                width={50}
                className="summoners"
              />
            )
          );
        })}
      </>
    );
  };

  useEffect(() => {
    const fetchSummonersData = async () => {
      try {
        const summonersData = await getSummonersData();
        setSummoners(summonersData);
      } catch (error) {
        throw Error(error);
      }
    };
    fetchSummonersData();
  }, []);

  return <div className="img-container">{renderItems()}</div>;
};

export default Summoners;
