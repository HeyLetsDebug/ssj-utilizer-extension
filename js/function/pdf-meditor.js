$(document).ready(function() {

    $('#modify-button').addClass("dissabled-button");
    $('#remove-meta-button').addClass("dissabled-button");

    $('#title-of-pdf').on('keydown', function() {
        var title_value = $('#title-of-pdf').val();
        if (title_value != '') {
            $('#modify-button').removeClass("dissabled-button");
        } else {
            $('#modify-button').addClass("dissabled-button");
        }
    });

});


var PDFDocument = PDFLib.PDFDocument;
var StandardFonts = PDFLib.StandardFonts
var titleInput = document.getElementById("title-of-pdf");
var AuthorOfPDF = document.getElementById("AuthorOfPDF");
var SubjectOfPDF = document.getElementById("SubjectOfPDF");
var KeywordsOfPDF = document.getElementById("KeywordsOfPDF");
var to_edit_files = document.getElementById("file-here");
var listofFiles = [];
var nameOfFile = [];

var _PDF_DOC;

var _CANVAS = document.querySelector('#pdf-preview');

var _OBJECT_URL;

function showPDF(pdf_url) {
    PDFJS.getDocument({
        url: pdf_url
    }).then(function(pdf_doc) {
        _PDF_DOC = pdf_doc;

        showPage(1);

        _PDF_DOC.getMetadata().then(function(contents) {
            clearAll();
            if (contents.info.Title == undefined || contents.info.Title == "" ) {
            titleInput.value += "No Title Found";
            }
            else {
            titleInput.value += contents.info.Title;
            }

             if (contents.info.Author == undefined || contents.info.Author == "" ) {
            AuthorOfPDF.value += "No Author Found";
            }
            else {
            AuthorOfPDF.value += contents.info.Author;
            }

             if (contents.info.Subject == undefined || contents.info.Subject == "" ) {
            SubjectOfPDF.value += "No Subject Found";
            }
            else {
            SubjectOfPDF.value += contents.info.Subject;
            }

             if (contents.info.Keywords == undefined || contents.info.Keywords == "" ) {
            KeywordsOfPDF.value += "No Keywords Found";
            }
            else {
            KeywordsOfPDF.value += contents.info.Keywords;
            }

        }).catch(function(error) {
            alert("Error getting metadata");
            console.log(error);
        });


        URL.revokeObjectURL(_OBJECT_URL);
        $('#remove-meta-button').removeClass("dissabled-button");
    }).catch(function(error) {
        alert(error.message);
    });;

}

// show page of PDF
function showPage(page_no) {
    _PDF_DOC.getPage(page_no).then(function(page) {
        var scale_required = _CANVAS.width / page.getViewport(1).width;
        var viewport = page.getViewport(scale_required);

        _CANVAS.height = viewport.height;

        var renderContext = {
            canvasContext: _CANVAS.getContext('2d'),
            viewport: viewport
        };

        page.render(renderContext).then(function() {
            document.querySelector("#pdf-preview").style.display = 'inline-block';
        });
    });
}


to_edit_files.addEventListener('change', function() {

    var file = this.files[0];

    var mime_types = ['application/pdf'];

    if (mime_types.indexOf(file.type) == -1) {
        alert('Error : Incorrect file type');
        return;
    }
    _OBJECT_URL = URL.createObjectURL(file)

    showPDF(_OBJECT_URL);

    for (var i = 0; i < to_edit_files.files.length; i++) {
        listofFiles = [];
        nameOfFile = [];
        nameOfFile = to_edit_files.files[i].name;
        listofFiles.push(URL.createObjectURL(to_edit_files.files[i]));
    }

});

$("#modify-button").on("click", function(e) {
    editDocumentMetadata(listofFiles);

})

$("#remove-meta-button").on("click", function(e) {
    removeDocumentMetadata(listofFiles);

})


async function editDocumentMetadata(MeditPdf) {
    const mergedPdf = await PDFDocument.create();
    const existingPdfBytes = await fetch(MeditPdf).then(res => res.arrayBuffer())
    var bytes = new Uint8Array(existingPdfBytes);
    const pdfDoc = await PDFDocument.load(bytes)
    pdfDoc.setTitle(titleInput.value)

    pdfDoc.setAuthor(AuthorOfPDF.value)
    pdfDoc.setSubject(SubjectOfPDF.value)
    pdfDoc.setKeywords(KeywordsOfPDF.value)
    
    pdfDoc.setProducer('')
    pdfDoc.setCreator('')

    const pdfBytes = await pdfDoc.save();

    downloader(pdfBytes);

}


async function removeDocumentMetadata(MeditPdf) {
    const mergedPdf = await PDFDocument.create();
    const existingPdfBytes = await fetch(MeditPdf).then(res => res.arrayBuffer())
    var bytes = new Uint8Array(existingPdfBytes);
    const pdfDoc = await PDFDocument.load(bytes)
    pdfDoc.setTitle('')
    pdfDoc.setProducer('')
    pdfDoc.setCreator('')
    pdfDoc.setAuthor('')
    pdfDoc.setSubject('')
    pdfDoc.setKeywords('')

    const pdfBytes = await pdfDoc.save();

    downloader(pdfBytes);
}

function downloader(pdfBytesIn)
{
        var blob = new Blob([pdfBytesIn], { type: "application/pdf" });
        var link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = nameOfFile;
        link.click();
}


function clearAll()
{
    titleInput.value="";
    AuthorOfPDF.value="";
    SubjectOfPDF.value="";
    KeywordsOfPDF.value="";
}