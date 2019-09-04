import { Component, OnInit, ViewChild } from '@angular/core';
import { ReportService } from '../../services/report/report.service';
import { ReportComponent } from '../report/report.component';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {

  @ViewChild(ReportComponent) report: ReportComponent;

  constructor(public reportService: ReportService) { }

  ngOnInit() {
  }

  reportLoaderToggle(state: boolean): void {
    this.report.isLoaded = state;
  }

}
