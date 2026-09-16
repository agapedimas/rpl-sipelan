window.onscroll = function() {
    const defaultScrollThreshold = mainHeader.offsetHeight;
    const isDark = mainHeader.dataset.dark == "true";
    let scrollThreshold = parseInt(mainHeader.dataset.bound) - mainHeader.offsetHeight || defaultScrollThreshold;

    if (scrollThreshold < defaultScrollThreshold)
        scrollThreshold = defaultScrollThreshold;
    
    if (window.scrollY > scrollThreshold - 50) {
        mainHeader.classList.add("scroll");
        mainHeader.removeAttribute("theme");
    }
    else {
        mainHeader.classList.remove("scroll");
        if (isDark)
            mainHeader.setAttribute("theme", "dark");    
    }
};

for (const navigationLink of [...mainNavigation.children]) {
    const currentHref = navigationLink.getAttribute("href");

    if (location.pathname == currentHref)
        navigationLink.classList.add("active");
}