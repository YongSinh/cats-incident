import jsPDF from "jspdf";
import "jspdf-autotable";
import { format } from "date-fns";
import dayjs from "dayjs";
// define a generatePDF function that accepts a tickets argument
const generatePDF2 = tickets => {
    const doc = new jsPDF({
        orientation: "l", //set orientation
        unit: "pt", //set unit for document
        format: "letter" //set document standard
    });
    const logo = require('../../src/asset/image/logoBlue.png'); // with require
    const sizes = {
        xs: 10,
        sm: 14,
        p: 16,
        h3: 18,
        h2: 20,
        h1: 22
    };
    const fonts = {
        times: 'Times',
        helvetica: 'Helvetica'
    };

    const margin = 0.5; // inches on a 8.5 x 11 inch sheet.
    const verticalOffset = margin;
    // define the columns we want and their titles
    const tableColumns = ["No", "Req-Id", "User", "Handler", "Summary of incident", "Service Detail", "Date", "Status"];
    // for each ticket pass all its data into an array
    const tableRows = tickets.map((ticket, index) => [
        index+1,
        ticket.id,
        ticket.fromEmp,
        ticket.iSOby,
        ticket.description,
        ticket.serviceID,
        dayjs(ticket.createDate).format("YYYY-MM-dd h:mm A"),
        ticket.proId,
    ]);
    const d = new Date();
    doc.addImage(logo,'png',48, 10, 100, 50)
    
    doc.setTextColor(4, 22, 148)
    doc.setFontSize(12)
    doc.text([
        "Request tickets within the last one month.",
        `Date: ${ format(d, "yyyy-MM-dd")}`
    ], 750, 40, 'right');
    

    doc.autoTable(tableColumns, tableRows, {
        pageBreak: "auto",
        rowPageBreak:"avoid",
        styles: {
            // fillColor: [51, 51, 51],
            lineColor: [51, 51, 51],
            lineWidth: 1,
            halign: 'center',
            valign: "middle",
        },
        margin: { top: 70 },
        addPageContent: function (data) {
            doc.text("", 40, 30);
        },
        
    }
    );

    const date = Date().split(" ");
    const dateStr = date[0] + date[1] + date[2] + date[3] + date[4];
    doc.save(`report_${dateStr}.pdf`);
};

export default generatePDF2;