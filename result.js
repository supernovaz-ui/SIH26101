(() => {
  "use strict";

  const STORAGE_KEY = "sih26101Prototype";
  const AUTH_PAGE = "index.html";
  const ONBOARDING_PAGE = "onboarding.html";

  function emptyPrototypeStore() {
    return { version: 1, activeUserId: null, users: {}, profiles: {} };
  }

  function readPrototypeStore() {
    const fallback = emptyPrototypeStore();

    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (!saved) return fallback;

      const parsed = JSON.parse(saved);
      return {
        ...fallback,
        ...parsed,
        users: parsed && typeof parsed.users === "object" && parsed.users ? parsed.users : {},
        profiles: parsed && typeof parsed.profiles === "object" && parsed.profiles ? parsed.profiles : {},
      };
    } catch (error) {
      console.warn("Could not read prototype data:", error);
      return fallback;
    }
  }

  function writePrototypeStore(store) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }

  function renderResult() {
    const store = readPrototypeStore();
    const userId = store.activeUserId;
    const user = userId && store.users[userId];
    const profile = userId && store.profiles[userId];
    const result = profile && profile.result;

    if (!user) {
      window.location.replace(AUTH_PAGE);
      return;
    }

    if (!result) {
      window.location.replace(ONBOARDING_PAGE);
      return;
    }

    const recommendations = Array.isArray(result.recommendedTools)
      ? result.recommendedTools
      : [];

    if (recommendations.length === 0 && result.competencyLevel !== "Advanced") {
      result.competencyLevel = "Advanced";
      store.profiles[userId] = profile;
      writePrototypeStore(store);
    }

    document.getElementById("welcomeText").textContent =
      `Your personalized recommendations are based on your onboarding responses.`;
    document.getElementById("competencyLevel").textContent = result.competencyLevel;

    const toolList = document.getElementById("recommendedTools");
    toolList.innerHTML = "";

    if (recommendations.length === 0) {
      const item = document.createElement("li");
      item.className = "tool-list-empty";
      item.textContent = "You have already covered the core tools for your selected career path.";
      toolList.appendChild(item);
    }

    recommendations.forEach((tool) => {
      const item = document.createElement("li");
      item.textContent = tool;
      toolList.appendChild(item);
    });

    document.getElementById("reviewButton").addEventListener("click", () => {
      const currentProfile = store.profiles[userId] || {};
      currentProfile.onboarding = {
        ...(currentProfile.onboarding || {}),
        completed: false,
        completedAt: null,
      };
      delete currentProfile.result;
      store.profiles[userId] = currentProfile;
      writePrototypeStore(store);
      window.location.assign(ONBOARDING_PAGE);
    });

    document.getElementById("signOutButton").addEventListener("click", () => {
      store.activeUserId = null;
      writePrototypeStore(store);
      window.location.assign(AUTH_PAGE);
    });
  }

  document.addEventListener("DOMContentLoaded", renderResult);
})();
