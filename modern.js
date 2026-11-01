(function () {
  "use strict";

  document.documentElement.classList.add("js");

  document.querySelectorAll("[data-entry-list]").forEach(function (heading) {
    var list = document.getElementById(heading.getAttribute("data-entry-list"));
    if (!list) return;
    var count = list.querySelectorAll(":scope > li").length;
    var label = count + (count === 1 ? " entry" : " entries");
    var counter = document.createElement("sup");
    counter.className = "publication-section-count";
    counter.setAttribute("aria-label", label);
    counter.title = label;
    counter.textContent = String(count);
    heading.append(" ", counter);
  });

  var menuButton = document.querySelector("#Menu .menu-toggle");
  var menuList = document.querySelector("#Menu > ul");
  if (menuButton && menuList) {
    menuButton.addEventListener("click", function () {
      var open = menuList.classList.toggle("menu-open");
      menuButton.setAttribute("aria-expanded", String(open));
    });
  }

  var secondaryColumn = document.querySelector(".secondary-layout-nav");
  var secondaryToggle = secondaryColumn && secondaryColumn.querySelector(".secondary-nav-toggle");
  if (secondaryColumn && secondaryToggle) {
    secondaryToggle.addEventListener("click", function () {
      var expanded = secondaryColumn.classList.toggle("secondary-nav-open");
      secondaryToggle.setAttribute("aria-expanded", String(expanded));
    });
    secondaryColumn.querySelectorAll("#Secondarycontent a").forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.matchMedia("(max-width: 900px)").matches) {
          secondaryColumn.classList.remove("secondary-nav-open");
          secondaryToggle.setAttribute("aria-expanded", "false");
        }
      });
    });
  }

  function setPanelState(panel, expanded) {
    panel.style.display = expanded ? "block" : "none";
    document.querySelectorAll('a[role="button"][href="#' + panel.id + '"]').forEach(function (toggle) {
      toggle.setAttribute("aria-expanded", String(expanded));
    });
  }

  document.querySelectorAll('a[role="button"][href^="#"]').forEach(function (toggle) {
    var panel = document.getElementById(toggle.getAttribute("href").slice(1));
    if (!panel) return;
    toggle.addEventListener("click", function (event) {
      event.preventDefault();
      var hidden = panel.style.display === "none" || getComputedStyle(panel).display === "none";
      setPanelState(panel, hidden);
      if (hidden) panel.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  document.querySelectorAll("[data-collapse-action][data-collapse-targets]").forEach(function (control) {
    control.addEventListener("click", function (event) {
      event.preventDefault();
      var expanded = control.getAttribute("data-collapse-action") === "show";
      control.getAttribute("data-collapse-targets").split(",").forEach(function (id) {
        var panel = document.getElementById(id.trim());
        if (panel) setPanelState(panel, expanded);
      });
    });
  });

  var newsPanel = document.querySelector(".news-panel");
  if (newsPanel) {
    var newsRows = Array.prototype.slice.call(newsPanel.querySelectorAll("#news-list tr"));
    var olderNews = newsPanel.querySelector(".older-news");
    var hideNews = newsPanel.querySelector(".hide-news");
    var visibleNews = 5;
    if (olderNews && hideNews) {
      olderNews.addEventListener("click", function () {
        var nextLimit = Math.min(visibleNews + 15, newsRows.length);
        for (var index = visibleNews; index < nextLimit; index += 1) newsRows[index].classList.remove("news-hidden");
        visibleNews = nextLimit;
        hideNews.hidden = false;
        olderNews.hidden = visibleNews >= newsRows.length;
      });
      hideNews.addEventListener("click", function () {
        visibleNews = 5;
        newsRows.forEach(function (row, index) { row.classList.toggle("news-hidden", index >= visibleNews); });
        olderNews.hidden = false;
        hideNews.hidden = true;
        var heading = newsPanel.closest(".post").querySelector("h3");
        if (heading) heading.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }

  ["Preprints", "Books", "Proceedings", "Journals", "Conferences", "Patents", "Reports"].forEach(function (sectionId) {
    var heading = document.getElementById(sectionId);
    var content = heading && heading.parentElement && heading.parentElement.nextElementSibling;
    if (!content) return;
    var entries = Array.prototype.slice.call(content.querySelectorAll(":scope > ol > li, :scope > ul > li"));
    var more = content.querySelector(".more-publications");
    var hide = content.querySelector(".hide-publications");
    if (!more || !hide) return;
    more.addEventListener("click", function () {
      entries.forEach(function (entry) { entry.classList.remove("publication-collapsed"); });
      more.hidden = true;
      hide.hidden = false;
    });
    hide.addEventListener("click", function () {
      entries.forEach(function (entry, index) { entry.classList.toggle("publication-collapsed", index >= 5); });
      more.hidden = false;
      hide.hidden = true;
      heading.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  var publicationTools = document.querySelector(".publication-tools");
  if (publicationTools) {
    var search = publicationTools.querySelector("input[type=search]");
    var status = publicationTools.querySelector("small");
    var publicationEntries = Array.prototype.slice.call(document.querySelectorAll(".secondary-layout-main .content > ol > li, .secondary-layout-main .content > ul > li"));
    function filterPublications() {
      var query = search.value.trim().toLocaleLowerCase();
      document.documentElement.classList.toggle("publication-searching", Boolean(query));
      var visible = 0;
      publicationEntries.forEach(function (entry) {
        var matches = !query || entry.textContent.toLocaleLowerCase().includes(query);
        entry.classList.toggle("publication-hidden", !matches);
        if (matches) visible += 1;
      });
      status.textContent = query ? visible + " matching entries" : publicationEntries.length + " entries on this page";
    }
    if (search && status) {
      search.addEventListener("input", filterPublications);
      filterPublications();
    }
  }

  var talkList = document.getElementById("talks-list");
  if (talkList) {
    var talkEntries = Array.prototype.slice.call(talkList.querySelectorAll(":scope > li.talk-entry"));
    var talksContent = talkList.closest(".content");
    var moreTalks = talksContent && talksContent.querySelector(".more-talks");
    var hideTalks = talksContent && talksContent.querySelector(".hide-talks");
    var initialVisibleTalks = 5;
    if (moreTalks && hideTalks) {
      moreTalks.addEventListener("click", function () {
        talkEntries.forEach(function (entry) { entry.classList.remove("talk-hidden"); });
        hideTalks.hidden = false;
        moreTalks.hidden = true;
      });
      hideTalks.addEventListener("click", function () {
        talkEntries.forEach(function (entry, index) { entry.classList.toggle("talk-hidden", index >= initialVisibleTalks); });
        moreTalks.hidden = false;
        hideTalks.hidden = true;
        var heading = document.getElementById("Talks");
        if (heading) heading.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }
}());
