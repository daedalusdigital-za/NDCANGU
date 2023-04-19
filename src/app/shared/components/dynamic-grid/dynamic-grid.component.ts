import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MenuItem, PrimeNGConfig } from 'primeng/api';
import { IColumns } from '../../interfaces/dynamic-grid-interfaces';
import { Paginator } from 'primeng/paginator';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'
import { saveAs } from 'file-saver';
import { Table } from 'primeng/table'; 


@Component({
  selector: 'app-dynamic-grid',
  templateUrl: './dynamic-grid.component.html',
  styleUrls: ['./dynamic-grid.component.scss']
})

export class DynamicGridComponent implements OnInit {
  @Input() columns: IColumns[];
  @Input() totalRecords: number;
  @Input() data: any = [];

  @Input() isPagination: boolean = true;


  _selectedColumns: any[] = [];
  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }
  set selectedColumns(val: any[]) {
    this._selectedColumns = this.columns.filter((col: any) => val.includes(col));
  }


  items: MenuItem[] = [];

  rowsPerPageOptions: any[] = [5, 20, 50];
  @Output() onPageChange: EventEmitter<any> = new EventEmitter();

  @ViewChild('paginator', { static: true }) paginator: Paginator;
  @ViewChild('dt', { static: false }) dt: Table;

  first: number = 0;
  exportColumns: any = [];
  exportPdfColumns: any = [];

  constructor() { }

  ngOnInit(): void {
    this.exportColumns = this.columns.map(col => ({ title: col.header, dataKey: col.field }));
    this.exportPdfColumns = this.columns.map(col => col.header);
  }


  onPaginaton(event: any) {
    this.onPageChange.emit(event);
  }


  exportPdf() {
    const PdfData = this.data.map((item: any) => ([item.name, item.age, item.job, item.height]))

    const doc = new jsPDF();
    autoTable(doc, {
      head: [this.exportPdfColumns], body: PdfData
    })

    doc.save(`HCD Software Reports_${new Date().getTime()}.pdf`)
  }

  exportExcel() {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.data);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "HCD Software Reports");
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }


  copyTableContent() {
    const tableElement = this.dt.el.nativeElement; // Get the nativeElement of the table
    const tableHtml = tableElement.outerHTML; // Get the outerHTML of the table
    const textAreaElement: any = document.createElement('textarea'); // Create a textarea element
    textAreaElement.value = tableHtml; // Set the value of the textarea to the table HTML
    document.body.appendChild(textAreaElement); // Append the textarea element to the DOM
    textAreaElement.select(); // Select the textarea
   const res: any = document.execCommand('copy'); // Execute the copy command
    document.body.removeChild(textAreaElement.replace(/<[^>]*>?/gm, '')); // Remove the textarea element from the DOM
  }
}
