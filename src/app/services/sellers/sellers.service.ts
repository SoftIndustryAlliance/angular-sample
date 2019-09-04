import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import {Seller} from '../../models/seller';

import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SellersService {

  private url = environment.url;

  constructor(private http: HttpClient) {}

  getSellers(): Observable<Seller[]> {
    const sellersUrl = `${this.url}sellers`;
    return this.http.get<Seller[]>(sellersUrl);
  }

  getSellersWithCups(sellers: Seller[], startDate, endDate): Observable<Seller[]> {
    const data = JSON.stringify({endDate, startDate, sellers});

    const sellersUrl = `${this.url}sellers/${data}`;
    return this.http.get<Seller[]>(sellersUrl);

  }

}
