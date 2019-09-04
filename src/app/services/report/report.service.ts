import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  sellersReport = [];
  startDateReport;
  endDateReport;
}
