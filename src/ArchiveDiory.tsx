import { useEffect, useState } from "react";
import { getGlobalDiograph } from "./utils/globalDiograph";
import { IDiographObject, IDioryObject } from "@diograph/diograph/types";
import { useNavigate, useParams } from "react-router-dom";
import containerStyles from "./ArchiveDiory.module.css";
import { DioryInfo } from "./DioryInfo";

const ArchiveDiory = () => {
  const [globalDiograph, setGlobalDiograph] = useState<IDiographObject>(null);
  const [diory, setDiory] = useState<IDioryObject>(null);
  const { focusId } = useParams();

  const navigate = useNavigate();


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
          <img src={diory.image} />
        </div>
      )}
      {diory && <DioryInfo diory={diory} />}
    </div>
  );
};

export default ArchiveDiory;
