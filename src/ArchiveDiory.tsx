import { useEffect, useState } from "react";
import { getGlobalDiograph } from "./utils/globalDiograph";
import { IDiographObject, IDioryObject } from "@diograph/diograph/types";
import { useNavigate, useParams } from "react-router-dom";
import containerStyles from "./ArchiveDiory.module.css";
import styles from "./DioryInfo.module.css";

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
        <div className={containerStyles.swiperContainer}>
          <div className={styles.image}>
            <img src={diory.image} />
          </div>
          <div
            style={{ marginTop: "50px", marginLeft: "50px" }}
            className={styles.infoSectionContainer}
          >
            <div className={styles.infoContainer}>
              <div className={styles.infoColumn}>
                <div className={styles.fieldLabel}>Text:</div>
                <div>{diory.text || "-"}</div>
              </div>
              <div className={styles.infoColumn}>
                <div className={styles.fieldLabel}>Date:</div>
                <div
                  onClick={() => {
                    navigate(
                      `/archive?filterDateStart=${diory.date}&filterDateEnd=${diory.date}`
                    );
                  }}
                >
                  {formattedDate() || "-" || "12.12.2012"}
                </div>
              </div>
              <div className={styles.infoColumn}>
                <div className={styles.fieldLabel}>Latlng:</div>
                <div>
                  <a
                    target="_blank"
                    href={
                      diory.latlng
                        ? `https://google.com/search?q=${diory.latlng}`
                        : ""
                    }
                  >
                    {diory.latlng || "-" || "64.42848, 41.58833"}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArchiveDiory;
