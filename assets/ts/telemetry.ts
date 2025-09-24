import sillyname from "sillyname";
import posthog from 'posthog-js'

(() => {
  const currentUserId =
    localStorage.getItem("com.jeffersonmourak.id") ?? sillyname();

  posthog.init('phc_XI7kmHnCjoI2ggT8i1oYnXvLV05kVvMAJCjXtt5qdW6',
    {
      api_host: 'https://us.i.posthog.com',
      person_profiles: 'identified_only' // or 'always' to create profiles for anonymous users as well
    }
  )



  window.addEventListener("load", () => {
    posthog.identify(currentUserId);
    posthog.capture("pageview", { pathname: location.pathname });
    localStorage.setItem("com.jeffersonmourak.id", currentUserId);
  });
})();
