import { H } from "highlight.run";
import type { HighlightPublicInterface } from "highlight.run/dist/client/src";

import Tracker from "@openreplay/tracker";
import trackerAssist from "@openreplay/tracker-assist";
import sillyname from "sillyname";

const PROJECT_ID = "0dq3no4e";

const trackerInstance = new Tracker({
  projectKey: "4HeENhaRGWlCyfPsCLvO",
  __DISABLE_SECURE_MODE: true,
});

((H: HighlightPublicInterface, tracker: Tracker) => {
  tracker.use(trackerAssist());
  tracker.start();

  const currentUserId =
    localStorage.getItem("com.jeffersonmourak.id") ?? sillyname();

  H.init(PROJECT_ID, {
    environment: "production",
    version: "commit:abcdefg12345",
    networkRecording: {
      enabled: true,
      recordHeadersAndBody: true,
      urlBlocklist: [
        "https://www.googleapis.com/identitytoolkit",
        "https://securetoken.googleapis.com",
      ],
    },
  });

  window.addEventListener("load", () => {
    H.track("pageview", { pathname: location.pathname, userId: currentUserId });
    H.identify(currentUserId);
    tracker.setUserID(currentUserId);
    tracker.setMetadata("pathname", location.pathname);
    localStorage.setItem("com.jeffersonmourak.id", currentUserId);
  });
})(H, trackerInstance);
