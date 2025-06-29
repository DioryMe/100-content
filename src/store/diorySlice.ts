import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { constructAndLoadRoom, Diograph } from "@diograph/diograph";
import { HttpClient } from "@diograph/http-client";
import { validateDiograph } from "@diograph/diograph/validator";
import { IDiographObject, IDioryObject } from "@diograph/diograph/types";

const roomAddress = localStorage.getItem("roomAddress");
const basicAuthToken = localStorage.getItem("basicAuthToken");

export const loadDioryContent = createAsyncThunk(
  "diory/loadDioryContent",
  async (diory: IDioryObject) => {
    if (!diory.data || !diory.data.length) {
      throw new Error("No content available in diory");
    }
    const cid = diory.data[0].contentUrl;
    const mimeType = diory.data[0]["encodingFormat"];

    const room = await constructAndLoadRoom(roomAddress, "HttpClient", {
      HttpClient: {
        clientConstructor: HttpClient,
        credentials: { basicAuthToken },
      },
    });

    const response = await room.readContent(cid);
    const blob = new Blob([response], { type: mimeType });
    return { id: diory.id, url: URL.createObjectURL(blob), mimeType };
  }
);

export const loadDiograph = createAsyncThunk("diory/loadDiograph", async () => {
  const httpClient = new HttpClient(roomAddress, { basicAuthToken });
  const diographContents = await httpClient.readTextItem("diograph.json");
  const diographJson = JSON.parse(diographContents);
  validateDiograph(diographJson);
  return diographJson;
});

interface ContentUrlLoadingState {
  status: "loading" | "fulfilled" | "rejected" | "cancelled";
  error?: any;
  loadedCID?: string;
}

interface DioryState {
  diograph: IDiographObject | null;
  focusId: string | null;
  storyId: string | null;
  storyDiories: IDioryObject[];
  prevId: string;
  nextId: string;
  stories: IDioryObject[];
  contentUrls: { [key: string]: { url: string; mimeType: string } };
  contentUrlLoading: { [key: string]: ContentUrlLoadingState };
}

const initialState: DioryState = {
  diograph: null,
  focusId: null,
  storyId: null,
  storyDiories: [],
  prevId: null,
  nextId: null,
  stories: [],
  contentUrls: {},
  contentUrlLoading: {},
};

const getStoryDiories = (storyId: string, diograph: IDiographObject) => {
  if (!storyId) return null;
  const diographInstance = new Diograph(diograph);
  const storyDiory = diographInstance.getDiory({ id: storyId });
  return storyDiory.links.map((link) =>
    diographInstance.getDiory({ id: link.id }).toObject()
  );
};

const getStories = (focusId: string, diograph: IDiographObject) => {
  return Object.values(diograph).filter((dioryData: IDioryObject) =>
    dioryData.links?.some((link) => link.id === focusId)
  );
};

const getPrevNext = (storyId, focusId, diograph) => {
  if (!storyId) return null;
  let prevId = null;
  let nextId = null;
  const diographInstance = new Diograph(diograph);
  const storyDiory = diographInstance.getDiory({ id: storyId });

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

  prevId = prevDisabled ? null : storyDiory.links![prevTargetIndex].id;
  nextId = nextDisabled ? null : storyDiory.links![nextTargetIndex].id;

  return { prevId, nextId };
};

const diorySlice = createSlice({
  name: "diory",
  initialState,
  reducers: {
    setFocus(
      state,
      action: PayloadAction<{ focusId: string; storyId?: string | null }>
    ) {
      const oldStoryId = state.storyId;
      const { focusId, storyId } = action.payload;
      state.focusId = focusId;
      state.stories = getStories(focusId, state.diograph);
      const newStoryId =
        storyId || (state.stories[0] && state.stories[0].id) || null;
      if (oldStoryId !== newStoryId) {
        const focusContentUrl = state.contentUrls[storyId];
        Object.keys(state.contentUrls).forEach((key) => {
          if (key !== storyId && state.contentUrls[key]?.url) {
            URL.revokeObjectURL(state.contentUrls[key].url);
          }
        });
        state.contentUrls = {};
        if (focusContentUrl) {
          state.contentUrls[storyId] = focusContentUrl;
        }
      }
      state.storyId = newStoryId;
      state.storyDiories = getStoryDiories(state.storyId, state.diograph);
      const { prevId, nextId } = getPrevNext(
        state.storyId,
        focusId,
        state.diograph
      );
      state.prevId = prevId;
      state.nextId = nextId;
    },
    setStory(state, action: PayloadAction<any>) {
      state.storyId = action.payload;
    },
    setDiograph(state, action: PayloadAction<any>) {
      state.diograph = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(
      loadDiograph.fulfilled,
      (state, action: PayloadAction<IDiographObject>) => {
        state.diograph = action.payload;
      }
    );
    // When loading starts, mark the loading state with status 'loading'
    builder.addCase(loadDioryContent.pending, (state, action) => {
      const diory = action.meta.arg;
      state.contentUrlLoading[diory.id] = {
        status: "loading",
        error: undefined,
        loadedCID: diory.data[0].contentUrl,
      };
    });
    // When fulfilled, store the loaded URL and mark status as 'fulfilled'
    builder.addCase(loadDioryContent.fulfilled, (state, action) => {
      const { id, url, mimeType } = action.payload;
      state.contentUrlLoading[id] = {
        status: "fulfilled",
        error: undefined,
        loadedCID: state.contentUrlLoading[id].loadedCID,
      };
      state.contentUrls[id] = {
        url,
        mimeType,
      };
    });
    // On rejection, mark status as 'rejected' and save the error
    builder.addCase(loadDioryContent.rejected, (state, action) => {
      const diory = action.meta.arg;
      state.contentUrlLoading[diory.id] = {
        status: "rejected",
        error: action.error,
        loadedCID: diory.data[0].contentUrl,
      };
    });
  },
});

export const { setFocus, setStory, setDiograph } = diorySlice.actions;
export default diorySlice.reducer;
