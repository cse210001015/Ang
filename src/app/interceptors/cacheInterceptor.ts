// Example of an HTTP interceptor for response caching
import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpInterceptor, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
    private cache = new Map<string, HttpResponse<any>>();

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Check if the request is a GET request
        if (request.method !== 'GET') {
            return next.handle(request);
        }

        // Check if the response is already cached
        const cachedResponse = this.cache.get(request.url);
        if (cachedResponse) {
            return of(cachedResponse);
        }

        // Continue with the original request and cache the response
        return next.handle(request).pipe(
            tap(event => {
                if (event instanceof HttpResponse) {
                    this.cache.set(request.url, event);
                }
            })
        );
    }
}
