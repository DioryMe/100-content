import { useNavigate } from "react-router-dom";

// import diograph from "../diograph.json";
import { setFocus, setStory } from "./store/diorySlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store/store";
// const rootDiory = diograph["22185bcd-c09f-4f16-b613-af5f3c81150c"];

const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { diograph } = useSelector((state: RootState) => state.diory);
  const rootDiory = diograph["/"];

  return (
    <div>
      <h2>{rootDiory.text}</h2>
      {/* Two-column grid container */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "16px",
        }}
      >
        {rootDiory.links.map(
          (story) =>
            // Each grid item is a flex container with fixed height
            diograph[story.id] && (
              <div
                key={story.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "space-between",
                  height: "300hw", // Adjust height as needed
                }}
              >
                {/* Image container to center the image vertically */}
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                  }}
                  onClick={() => {
                    // TODO: Set first diory of the story in focus
                    const firstDioryOfStory = Object.values(
                      diograph[story.id].links
                    )[0].id;
                    dispatch(
                      setFocus({
                        focusId: firstDioryOfStory,
                        storyId: story.id,
                      })
                    );
                    navigate(
                      `/diory/${firstDioryOfStory}/grid?storyId=${story.id}`
                    );
                  }}
                >
                  <img
                    src={diograph[story.id].image}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      cursor: "pointer",
                    }}
                  />
                </div>
                {/* Text container always at the bottom */}
                <div style={{ marginBottom: "8px" }}>
                  <p style={{ margin: 0 }}>{diograph[story.id].text}</p>
                </div>
              </div>
            )
        )}
      </div>
    </div>
  );
};

export default HomePage;
