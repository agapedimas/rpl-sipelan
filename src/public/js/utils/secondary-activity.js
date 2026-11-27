window.addEventListener("resize", handleActivityResize);

let assignedSection = null;
let lastWindowWidth = 0;

function handleActivityResize() {
    if (assignedSection == null)
        return;

    if (window.innerWidth >= 1140) {
        if (lastWindowWidth >= 1140)
            return;
        lastWindowWidth = window.innerWidth;
        
        if (assignedSection.parentNode == secondaryActivity)
            return;
        
        mainActivity.navigateTo(0, true);
        secondaryActivity.innerHTML = null;
        secondaryActivity.append(assignedSection);
        secondaryActivity.navigateTo(0, true);
    }
    else {
        if (lastWindowWidth < 1140)
            return;
        lastWindowWidth = window.innerWidth;

        if (assignedSection.parentNode == mainActivity)
            return;

        mainActivity.append(assignedSection);
        mainActivity.navigateTo(0, true);
    }
}

function setSectionAsSecondActivity(sectionElement) {
    assignedSection = sectionElement;
    handleActivityResize();
}

window.setSectionAsSecondActivity = setSectionAsSecondActivity;