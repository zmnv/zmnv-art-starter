export function onDownloadPressed(canvas, filename = Date.now()) {
    var canvas = canvas || document.querySelector('canvas');
    if (!canvas) {
        console.log('Canvas not found!');
        return;
    }

    var dataURL = canvas.toDataURL("image/png");
    downloadImage(dataURL, `${filename}.png`);
}

function downloadImage(data, filename = 'untitled.png') {
    var a = document.createElement('a');
    a.href = data;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
}
