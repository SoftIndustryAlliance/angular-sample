import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { Seller } from '../../models/seller';
import { ReportService } from '../../services/report/report.service';
import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit, OnChanges {

  @Input() startDate;
  @Input() endDate;
  @Input() sellers: Seller[];

  isLoaded: boolean;

  private cupsSum = 0;
  private cupsFreeSum = 0;
  private cupsTotalSum = 0;

  constructor(public reportService: ReportService) { }

  ngOnInit() {
  }

  ngOnChanges(): void {
    if (this.sellers) {
      this.cupsCleanUp();
      this.sellers.forEach(seller => {
        this.cupsSum += seller.cups;
        this.cupsFreeSum += seller.cupsFree;
        this.cupsTotalSum += seller.cupsTotal;
      });
    }
  }

  private cupsCleanUp() {
    this.cupsSum = 0;
    this.cupsFreeSum = 0;
    this.cupsTotalSum = 0;
  }

  private generateTableData() {
    const result = [];
    this.sellers.forEach((seller, index) => {
      const row = {};
      row['#'] = index + 1;
      row['email'] = seller.email;
      row['cups'] = seller.cups;
      row['cupsFree'] = seller.cupsFree;
      row['cupsTotal'] = seller.cupsTotal;

      result.push(row);
    });

    result.push({
      blank: '',
      period: `Всего за период: ${this.startDate.toLocaleDateString('hc')} - ${this.endDate.toLocaleDateString('hc')}`,
      cups: this.cupsSum,
      cupsFree: this.cupsFreeSum,
      cupsTotal: this.cupsTotalSum
    });
    return result;
  }

  csvExport() {
    const result = this.generateTableData();
    const options = {
      headers: ['№', 'Продавец', 'Кол-во платных чашек', 'Кол-во бесплатных чашек', 'Чашек всего']
    };
    const currentDate = new Date().toLocaleDateString('hc',
      {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
      }).replace(' ', '');
    const filename = `7-Cups-${currentDate}`;
    new Angular5Csv(result, filename, options);
  }
}
