import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { SellersService } from '../../services/sellers/sellers.service';
import { ReportService } from '../../services/report/report.service';
import { AuthService } from '../../services/auth/auth.service';
import { Seller } from '../../models/seller';
import { SellersSelectComponent } from '../sellers-select/sellers-select.component';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';

import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

// for angular material formatting
export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD.MM.YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'ru-RU' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },

    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]

})
export class HeaderComponent implements OnInit {

  @ViewChild(SellersSelectComponent)
  private sellersSelect: SellersSelectComponent;

  @Output() private loaderToggle = new EventEmitter<boolean>();
  @Output() private csvExport = new EventEmitter();

  isLoaded: boolean;
  disabled = true;

  sellers: Seller[];
  selectedSellers: Seller[] = [];

  formData = {};

  minDateSale: Date;
  maxDateSale = new Date();

  showModal: boolean;
  alertText: string;

  constructor(
    private sellersService: SellersService,
    public reportService: ReportService,
    private authService: AuthService,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'close',
      sanitizer.bypassSecurityTrustResourceUrl('../../../assets/svg/baseline-close-24px.svg'));
  }

  ngOnInit() {
    this.getSellers();
  }

  private getSellers() {
    this.sellersService.getSellers().subscribe(sellers => {
      this.sellers = sellers;
      this.isLoaded = true;
    });
  }

  private getSellersWithCups(sellers, startDate, endDate) {
    this.loaderToggle.emit(true);
    this.sellersService.getSellersWithCups(sellers, startDate, endDate)
      .subscribe(sellersWithCups => {
        this.reportService.startDateReport = startDate;
        this.reportService.endDateReport = endDate;
        this.reportService.sellersReport = sellersWithCups;
        this.disabled = false;
        this.loaderToggle.emit(false);
      });
  }

  setSelectedSellers(seletedSellers) {
    this.selectedSellers = seletedSellers;
    const minDates = this.selectedSellers.map(seller => +seller.firstSale);
    const minDate = Math.min(...minDates);
    this.minDateSale = new Date(minDate);
    if (!this.formData['startDate']) {
      this.formData['startDate'] = this.minDateSale;
      return;
    }
    if (this.minDateSale > this.formData['startDate']) {
      this.formData['startDate'] = this.minDateSale;
      return;
    }
  }

  removeFromSelected(sellerToRemove: Seller) {
    this.selectedSellers = this.selectedSellers.filter(seller => {
      return seller.id !== sellerToRemove.id;
    });
    this.sellersSelect.toggleSelected(sellerToRemove);
  }

  onSubmit() {

    if (!this.selectedSellers || this.selectedSellers.length < 1) {
      this.invokeModal('Не указаны продавцы');
      this.restorePreviousState();
      return;
    }

    let startDate = this.formData['startDate'];
    let endDate = this.formData['endDate'];

    if (!startDate) {
      this.invokeModal('Не указана дата начала периода');
      return;
    }
    if (!endDate) {
      this.invokeModal('Не указана дата окончания периода');
      return;
    }

    // cheking wether it's date or moment.js object
    startDate = (startDate instanceof Date) ? startDate : startDate.toDate();
    endDate = (endDate instanceof Date) ? endDate : endDate.toDate();

    endDate = new Date(endDate.setHours(23, 59, 59, 999));

    if (startDate > endDate) {
      this.invokeModal('Дата начала периода не может превышать дату окончания периода');
      return;
    }

    const sellers = this.selectedSellers;
    this.getSellersWithCups(sellers, startDate, endDate);
  }

  exportToCsv() {
    this.csvExport.emit();
  }

  signOut() {
    this.authService.signOut();
    this.reportService.startDateReport = [];
    this.reportService.endDateReport = [];
    this.reportService.sellersReport = [];
  }

  private invokeModal(text) {
    this.alertText = text;
    this.showModal = true;
  }

  // clening-up the table and select users that were in the previous table
  private restorePreviousState() {
    this.selectedSellers = this.reportService.sellersReport;
    this.sellersSelect.itemsSelected = this.reportService.sellersReport;
    this.reportService.sellersReport = [];
    this.disabled = true;
  }
}
