function showPDFMerger() {
    var w = (screen.width/1.5);
    var h = (screen.height/1.2);
    var left = (screen.width/2)-(w/2);
    var top = (screen.height/2)-(h/2); 
    chrome.windows.create({
        'url': 'view/pdfMerger.html', 
        'type': 'popup', 
        'width': w, 
        'height': h, 
        'left': left, 
        'top': top} , function(window) {
    });
}
function metaDataEditor() {
    var w = (screen.width/1.5);
    var h = (screen.height/1.2);
    var left = (screen.width/2)-(w/2);
    var top = (screen.height/2)-(h/2); 
    chrome.windows.create({
        'url': 'view/meta-editor.html', 
        'type': 'popup',
        'width': w, 
        'height': h, 
        'left': left, 
        'top': top
    } , function(window) {
    });
}