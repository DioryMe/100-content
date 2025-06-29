import { Diograph, Diory } from "@diograph/diograph";
import {
  IDataObject,
  IDiographObject,
  IDiory,
  IDioryObject,
} from "@diograph/diograph/types";

export interface DioryInfo {
  diograph: Diograph | null;
  focusId: string;
  storyId: string | null;
  story: IDiory | null;
  stories: IDioryObject[];
  prev: string | null;
  next: string | null;
  focus: {
    text: string | null;
    image: string | null;
    latlng: string | null;
    date: string | null;
    links: string[];
    linkedDiories: IDiory[];
    data: IDataObject | null;
  };
  focusDiory: IDiory | null;
  relatedGeo: string[];
  relatedTime: string[];
  relatedStories: string[];
  delete: (() => void) | null;
  link: (() => void) | null;
  edit: (() => void) | null;
}

export const getDioryInfo = (
  diographObject: IDiographObject,
  focusId: string = "/",
  storyId?: string | null
): DioryInfo => {
  const diograph = new Diograph(diographObject);
  const focusDiory = diograph.getDiory({ id: focusId });
  const { text, image, latlng, date, data } = focusDiory;

  const stories = Object.values(diograph.toObject()).filter((dioryData) =>
    dioryData.links?.some((link) => link.id === focusId)
  );

  const storyDioryId = storyId || (stories[0] && stories[0].id) || null;

  let prev = null;
  let next = null;
  if (storyDioryId) {
    const storyDiory = diograph.getDiory({ id: storyDioryId });

    const focusDioryIndexInStory =
      storyDiory.links?.findIndex((link) => link.id === focusId) ?? -1;

    const prevTargetIndex = focusDioryIndexInStory - 1;
    const nextTargetIndex = focusDioryIndexInStory + 1;

    const prevDisabled =
      !storyDiory.links ||
      prevTargetIndex < 0 ||
      prevTargetIndex >= storyDiory.links.length;

    const nextDisabled =
      !storyDiory.links ||
      nextTargetIndex < 0 ||
      nextTargetIndex >= storyDiory.links.length;

    prev = prevDisabled ? null : storyDiory.links![prevTargetIndex].id;
    next = nextDisabled ? null : storyDiory.links![nextTargetIndex].id;
  }

  return {
    diograph: diograph,
    focusId: focusDiory.id,
    storyId: storyDioryId,
    story: storyDioryId ? diograph.getDiory({ id: storyDioryId }) : null,
    stories: stories,
    prev,
    next,
    focus: {
      data: (data && data[0]) || null,
      text: text || null,
      image: image || null,
      latlng: latlng || null,
      date: date || null,
      links: focusDiory.links?.map((link) => link.id) || [],
      linkedDiories:
        focusDiory.links?.map((link) => diograph.getDiory({ id: link.id })) ||
        [],
    },
    focusDiory,
    relatedGeo: ["relatedGeo"],
    relatedTime: ["relatedTime"],
    relatedStories: ["relatedStories"],
    delete: () => {
      return;
    },
    link: () => {
      return;
    },
    edit: () => {
      return;
    },
  };
};
