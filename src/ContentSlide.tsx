import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux"; // updated import for dispatch hook
import styles from "./ContentSwipes.module.css";
import { IDioryObject } from "@diograph/diograph/types";
import { RootState } from "./store/store";
import { loadDioryContent } from "./store/diorySlice";
import { FiImage, FiRefreshCcw, FiVideo } from "react-icons/fi";

export const ContentSlide = ({ diory }: { diory: IDioryObject }) => {
  const dispatch = useDispatch();

  const dioryContent = useSelector(
    (state: RootState) => state.diory.contentUrls[diory.id]
  );

  // Use the new contentUrlLoading state which tracks the status, error and loadedContentUrl
  const contentLoadingState = useSelector(
    (state: RootState) => state.diory.contentUrlLoading[diory.id]
  );
  const loadingStatus = contentLoadingState?.status;

  // Determine if the diory is a video using its encodingFormat from diory.data
  const isVideo =
    diory.data && diory.data[0] && diory.data[0].encodingFormat
      ? diory.data[0].encodingFormat.startsWith("video")
      : false;

  // Choose which media to render: if loading is fulfilled, use loadedContentUrl; otherwise use fallback diory.image
  const mediaElement =
    dioryContent && dioryContent.url && loadingStatus === "fulfilled" ? (
      isVideo ? (
        <video controls loop style={{ maxHeight: "90vh", width: "100%" }}>
          <source src={dioryContent.url} type={dioryContent.mimeType} />
          <track kind="captions" />
        </video>
      ) : (
        <img src={dioryContent.url} style={{ width: "100%" }} />
      )
    ) : (
      <img src={diory.image} style={{ width: "100%" }} />
    );

  // Trigger loading if not currently loading (or if load was rejected and a retry is desired)
  const handleLoadContent = () => {
    if (!(dioryContent && dioryContent.url) || loadingStatus !== "loading") {
      dispatch(loadDioryContent(diory) as any);
    }
  };

  return (
    <div
      className={styles.fullImage}
      style={{ cursor: "grab", position: "relative" }}
    >
      <div className="swiper-zoom-container" style={{ position: "relative" }}>
        {mediaElement}
        {/* Show an overlay icon when the content is not yet fulfilled */}
        {(!(dioryContent && dioryContent.url) ||
          loadingStatus !== "fulfilled") && (
          <div
            onClick={handleLoadContent}
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              cursor: "pointer",
              zIndex: 10,
            }}
          >
            {loadingStatus === "loading" ? (
              // Spinner animation when loading
              <div
                style={{
                  width: 24,
                  height: 24,
                  border: "4px solid #f3f3f3",
                  borderTop: "4px solid #3498db",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                }}
              />
            ) : loadingStatus === "rejected" ? (
              // Retry icon for a rejected load; colored red as an indicator
              <FiRefreshCcw size={24} color="red" />
            ) : isVideo ? (
              <FiVideo size={48} />
            ) : (
              <FiImage size={48} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
