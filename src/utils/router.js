/**
 * Variables parametrize by URL address
 * Valeriy Zimnev
 */

export const URL_PARAMS = {
    SEED: 'seed',
    SIZE: 'size',
    RENDER: 'render',
    ANIMATED: 'animated',
}

export const urlParams = new URLSearchParams(window.location.search);

export function setUrlParam(paramKey, data) {
    urlParams.set(paramKey, data);
    const newUrl = '?' + urlParams.toString();
    window.history.pushState(undefined, "", newUrl);
}

export function RouterInstance({
    isReloadable = false,
    seed = null,
    size = null,
}) {
    
    let state = {
        seedFromURL: urlParams.get(URL_PARAMS.SEED) || seed,
        resolutionQuality: Number(urlParams.get(URL_PARAMS.SIZE)) || 1,
        isDownloadable: urlParams.get(URL_PARAMS.RENDER) === "1",
        isAnimated: urlParams.get(URL_PARAMS.ANIMATED) === "1",
    };

    if (isReloadable) {
        window.onpopstate = function (event) {
            location.reload();
        };
    }

    if (!urlParams.get(URL_PARAMS.SIZE) && size) {
        setUrlParam(URL_PARAMS.SIZE, state.resolutionQuality);
    }

    if (!urlParams.get(URL_PARAMS.SEED) && !!seed) {
        setUrlParam(URL_PARAMS.SEED, seed);
    }

    return ({
        setState: (newState = state) => {
            state = {...state, ...newState}
        },
        getState: () => state,
    })
}
