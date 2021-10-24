var PDFDocument = PDFLib.PDFDocument;
var StandardFonts = PDFLib.StandardFonts
var titleInput = document.getElementById("title-of-pdf");
var to_merge_files = document.getElementById("files");
var save_pdf_name = document.getElementById("pdf-name-input");
var name_of_pdf;
 var cpdfbd;
var listofFiles = [];


function updateArrayList() {
    listofFiles = [];
    var count = document.getElementById("selectedFiles").getElementsByTagName("div").length;
    $('.data-url-pdf').each(function() {
        listofFiles.push("blob:chrome-extension://"+this.id);
    });
    pagenumbererr();
   console.log(listofFiles);
}

save_pdf_name.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {

        if (!save_pdf_name.value.match(/\S/)) {
            alert("Please enter a valid PDF title to proceed");
        } else {
            save_pdf_name.disabled = true;
            document.getElementById("mergepdf-button").click();
        }
    }
});

to_merge_files.addEventListener('change', function() {
document.getElementById("wrapper-container").setAttribute("style","display:block;")
    save_pdf_name.disabled = false;
    for (var i = 0; i < to_merge_files.files.length; i++) {
        // fileSize = parseInt(to_merge_files.files[i].size, 10) / 1024;
        // filesize = Math.round(fileSize);
        
        $('<div class="draggable ui-state-default"/>').attr('id', revisedRandId()).appendTo($('#selectedFiles'));
        $('<span class="pdf-name-li-listmerge data-url-pdf"/>').attr("id", URL.createObjectURL(to_merge_files.files[i]).split("blob:chrome-extension://")[1]).text(to_merge_files.files[i].name).appendTo($('#selectedFiles div:last'));
        $('<span />').addClass('filesize').text(' (' + readableBytes(to_merge_files.files[i].size) +')').appendTo($('#selectedFiles div:last'));
         $('<span class="pdf-name-li-listmerge-delete"/>').appendTo($('#selectedFiles div:last'));
    }
    updateArrayList();
});

function readableBytes(bytes) {
    var i = Math.floor(Math.log(bytes) / Math.log(1024)),
      sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    return (bytes / Math.pow(1024, i)).toFixed(2) * 1 + " " + sizes[i];
  }

$("#mergepdf-button").on("click", function(e) {
                if(cpdfbd == "1")
            {
                alert("Merge operation will nto be performed for single file. Please add more files to merge !!");
                save_pdf_name.disabled = true;
            }
            else
            {
                mergePdfs(listofFiles);
            }
})

$(document).on("click", "span.pdf-name-li-listmerge-delete" , function() {
            if(cpdfbd == "1")
            {
                alert("Delete operation will nto be performed for single file !!");
            }
            else
            {
                $(this).parent().remove();
                updateArrayList();
            }
        });

async function mergePdfs(pdfsToMerge) {
    try
    {
        const mergedPdf = await PDFDocument.create();

        for (const pdfCopyDoc of pdfsToMerge) {

            const existingPdfBytes = await fetch(pdfCopyDoc).then(res => res.arrayBuffer())
            const pdfDoc = await PDFDocument.load(existingPdfBytes)
            const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
            copiedPages.forEach((page) => {
                mergedPdf.addPage(page);

            });
        }

        if (save_pdf_name.value == '') {
            name_of_pdf = "mergedFile";
        } else {
            name_of_pdf = save_pdf_name.value;
        }

        mergedPdf.setProducer('');
        mergedPdf.setCreator('');
        const mergedPdfFile = await mergedPdf.save();
        //console.log(mergedPdfFile);

        downloader(mergedPdfFile);
    }
    catch(err)
    {
        alert(err.message);
    }
}

$("#selectedFiles").sortable({
    
     tolerance: "pointer",
    placeholder: "ui-state-highlight",
    revert: "invalid",
    update: function(event, ui) {
        updateArrayList(to_merge_files.files);
    }
});

$("#selectedFiles, #selectedFiles div").disableSelection();


$("#pdf-name-input").bind("keyup paste", function() {
    var newStr = $(this).val();
    if (newStr === '') {
        $("#mergepdf-button").html("Merge PDF");
    } else {
        $("#mergepdf-button").html("Merge PDF " + "&#34;" + newStr + "&#34;");
    }
});
function revisedRandId() {
     return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);
}
function pagenumbererr()
{
    var singleTiles = document.querySelectorAll("div.draggable.ui-state-default");
  cpdfbd = singleTiles.length;
}

function downloader(pdfBytesIn)
{
        var blob = new Blob([pdfBytesIn], { type: "application/pdf" });
        var link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = name_of_pdf;
        link.click();
}