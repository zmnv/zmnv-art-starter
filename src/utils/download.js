function renderLoading() {
    var loadingView = document.createElement('div');
    loadingView.id = 'loadingView';
    loadingView.style = 'position: absolute;z-index:999;left:0;right:0;top:0;bottom:0;background-color:rgba(0,0,0,0.5);font-size:24px;color:48px;font-weight:bold;display:flex;align-items:center;justify-content:center;color:#fff;font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";';
    loadingView.innerText = 'Saving...';

    return ({
        show: () => document.body.appendChild(loadingView),
        hide: () => document.body.removeChild(loadingView),
    })
}

export function onDownloadPressed(filename = Date.now(), canvas) {
    var canvas = canvas || document.querySelector('canvas');
    if (!canvas) {
        console.log('Canvas not found!');
        return;
    }

    const { show, hide } = renderLoading();
    show();

    setTimeout(() => {
        var dataURL = canvas.toDataURL("image/png");
        downloadImage(dataURL, `${filename}.png`);
        setTimeout(hide, 500);
    }, 500);
}

function downloadImage(data, filename = 'untitled.png') {
    var a = document.createElement('a');
    a.href = data;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
}
