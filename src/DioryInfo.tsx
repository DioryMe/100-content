import styles from "./DioryInfo.module.css";
import { calculateDateRanges, calculateGeoRanges } from "./utils/filterRanges";

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

  const getDateRangeLinks = () => {
    if (!diory.date) return null;

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
    if (!diory.latlng) return null;

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
            <div>{formattedDate || "-"}</div>
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
                {diory.latlng || "-"}
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
  );
};
