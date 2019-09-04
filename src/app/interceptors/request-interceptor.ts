import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

import { Observable, of } from 'rxjs';
import { catchError, switchMap, timeout } from 'rxjs/operators';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {

    private timer = 10000;

    private routeWithOutAuth = ['login'];

    private addHeaders(req, url?) {
        let headers = {};
        const authHeaders = {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        };
        if (!this.routeWithOutAuth.includes(req.url)) {
            headers = { ...headers, ...authHeaders };
        }
        return req.clone({
            url,
            setHeaders: headers
        });
    }

    constructor(
        private auth: AuthService,
        private router: Router) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if (localStorage.getItem('token')) {

            const clonedReq = request.clone({
                headers: request.headers.set('Authorization', 'Bearer ' + localStorage.getItem('token'))
            });

            return next.handle(clonedReq).pipe(
                timeout(this.timer),
                catchError(error => {
                    if (error.status === 401) {
                        return this.handle401Error(request, next);
                    } else if (error.error.error === 'The token has been blacklisted') {
                        localStorage.removeItem('token');
                        this.router.navigate(['/login']);
                    } else {
                        this.router.navigate(['/login']);
                        return of(error);
                    }
                })
            );
        }

        return next.handle(request).pipe(
            timeout(this.timer),
            catchError(error => {
                this.router.navigate(['/login']);
                return of(error);
            })
        );
    }

    private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
        return this.auth.refreshToken().pipe(
            switchMap(data => {
                if (data) {
                    localStorage.setItem('token', data['id_token']);
                    localStorage.setItem('refreshToken', data['refresh_token']);
                    const newRequest = this.addHeaders(request, request.url);
                    return next.handle(newRequest);
                }
            })
        );
    }
}
