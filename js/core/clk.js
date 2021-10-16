chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({
      id: "context1",
      title: "Merge PDF",
      contexts: ["all"]
  });

  chrome.contextMenus.create({
      id: "context2",
      title: "PDF Meta Editor",
      contexts: ["all"]
  });

});


chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (tab) {
        if (info.menuItemId === "context1"){
            showPDFMerger();
        }
        if (info.menuItemId === "context2"){
            metaDataEditor();
        }
    }
});