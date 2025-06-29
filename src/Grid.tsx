import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store/store";
import { setFocus } from "./store/diorySlice";
import { FiHome } from "react-icons/fi";

export const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
  gap: "10px",
  padding: "10px",
  marginTop: "30px",
};

export const badgeStyle = {
  position: "absolute",
  top: "5px",
  left: "5px",
  padding: "2px 4px",
  backgroundColor: "grey",
  color: "#fff",
  fontSize: "12px",
  borderRadius: "2px",
};

const Grid = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const stateDiory = useSelector((state: RootState) => state.diory);
  const { diograph, focusId, storyId, storyDiories, stories } = stateDiory;
  const { focusId: urlParamFocusId } = useParams();

  useEffect(() => {
    if (focusId) {
      navigate(`/diory/${focusId}/grid?storyId=${storyId}`);
      return;
    }
    if (urlParamFocusId) {
      const storyId = new URLSearchParams(search).get("storyId");
      dispatch(setFocus({ focusId: urlParamFocusId, storyId }));
    }
  }, [focusId, urlParamFocusId]);

  // Functions for previous/next diory navigation
  const focusPrevious = () => {
    const currentIndex = storyDiories.findIndex((item) => item.id === focusId);
    if (currentIndex > 0) {
      const prev = storyDiories[currentIndex - 1];
      dispatch(setFocus({ focusId: prev.id, storyId }));
    }
  };

  const focusNext = () => {
    const currentIndex = storyDiories.findIndex((item) => item.id === focusId);
    if (currentIndex !== -1 && currentIndex < storyDiories.length - 1) {
      const next = storyDiories[currentIndex + 1];
      dispatch(setFocus({ focusId: next.id, storyId }));
    }
  };

  // Bind left and right arrow keys for navigation.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        focusPrevious();
      } else if (e.key === "ArrowRight") {
        focusNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [storyDiories, focusId, storyId]);

  const focusSelected = (id: string) => {
    const dioryInFocus = storyDiories.find((item) => item.id === id);
    if (dioryInFocus.links && dioryInFocus.links.length && id === focusId) {
      const firstDioryIdOfStory = Object.values(
        diograph[dioryInFocus.id].links
      )[0].id;
      dispatch(setFocus({ focusId: firstDioryIdOfStory, storyId: id }));
      return;
    }
    if (id === focusId) {
      navigate(`/diory/${id}/content?storyId=${storyId}`);
    }
    dispatch(setFocus({ focusId: id, storyId }));
  };

  const selectedHasMultipleStories = stories.length > 1;
  const otherStories = stories.filter((story) => story.id !== storyId);

  const selectedIndex = storyDiories.findIndex((item) => item.id === focusId);
  let selectedItem = null;

  if (selectedIndex !== -1) {
    selectedItem = storyDiories[selectedIndex];
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          gap: "10px",
          alignItems: "center",
          marginBottom: "10px",
          height: "70px",
        }}
      >
        <button onClick={() => navigate(`/`)}>
          <FiHome size={24} />
        </button>
        {stories.find((story) => story.id === storyId)?.text}
        {selectedHasMultipleStories &&
          otherStories.map((otherStory) => (
            <button
              key={otherStory.id}
              onClick={() => {
                dispatch(
                  setFocus({ focusId: focusId, storyId: otherStory.id })
                );
                navigate(`/diory/${focusId}/grid?storyId=${otherStory.id}`);
              }}
            >
              {`${otherStory.text}`}
            </button>
          ))}
      </div>

      {/* Enlarged selected item with fixed height container for stable layout */}
      {selectedItem && (
        <div
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            height: "300px", // fixed height
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div onClick={() => focusSelected(selectedItem.id)}>
            <div style={{ position: "relative" }}>
              {selectedItem.text && (
                <div style={badgeStyle as any}>{selectedItem.text}</div>
              )}
              <img
                src={selectedItem.image}
                alt={selectedItem.id}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                  display: "block",
                  margin: "auto",
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Grid of items with square cells, centered content, and a gray dot if item has links */}
      <div style={gridStyle}>
        {storyDiories.map(({ id, image, links }) => (
          <div
            key={id}
            onClick={() => focusSelected(id)}
            style={{
              position: "relative", // added for dot indicator positioning
              border: id === focusId ? "2px solid blue" : "none",
              aspectRatio: "1", // square cell
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {links && links.length > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: "5px",
                  left: "5px",
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "grey",
                }}
              />
            )}
            <img
              src={image}
              alt={id}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default Grid;
