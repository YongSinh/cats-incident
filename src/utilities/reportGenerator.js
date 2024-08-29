
// export default generatePDF;
import jsPDF from "jspdf";
import "jspdf-autotable";
import { format } from "date-fns";

// define a generatePDF function that accepts a tickets argument
const generatePDF = tickets => {
  const doc = new jsPDF();
  // define the columns we want and their titles
  const tableColumns = ["Id", "Requestor", "Handler", "Summary of incident", "Service Detail", "Date", "Status"];

  // for each ticket pass all its data into an array
  const tableRows = tickets.map(ticket => [
    ticket.id,
    ticket.fromEmp,
    ticket.iSOby,
    ticket.description,
    ticket.serviceID,
    format(new Date(ticket.createDate), "yyyy-MM-dd"),
    ticket.proId,
  ]);


  doc.text("Request tickets within the last one month.", 14, 15);

  doc.autoTable(tableColumns, tableRows, {
    startY: 20,
    align:"center",
    styles: {
      header: {
        fontSize: 14,
        bold: true,
        
      },
      body: {
        fontSize: 40,
      },
    },
  }
  );
  const date = Date().split(" ");
  const dateStr = date[0] + date[1] + date[2] + date[3] + date[4];
  doc.save(`report_${dateStr}.pdf`);
};

export default generatePDF;