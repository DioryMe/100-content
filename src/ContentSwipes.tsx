import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import { IDioryObject } from "@diograph/diograph/types";
import DiorySwiper from "./DiorySwiper";
import { ContentSlide } from "./ContentSlide";

const createContentSlide = (diory: IDioryObject, key: number) => {
  console.log("baa", diory);
  if (!diory) return null;

  return (
    <SwiperSlide key={key}>
      <ContentSlide diory={diory} />
    </SwiperSlide>
  );
};

const ContentSwipes = () => {
  return <DiorySwiper createSlide={createContentSlide} />;
};

export default ContentSwipes;
