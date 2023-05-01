import React, { useEffect, useRef, useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import {
  fetchChampionTable,
  setFocus,
  setValue,
} from '../redux/slices/searchSlice';
import '../styles/championTable.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { removeSpecialCharacters } from '../redux/slices/dataSlice';

const ChampionTable = () => {
  const {
    champions: data,
    value: search,
    status,
    isFocused: focus,
  } = useAppSelector((state) => state.search);
  const mode = useAppSelector((state) => state.darkMode.mode);
  const formRef = useRef<HTMLFormElement>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sortedData.length > 0) {
      navigate(sortedData[0].name.toLowerCase());
    }
  };

  const filteredData = useMemo(
    () =>
      data.filter((champion) =>
        champion.name.toLowerCase().includes(search.toLowerCase())
      ),
    [data, search]
  );

  const sortedData = useMemo(() => {
    return filteredData.sort((a, b) => {
      const aMatch = a.name.toLowerCase().indexOf(search.toLowerCase());
      const bMatch = b.name.toLowerCase().indexOf(search.toLowerCase());
      return aMatch - bMatch;
    });
  }, [filteredData, search]);

  const renderChampionTable = () => {
    if (status === 'loading') {
      return <div className="champion-table-spinner"></div>;
    }
    return (
      <ul className="champion-table">
        {filteredData.map((champion, key) => (
          <li
            key={key}
            onClick={() =>
              navigate(removeSpecialCharacters(champion.name).toLowerCase())
            }
          >
            <img
              src={champion.imgUrl}
              alt={champion.name}
              className="champ-icon"
              height={40}
              width={40}
            />
          </li>
        ))}
      </ul>
    );
  };

  const renderSearchSuggestions = () => {
    if (!(search.length > 0 && filteredData.length > 0 && focus)) {
      return null;
    }
    return (
      <ul className={`search-suggestions search-suggestions-${mode}`}>
        {sortedData.map((champion, key) => (
          <li
            key={key}
            onMouseDown={(event) => event.preventDefault()}
            onClick={(event) => {
              event.preventDefault();
              const formElement = formRef.current;
              if (
                formElement instanceof HTMLFormElement &&
                sortedData.length > 0
              ) {
                navigate(removeSpecialCharacters(champion.name).toLowerCase());
              }
            }}
            className={`search-results${
              key === 0 ? `-active active-${mode}` : ''
            } search-results-${mode}`}
          >
            {champion.name}
          </li>
        ))}
      </ul>
    );
  };

  useEffect(() => {
    dispatch(fetchChampionTable());
    return () => {
      dispatch(setValue(''));
    };
  }, [dispatch, location]);

  return (
    <div className="container-padding">
      <div className="shadow">{renderChampionTable()}</div>
      <section className="search-section">
        <div className="section-div">
          <form onSubmit={handleFormSubmit} ref={formRef}>
            <input
              type="search"
              className={`search-bar ${
                search.length > 0 && filteredData.length > 0 && focus
                  ? 'border-focus'
                  : ''
              } search-bar-${mode} `}
              onFocus={() => dispatch(setFocus(true))}
              onBlur={() => dispatch(setFocus(false))}
              autoFocus
              placeholder="Search Champion"
              value={search}
              onChange={(event) => dispatch(setValue(event.target.value))}
            />
            <label>
              <img
                className={`search-icon search-icon-${mode}`}
                alt="search"
                src="/magnifying-glass-solid.svg"
                width={18}
                height={18}
                loading="lazy"
              />
            </label>
            {renderSearchSuggestions()}
          </form>
        </div>
      </section>
    </div>
  );
};

export default ChampionTable;
