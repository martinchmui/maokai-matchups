import React, { useEffect, useState } from 'react';
import { fetchRiotVersion } from '../redux/slices/searchSlice';
import { useAppSelector } from '../redux/hooks';
import '../styles/runeTable.css';
import 'react-tooltip/dist/react-tooltip.css';
import { json } from 'react-router-dom';
import { calculateScaleFactor } from './ChampionDetails';

interface RuneTableProps {
  scalingFactor: number;
}

const RuneTable: React.FC<RuneTableProps> = ({ scalingFactor }) => {
  interface RunesDetail {
    id: string;
    key: string;
    icon: string;
    name: string;
    shortDesc: string;
    longDesc: string;
  }

  interface ShardsDetail {
    name: string;
    iconPath: string;
    longDesc: string;
  }

  interface Row {
    runes: RunesDetail[];
  }

  interface RunePathData {
    id: string;
    key: string;
    icon: string;
    name: string;
    slots: Row[];
  }

  const [primaryRunes, setPrimary] = useState<RunePathData | null>(null);
  const [secondaryRunes, setSecondary] = useState<RunePathData | null>(null);
  const [shards, setShards] = useState<ShardsDetail[] | null>(null);
  const [scaleFactor, setScaleFactor] = useState<number | null>(null);
  const championData = useAppSelector((state) => state.data.championData);
  const shardsUrl =
    'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perk-images/statmods/';

  const getRunePathByRuneName = async (runeName: string) => {
    try {
      const latestVersion = await fetchRiotVersion();
      const response = await fetch(
        `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/runesReforged.json`
      );
      const data = await response.json();
      return data.find((runePath: { slots: any[] }) =>
        runePath.slots.some((slot) =>
          slot.runes.some((rune: { name: string }) => rune.name === runeName)
        )
      );
    } catch (error) {
      throw json(error);
    }
  };

  const getRuneShards = async () => {
    try {
      const response = await fetch(
        'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perks.json'
      );
      const data = await response.json();
      const filteredData = data.filter(
        (rune: { id: { toString: () => string } }) =>
          rune.id.toString().startsWith('500')
      );
      const modifiedData = filteredData.map((item: { iconPath: string }) => {
        return {
          ...item,
          iconPath: item.iconPath.toLowerCase().split('/').pop(),
        };
      });
      return modifiedData;
    } catch (error) {
      throw Error(error);
    }
  };

  const renderPrimaryRunes = () => {
    if (primaryRunes && primaryRunes.slots[0]) {
      return (
        <div>
          {primaryRunes.slots[0].runes.map((rune, key) => {
            return (
              <img
                data-tooltip-id="tooltip"
                data-tooltip-content={rune.name}
                data-tooltip-desc={rune.longDesc}
                key={key}
                src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/${rune.icon.toLowerCase()}`}
                alt={rune.name}
                height={50 * scalingFactor}
                width={50 * scalingFactor}
                className={`runes${
                  rune.name === championData.primaryRunes.keystone
                    ? '-active'
                    : ''
                }`}
              />
            );
          })}
          <div>
            {primaryRunes.slots.map((row, key) => {
              if (key > 0) {
                return (
                  <div key={key} className="row">
                    {row.runes.map((rune, key) => {
                      return (
                        <img
                          data-tooltip-id="tooltip"
                          data-tooltip-content={rune.name}
                          data-tooltip-desc={rune.longDesc}
                          src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/${rune.icon.toLowerCase()}`}
                          alt={rune.name}
                          key={key}
                          height={30 * scalingFactor}
                          width={30 * scalingFactor}
                          className={`minor-primary runes${
                            championData.primaryRunes.minors.includes(rune.name)
                              ? '-active'
                              : ''
                          }`}
                        />
                      );
                    })}
                  </div>
                );
              } else {
                return null;
              }
            })}
          </div>
        </div>
      );
    }
  };

  const renderSecondaryRunes = () => {
    if (secondaryRunes && secondaryRunes.slots[0]) {
      return (
        <div>
          <div>
            {secondaryRunes.slots.map((row, key) => {
              if (key > 0) {
                return (
                  <div key={key} className="row">
                    {row.runes.map((rune, key) => {
                      return (
                        <img
                          data-tooltip-id="tooltip"
                          data-tooltip-content={rune.name}
                          data-tooltip-desc={rune.longDesc}
                          src={`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/${rune.icon.toLowerCase()}`}
                          alt={rune.name}
                          key={key}
                          height={30 * scalingFactor}
                          width={30 * scalingFactor}
                          className={`minor-secondary runes${
                            championData.secondaryRunes.includes(rune.name)
                              ? '-active'
                              : ''
                          }`}
                        />
                      );
                    })}
                  </div>
                );
              } else {
                return null;
              }
            })}
            {renderShards()}
          </div>
        </div>
      );
    }
  };

  const renderShards = () => {
    const shardRows = [
      [2, 5, 4],
      [2, 1, 0],
      [3, 1, 0],
    ];
    if (shards) {
      return (
        <table className="shards-table">
          <tbody>
            {shardRows.map((row, index) => (
              <tr key={index}>
                {row.map((shardIndex) => (
                  <td key={shardIndex}>
                    <img
                      data-tooltip-id="tooltip"
                      data-tooltip-desc={shards[shardIndex].longDesc}
                      src={shardsUrl + shards[shardIndex].iconPath}
                      alt={shards[shardIndex].name}
                      height={20 * scalingFactor}
                      width={20 * scalingFactor}
                      className={`shards runes${
                        shards[shardIndex]?.name?.includes(
                          championData.shards[index]
                        ) ||
                        championData?.shards[index]?.includes(
                          shards[shardIndex].name
                        )
                          ? 'active'
                          : ''
                      }`}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    } else return null;
  };

  useEffect(() => {
    const fetchRunesData = async () => {
      try {
        const primaryRunes = await getRunePathByRuneName(
          championData.primaryRunes.keystone
        );
        const secondaryRunes = await getRunePathByRuneName(
          championData.secondaryRunes[0]
        );
        const shards = await getRuneShards();
        setPrimary(primaryRunes);
        setSecondary(secondaryRunes);
        setShards(shards);
      } catch (error) {
        throw Error(error);
      }
    };
    fetchRunesData();
  }, [championData.primaryRunes.keystone, championData.secondaryRunes]);

  useEffect(() => {
    // Set the initial scale factor
    setScaleFactor(calculateScaleFactor(468, 0.64));

    // Recalculate the scale factor on window resize
    const handleResize = () => {
      const scaleFactor = calculateScaleFactor(468, 0.64);
      setScaleFactor(scaleFactor);
    };

    window.addEventListener('resize', handleResize);

    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      className="rune-table-container"
      style={{ transform: `scale(${scaleFactor})`, transformOrigin: 'left' }}
    >
      {renderPrimaryRunes()}
      {renderSecondaryRunes()}
    </div>
  );
};

export default RuneTable;
