const PDFDocument = PDFLib.PDFDocument;
const StandardFonts = PDFLib.StandardFonts;
sessionStorage.removeItem("listofFilesInput");
sessionStorage.removeItem("countofFiles");
const titleInput  = document.getElementById("title-of-pdf");
const to_merge_files = document.getElementById("files");
const save_pdf_name = document.getElementById("pdfName-input");
const dopdf_Element = document.getElementById("dopdf");
const viewer = document.getElementById('show-pdf-page-wrapper');
var  name_of_pdf, old_position, cpdfbd, new_position, newFileName,l,m,n,nameOfFile,listofFilesFinal;
var reArrangedPDF = [];
var swapedPageList = [];
var mergedButtonFiles = [];
var mime_types = [ 'application/pdf' ];
// resize height of main frame page start
function heightAdder()
{
  var getHeightOfTopbar = document.getElementsByClassName('page-title-bar-wrapper')[0].offsetHeight;
  var getHeightOfPage = document.body.offsetHeight;
  var newHeightOfSection = getHeightOfPage - getHeightOfTopbar;
  document.documentElement.style.setProperty('--heightOF-bodyWrapperFlex', `${newHeightOfSection}px`);
}
heightAdder();

window.addEventListener('resize', function(event) {
    heightAdder();
}, true);
// resize height of main frame page end


to_merge_files.addEventListener('change', function() {
    var file = this.files[0];
    var listofFilesInput = [];
    if(mime_types.indexOf(file.type) == -1) {
        alert('Error : Incorrect file type');
        return;
    }
    else
    {
      for(l = 0; l< to_merge_files.files.length; l++){
        nameOfFile = to_merge_files.files[l].name;
        _OBJECT_URL = URL.createObjectURL(to_merge_files.files[l]);
        
        listofFilesInput.push(_OBJECT_URL);
        showPDF(_OBJECT_URL);
      }
      save_pdf_name.disabled = false;
    }

});


// function to render PDF
var thePdf = null;
var scale = 1;
async function showPDF(pdf_url) {
  try{
     // for (const eachURL of pdf_url) {
      console.log(`showPDF on top`)
      console.log(pdf_url)


      PDFJS.getDocument({ url: pdf_url }).promise.then(function(pdf) {
          thePdf = pdf;
          console.log(`showPDF inner`)
          console.log(pdf_url)
          for(page = 1; page <= pdf.numPages; page++) {
             var li = document.createElement('div');
             viewer.appendChild(li);
             li.setAttribute("class", "pdfWrapper"); 
             li.setAttribute("data-parenpdf", `${sfddg(pdf_url)+'-'+page}`); 
             canvas = document.createElement("canvas");    
             canvas.className = 'pdf-page-canvas';   
             canvas.style.width='90%';
             canvas.width  = canvas.offsetWidth;      
             li.appendChild(canvas);            
             renderPage(page, canvas, thePdf);
             var dT = document.createElement('p');
             dT.setAttribute("class", "delete-page fa fa-trash");
             li.appendChild(dT);
             var last = reArrangedPDF;
          }
            pagenumbererr();

            letsCreatePDF(pdf_url)
      });
    // }
  }
  catch(err) 
  {
      console.log(err.message);
  }
}

async function letsCreatePDF(pURLs){
    try{
        
          // for (const eachPDF of pURLs) {

            const existingPdfBytes = await fetch(pURLs).then(res => res.arrayBuffer())
            const pdfDoc = await PDFDocument.load(existingPdfBytes, { 
              updateMetadata: false,
              ignoreEncryption: true
            }) 

            var kshsujhd = pdfDoc.getPageIndices().length
            for (var d = 0; d<kshsujhd; d++) {
              
              const onePdfDoc = await PDFDocument.create();
              const copiedPages = await onePdfDoc.copyPages(pdfDoc,[d]);
              copiedPages.forEach((page) => {
                onePdfDoc.addPage(page);
              });
              const mergedPdfFile = await onePdfDoc.save();
              const blob = new Blob([mergedPdfFile], { type: 'application/pdf' });
              reArrangedPDF = [];
              reArrangedPDF.push(URL.createObjectURL(blob));
              var somend = sfddg(pURLs)+"-"+parseInt(d+1);

              var dshgdj = document.querySelector("body").querySelectorAll('.pdfWrapper[data-parenpdf="'+somend+'"]');
             
              dshgdj[0].setAttribute("data-bloburl", `${reArrangedPDF}`);
            }
          
     }
      catch(err) {
        console.log(err.message);
      }
}


function sfddg(strgv)
{
  var str = strgv.split("/"),
  whichPDF = str[str.length - 1];
  return whichPDF;
}



