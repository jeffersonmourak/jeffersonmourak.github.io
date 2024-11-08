import { H } from "highlight.run";
import type { HighlightPublicInterface } from "highlight.run/dist/client/src";

const PROJECT_ID = "0dq3no4e";

((H: HighlightPublicInterface) => {
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
    H.track("pageview", { pathname: location.pathname });
  });
})(H);
