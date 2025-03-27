import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import {
  checkChannelLive,
  fetchChampionData,
  removeSpecialCharacters,
  reset,
} from "../redux/slices/dataSlice";
import RuneTable from "./RuneTable";
import Header from "./Header";
import VsBanner from "./VsBanner";
import "../styles/championDetails.css";
import { fetchChampionTable } from "../redux/slices/searchSlice";
import ItemPath from "./ItemPath";
import Footer from "./Footer";
import ErrorPage from "./ErrorPage";
import LiveNotification from "./LiveNotification";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";

export const calculateScaleFactor = (width: number, minRange: number) => {
  const minWidth = 320; // minimum width in pixels
  const maxWidth = width; // maximum width in pixels
  const scaleRange = 1 - minRange; // scaling range
  const viewportWidth = document.body.clientWidth; // viewport width in pixels
  const scaleFactor =
    0.61 + (scaleRange * (viewportWidth - minWidth)) / (maxWidth - minWidth);
  return scaleFactor < 1 ? scaleFactor : 1;
};

const ChampionDetails = () => {
  const { championName } = useParams();
  const dispatch = useAppDispatch();
  const championData = useAppSelector((state) => state.data.championData);
  const champions = useAppSelector((state) => state.search.champions);
  const mode = useAppSelector((state) => state.darkMode.mode);
  const champion = champions.find(
    (champion) =>
      removeSpecialCharacters(champion.name).toLowerCase() ===
      championName?.toLowerCase()
  );
  const imgUrl = champion?.imgUrl;
  const [loading, setLoading] = useState(true);
  const [dataFetched, setDataFetched] = useState(false);
  const [scaleFactor, setScaleFactor] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (championName) {
        await dispatch(fetchChampionData(championName));
      }
      if (champions.length === 0) {
        await dispatch(fetchChampionTable());
      }
      setLoading(false);
      setDataFetched(true);
    };

    dispatch(checkChannelLive());
    fetchData();

    return () => {
      dispatch(reset());
    };
  }, [dispatch, championName, champions.length, champion, loading]);

  useEffect(() => {
    if (dataFetched && championData.name) {
      document.title = `Maokai vs ${championData.name}`;
    } else if (!champion && !loading) {
      document.title = "Page Not Found";
    }
  }, [dataFetched, championData.name, champion, loading]);

  useEffect(() => {
    // Set the initial scale factor
    setScaleFactor(calculateScaleFactor(439, 0.61));

    // Recalculate the scale factor on window resize
    const handleResize = () => {
      const scaleFactor = calculateScaleFactor(439, 0.61);
      setScaleFactor(scaleFactor);
    };

    window.addEventListener("resize", handleResize);

    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div id="root-container" className={`root-${mode}`}>
      {!loading && champion === undefined ? (
        <ErrorPage missingChamp={true} />
      ) : (
        <>
          {" "}
          <div className="main-content">
            <Header />
            {!loading && championName !== "illaoi" ? (
              <>
                <VsBanner
                  name={championData.name}
                  imgUrl={imgUrl ?? ""}
                  difficulty={championData.difficulty}
                  summoners={championData.summoners}
                />
                <div className="container-padding">
                  <div className={`matchup-details ${mode}`}>
                    <div className="left-column">
                      <h3>Runes:</h3>
                      <RuneTable scalingFactor={1.5} />
                    </div>
                    <div className="right-column">
                      <h3>Items:</h3>
                      <ItemPath items={championData.items} />
                      <h3>Notes:</h3>
                      <p>{championData.notes}</p>
                    </div>
                  </div>
                </div>
              </>
            ) : !loading && championName === "illaoi" ? (
              <>
                <VsBanner
                  name={championData.name}
                  imgUrl={imgUrl ?? ""}
                  difficulty={championData.difficulty}
                  summoners={[]}
                />
                <div className="container-padding">
                  <div className={`matchup-details ${mode}`}>
                    <img src="stop-sign.png" alt="stop-sign" />
                  </div>
                </div>
              </>
            ) : (
              <div className={`champion-details-spinner spinner-${mode}`}></div>
            )}
          </div>
          {!loading ? (
            <>
              <Footer />
              <LiveNotification />
            </>
          ) : null}
        </>
      )}
      <Tooltip
        id="tooltip"
        place="top"
        float={true}
        className="tooltip"
        render={({ content, activeAnchor }) => (
          <div>
            {content ? <h4>{content}</h4> : null}
            <div
              dangerouslySetInnerHTML={{
                __html: activeAnchor?.getAttribute("data-tooltip-desc") ?? "",
              }}
              className="tooltip-desc"
            />
          </div>
        )}
      />
    </div>
  );
};

export default ChampionDetails;