function renderPage(pageNumber, canvas, thePdfD) {
    thePdfD.getPage(pageNumber).then(function(page) {
      viewport = page.getViewport(scale);
      canvas.height = viewport.height;
      canvas.width = viewport.width;          
      page.render({canvasContext: canvas.getContext('2d'), viewport: viewport});
});
}

 $("#show-pdf-page-wrapper").sortable({
    containment: 'parent',
     tolerance: "pointer",
     cursor: 'move',
     placeholder: "ui-state-highlight",
      animation: 200,
      start: function(e, ui) {
          old_position = ui.item.index();
      },
      update: function(event, ui) {
          new_position = ui.item.index();
          pagenumbererr();
      }, 
     revert: true
 }).disableSelection();

 $("#show-pdf-page-wrapper").disableSelection();


$(document).on("click", "p.delete-page" , function() {
  if(cpdfbd == "1")
    {
      alert("Delete operation will nto be performed for single file !!");
    }
    else
    {
      var pageID = $(this).attr('id');
      $(this).parent().remove();
      pagenumbererr();
    }
});


async function mergePdfs(pdfsToMerge) {
    try {
        const mergedPdfNew = await PDFDocument.create();

        for (const pdfCopyDoc of pdfsToMerge) {

            const existingPdfBytes = await fetch(pdfCopyDoc).then(res => res.arrayBuffer())
            const pdfDoc = await PDFDocument.load(existingPdfBytes)
            const copiedPages = await mergedPdfNew.copyPages(pdfDoc, pdfDoc.getPageIndices());
            copiedPages.forEach((page) => {
                mergedPdfNew.addPage(page);

            });
        }
        mergedPdfNew.setProducer('');
        mergedPdfNew.setCreator('');
        const mergedPdfFile = await mergedPdfNew.save();

        downloader(mergedPdfFile);
    } catch (err) {
        alert(err.message);
    }
}

function downloader(pdfBytesIn) {
    var blob = new Blob([pdfBytesIn], {
        type: "application/pdf"
    });
    
    var link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);;
    link.download = dopdf_Element.getAttribute('data-pdfname');
    link.click();
}
dopdf_Element.addEventListener('click', buttonClickedDownload, false)
function buttonClickedDownload(){
   var werwew = document.querySelectorAll('#show-pdf-page-wrapper .pdfWrapper');
   if (werwew.length <= 0)
   {
     alert(`No Files Selected`);
   }
   else if (werwew.length == 1)
   {
    let text = `You have only 1 page left !
Do you wish to download the single page?`;
      if (confirm(text) == true) {
          sduaruw()
      } 
   }
   else
   {
     sduaruw()
   }

   function sduaruw()
   {
    mergedButtonFiles = [];
      for (var s = 0; s<werwew.length; s++) {
        mergedButtonFiles.push(werwew[s].getAttribute("data-bloburl"));
      }
      mergePdfs(mergedButtonFiles)
   }
}


['input','paste'].forEach( evt => 
    save_pdf_name.addEventListener(evt, performActionOnEvent, false)
);
function performActionOnEvent(){

      newFileName = save_pdf_name.value.replace(/\s+/g, '-').replace(/\_+/g, '-').toLowerCase();
      save_pdf_name.value = newFileName;
      (save_pdf_name.value) ? dopdf_Element.setAttribute('data-pdfname',save_pdf_name.value) : dopdf_Element.setAttribute('data-pdfname','mergedPDF');
}

save_pdf_name.addEventListener("keydown", function(event) {
      if (event.key === "Enter") {

        if (!save_pdf_name.value.match(/\S/)) {
          alert("Please enter a valid PDF title to proceed");
        }
        else
        {
          save_pdf_name.disabled = true;
          dopdf_Element.click();
        }
      }
});


function pagenumbererr()
{
    var singleTiles = document.querySelectorAll(".pdfWrapper .delete-page");
  for(n=0; n<singleTiles.length; n++) { 
      singleTiles[n].setAttribute("id", n); 
      singleTiles[n].innerHTML = n;
  }
   cpdfbd = singleTiles.length;
  document.getElementById("show-numberPages").innerHTML = singleTiles.length;
}

document.body.onkeydown = function(event) {
        var e = event || window.event;
        if (e.ctrlKey && e.key === 'o' || e.ctrlKey && e.key === 'O') {
            e.preventDefault();
           to_merge_files.click();
        }
        if (e.ctrlKey && e.key === 's' || e.ctrlKey && e.key === 'S') {
            e.preventDefault();
           dopdf_Element.click();
        }
      }