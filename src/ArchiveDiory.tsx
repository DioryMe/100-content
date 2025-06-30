import { useEffect, useState } from "react";
import { getGlobalDiograph } from "./utils/globalDiograph";
import { IDiographObject, IDioryObject } from "@diograph/diograph/types";
import { useNavigate, useParams } from "react-router-dom";
import containerStyles from "./ArchiveDiory.module.css";
import styles from "./DioryInfo.module.css";
import { calculateDateRanges, calculateGeoRanges } from "./utils/filterRanges";

const ArchiveDiory = () => {
  const [globalDiograph, setGlobalDiograph] = useState<IDiographObject>(null);
  const [diory, setDiory] = useState<IDioryObject>(null);
  const { focusId } = useParams();

  const navigate = useNavigate();

  const formattedDate = () => {
    if (diory) {
      return diory.date
        ? (() => {
            const date = new Date(diory.date);
            const day = date.getUTCDate();
            const month = date.getUTCMonth() + 1;
            const year = date.getUTCFullYear();
            const hours = date.getUTCHours();
            const minutes = date.getUTCMinutes().toString().padStart(2, "0");
            return `${day}.${month}.${year} ${hours}:${minutes}`;
          })()
        : "-";
    }
  };

  useEffect(() => {
    getGlobalDiograph().then((diograph) => {
      setGlobalDiograph(diograph);
    });
  }, []);

  useEffect(() => {
    if (globalDiograph) {
      const diory = globalDiograph[focusId];
      setDiory(diory);
    }
  }, [globalDiograph]);

  const getDateRangeLinks = () => {
    if (!(diory && diory.date)) return null;

    try {
      const ranges = calculateDateRanges(diory.date);
      return [
        { label: "±1 day", range: ranges.day },
        { label: "±1 week", range: ranges.week },
        { label: "±1 month", range: ranges.month },
      ];
    } catch (e) {
      console.error("Error calculating date ranges:", e);
      return null;
    }
  };

  const getGeoRangeLinks = () => {
    if (!(diory && diory.latlng)) return null;

    try {
      const ranges = calculateGeoRanges(diory.latlng);
      return [
        { label: "±10m", range: ranges["10m"] },
        { label: "±100m", range: ranges["100m"] },
        { label: "±1km", range: ranges["1km"] },
        { label: "±10km", range: ranges["10km"] },
      ];
    } catch (e) {
      console.error("Error calculating geo ranges:", e);
      return null;
    }
  };

  const dateRangeLinks = getDateRangeLinks();
  const geoRangeLinks = getGeoRangeLinks();

  return (
    <div className={containerStyles.container}>
      <div className={containerStyles.headerContainer}>
        <div
          className={containerStyles.headerSquare}
          // For some reason headerSquare class is not applied properly so needed to add these inline
          style={{ width: "80px", height: "100%", cursor: "pointer" }}
          onClick={() => {
            navigate("/archive");
          }}
        >
          <img src="https://www.svgrepo.com/download/305142/arrow-ios-back.svg" />
        </div>
      </div>
      {diory && (
        <>
          <div className={containerStyles.swiperContainer}>
            <div className={styles.image}>
              <img src={diory.image} />
            </div>
          </div>
          <div className={styles.infoSectionContainer}>
            <div></div>
            <div className={styles.infoContainer}>
              <div className={styles.infoColumn}>
                <div className={styles.fieldLabel}>Text:</div>
                <div>{diory.text || "-"}</div>
              </div>
              <div className={styles.infoColumn}>
                <div className={styles.fieldLabel}>Date:</div>
                <div>
                  <div>{formattedDate() || "-"}</div>
                  {dateRangeLinks && (
                    <div
                      style={{
                        marginTop: "5px",
                        display: "flex",
                        gap: "5px",
                        flexWrap: "wrap",
                      }}
                    >
                      {dateRangeLinks.map(({ label, range }) => (
                        <a
                          key={label}
                          href={`/archive?filterDateStart=${range.start}&filterDateEnd=${range.end}`}
                          style={{
                            fontSize: "12px",
                            padding: "2px 5px",
                            backgroundColor: "#e0e0e0",
                            textDecoration: "none",
                            borderRadius: "3px",
                            color: "#333",
                          }}
                        >
                          {label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className={styles.infoColumn}>
                <div className={styles.fieldLabel}>Latlng:</div>
                <div>
                  <div>
                    <a
                      target="_blank"
                      href={
                        diory.latlng
                          ? `https://google.com/search?q=${diory.latlng}`
                          : ""
                      }
                    >
                      {/* {diory.latlng || "-"} */}
                    </a>
                  </div>
                  {geoRangeLinks && (
                    <div
                      style={{
                        marginTop: "5px",
                        display: "flex",
                        gap: "5px",
                        flexWrap: "wrap",
                      }}
                    >
                      {geoRangeLinks.map(({ label, range }) => (
                        <a
                          key={label}
                          href={`/archive?latlngStart=${range.start}&latlngEnd=${range.end}`}
                          style={{
                            fontSize: "12px",
                            padding: "2px 5px",
                            backgroundColor: "#e0e0e0",
                            textDecoration: "none",
                            borderRadius: "3px",
                            color: "#333",
                          }}
                        >
                          {label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ArchiveDiory;
