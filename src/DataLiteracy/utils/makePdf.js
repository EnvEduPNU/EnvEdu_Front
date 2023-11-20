import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const makePdf = {
  viewWithPdf: async () => {
    try {
      // html to imageFiles
      const imageFiles = await makePdf._convertToImg();

      // imageFiles to Pdf
      const pdf = makePdf._convertToPdf(imageFiles);

      // makePdf.sendToServer(pdf)
    } catch (error) {
      console.error("Error creating PDF:", error);
      // Handle the error appropriately
    }
  },

  _convertToImg: async () => {
    try {
      // html to imageFiles
      const papers = document.querySelectorAll(".div_container > .div_paper");

      if (!papers.length) {
        throw new Error("No paper elements found");
      }

      const imageFiles = await Promise.all(
        Array.from(papers).map(async paper => {
          const canvas = await html2canvas(paper, { scale: 1.5 });
          return canvas.toDataURL("image/png", 1.0);
        })
      );

      return imageFiles;
    } catch (error) {
      console.error("Error converting to images:", error);
      throw error; // Propagate the error
    }
  },

  _convertToPdf: imageFiles => {
    try {
      // imageFiles to pdf
      const doc = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: "a4",
      });

      imageFiles.forEach((imageFile, index) => {
        if (index > 0) {
          doc.addPage();
        }

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        doc.addImage(imageFile, "JPEG", 0, 0, pageWidth, pageHeight);
      });

      // doc.save("test.pdf");

      // Use Blob instead of File
      window.open(doc.output("bloburl"));

      const pdf = new File([doc.output("blob")], "test.pdf", {
        type: "application/pdf",
      });

      return pdf;
    } catch (error) {
      console.error("Error converting to PDF:", error);
      throw error; // Propagate the error
    }
  },
};

export default makePdf;
