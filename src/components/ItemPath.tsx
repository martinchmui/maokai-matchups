import React, { useEffect, useState } from 'react';
import { fetchRiotVersion } from '../redux/slices/searchSlice';
import '../styles/itemPath.css';
import { calculateScaleFactor } from './ChampionDetails';

interface ItemPathProps {
  items: string[];
}

interface ItemData {
  name: string;
  description: string;
  image: {
    full: string;
  };
  gold: {
    total: number;
  };
}

const ItemPath: React.FC<ItemPathProps> = ({ items }) => {
  const [itemsData, setItems] = useState<Record<string, ItemData> | null>(null);
  const [scaleFactor, setScaleFactor] = useState<number | null>(null);

  const getItemsData = async () => {
    try {
      const latestVersion = await fetchRiotVersion();
      const response = await fetch(
        `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/item.json`
      );
      const data = await response.json();
      return data.data;
    } catch (error) {
      throw Error(error);
    }
  };

  const renderItems = () => {
    if (!itemsData) {
      return null;
    }

    return (
      <div
        className="item-path-container"
        style={{ transform: `scale(${scaleFactor})` }}
      >
        {items.map((item, key) => {
          const itemData =
            item === 'Sunfire Cape'
              ? Object.values(itemsData).find(
                  (object): object is ItemData =>
                    object.name === 'Sunfire Aegis'
                )
              : Object.values(itemsData).find((object): object is ItemData =>
                  object.name.includes(item)
                );

          return (
            itemData && (
              <React.Fragment key={key}>
                <img
                  src={`https://ddragon.leagueoflegends.com/cdn/13.8.1/img/item/${itemData.image.full}`}
                  alt={itemData.name}
                  data-tooltip-id="tooltip"
                  data-tooltip-content={itemData.name}
                  data-tooltip-desc={
                    itemData.description +
                    '<br>' +
                    itemData.gold.total +
                    ' gold'
                  }
                  height={50}
                  width={50}
                />
                {key !== 5 ? <h1>{'>'}</h1> : null}
              </React.Fragment>
            )
          );
        })}
      </div>
    );
  };

  useEffect(() => {
    const fetchItemsData = async () => {
      try {
        const itemsData = await getItemsData();
        setItems(itemsData);
      } catch (error) {
        throw Error(error);
      }
    };
    fetchItemsData();
  }, []);

  useEffect(() => {
    // Set the initial scale factor
    setScaleFactor(calculateScaleFactor(456, 0.66));

    // Recalculate the scale factor on window resize
    const handleResize = () => {
      const scaleFactor = calculateScaleFactor(456, 0.66);
      setScaleFactor(scaleFactor);
    };

    window.addEventListener('resize', handleResize);

    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <>{renderItems()}</>;
};

export default ItemPath;
