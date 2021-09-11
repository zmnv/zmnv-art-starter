import { onDownloadPressed } from "./utils/download";
import { handleKeyboard } from "./utils/keypressed";
import { getRandomHash, set_seed } from "./utils/random";
import { RouterInstance } from "./utils/router";

const router = RouterInstance({
    seed: getRandomHash(),
    size: 2,
});

const hash = router.getState().seedFromURL;
set_seed(hash);

const artOptions = {
    isRender: router.getState().isRender,
    resolutionQuality: router.getState().resolutionQuality,
}

// Place here your draw function
// drawArt(artOptions);

function drawNewArtwork() {
    const newSeed = getRandomHash();
    set_seed(newSeed);
    router.updateSeed(newSeed);
    // Place here your draw function
    // drawArt(artOptions);
}

addEventListener(
    "pointerdown",
    (e) => (!e || e.button === 0) && drawNewArtwork()
);

handleKeyboard({
    s: () => {
        const routerState = router.getState();
        if (!routerState.isRender) return;
        const fileName = `${routerState.seedFromURL}`;
        onDownloadPressed(fileName);
    },
});
