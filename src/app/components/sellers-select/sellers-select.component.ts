import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material';

@Component({
  selector: 'app-sellers-select',
  templateUrl: './sellers-select.component.html',
  styleUrls: ['./sellers-select.component.css']
})
export class SellersSelectComponent implements OnInit {

  @Input() title = '';
  @Input() items = [];
  @Input() itemsSelected = [];
  @Output() selected = new EventEmitter<any[]>();

  opened: boolean;

  constructor(
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'pin',
      sanitizer.bypassSecurityTrustResourceUrl('../../../assets/svg/sharp-location_on-24px.svg'));
  }

  ngOnInit() {
  }

  toggleList() {
    this.opened = !this.opened;
  }

  closeList() {
    this.opened = false;
  }

  toggleSelected(item) {
    if (!this.itemsSelected.some(elem => elem.email === item.email)) {
      this.itemsSelected.push(item);
    } else {
      this.itemsSelected = this.itemsSelected.filter(elem => {
        return elem.email !== item.email;
      });
    }

    this.selected.emit(this.itemsSelected);
  }

  isSelected(item) {
      return this.itemsSelected.some(elem => elem.email === item.email);
  }

}
