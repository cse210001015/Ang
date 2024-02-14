import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getRepos(githubUsername: string, pageNo: number, pageSize: number): Observable<any[]> {
    return this.httpClient.get<any[]>(`https://api.github.com/users/${githubUsername}/repos?page=${pageNo}&per_page=${pageSize}`);
  }

  getUser(githubUsername: string): Observable<any> {
    return this.httpClient.get<any>(`https://api.github.com/users/${githubUsername}`);
  }
}
