import styles from "./DioryInfo.module.css";

export const DioryInfo = ({ diory }) => {
  const formattedDate = diory.date
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

  return (
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
            <a target="_blank" href="/archive">
              {diory.date || "-" || "12.12.2012"}
            </a>
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
  );
};
