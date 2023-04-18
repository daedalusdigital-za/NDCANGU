import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-stats',
  templateUrl: './add-stats.component.html',
  styleUrls: ['./add-stats.component.scss']
})
export class AddStatsComponent implements OnInit {

  files: any[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  /**
 * on file drop handler
 */
  onFileDropped(event: any) {
    this.prepareFilesList(event);
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(event: any) {
    console.log('ETSTTT', event.target.files)
    this.prepareFilesList(event.target.files);
  }

  /**
 * Convert Files list to normal array list
 * @param files (Files List)
 */
  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.files.push(item);
    }
    this.uploadFilesSimulator(0);
  }

  /**
* Simulate the upload process
*/
  uploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.files[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            this.files[index].progress += 5;
          }
        }, 200);
      }
    }, 1000);
  }

    /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
    formatBytes(bytes: any, decimals?: any) {
      if (bytes === 0) {
        return '0 Bytes';
      }
      const k = 1024;
      const dm = decimals <= 0 ? 0 : decimals || 2;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

}
