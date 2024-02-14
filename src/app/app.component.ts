import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import {  tap } from 'rxjs/operators';
import { DataInterface, RepoInterface, UserInterface } from './interfaces/MainInterfaces';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: []
})
export class AppComponent implements OnInit {
  repos: RepoInterface[] = [];
  user: UserInterface | null = null;
  username: string = 'johnpapa';
  pageSizes: number[] = [10, 20, 25, 50, 75, 100];
  pageSize: number = this.pageSizes[0];
  pageNo: number = 1;
  showValue: string | null = null;
  maxPageNo: number = 0;
  pageSizeArray: number[] = [];

  constructor(private apiService: ApiService) {}

  /**
   * Initializes the component by resetting values on startup.
   */
  ngOnInit() {
    this.resetValues();
  }

  /**
   * Converts an Observable returning an array to a Promise returning an array.
   * @param source The Observable to convert.
   * @returns A Promise containing the data from the Observable.
   */
    /**
   * Converts an Observable to a Promise.
   * @param source The Observable to convert.
   * @returns A Promise containing the data from the Observable.
   */
    convertReposToPromise(source: Observable<any[]>): Promise<any[]> {
      return new Promise((resolve, reject) => {
        let result: any[] = [];
        source.pipe(
          tap({
            next: value => (result = value),
            error: error => reject(error),
            complete: () => resolve(result),
          })
        ).subscribe();
      });
    }

    /**
   * Converts an Observable returning an array to a Promise returning an array.
   * @param source The Observable to convert.
   * @returns A Promise containing the data from the Observable.
   */
    /**
   * Converts an Observable to a Promise.
   * @param source The Observable to convert.
   * @returns A Promise containing the data from the Observable.
   */
    convertUserToPromise(source: Observable<any>): Promise<any> {
      return new Promise((resolve, reject) => {
        let result: any;
        source.pipe(
          tap({
            next: value => (result = value),
            error: error => reject(error),
            complete: () => resolve(result),
          })
        ).subscribe();
      });
    }

  /**
   * Gets data from an Observable and extracts the full names.
   * @param source The Observable to get data from.
   * @returns An array of full names extracted from the Observable data.
   */
  async getDataFromObservable(sourceRepos: Observable<any>, sourceUser: Observable<any>): Promise<DataInterface> {
    const promises = [this.convertReposToPromise(sourceRepos), this.convertUserToPromise(sourceUser)];
    let reposData: any[], userData: any;
    [reposData , userData] = await Promise.all(promises);
    const repos = reposData.map((data)=> {
      return {
        full_name: data.full_name,
        html_url: data.html_url,
        description: data.description,
        topics: data.topics,
      }
    });
    let user: UserInterface | null = null;
    if(userData) {
      user = {
        avatar_url: userData.avatar_url,
        bio: userData.bio,
        html_url: userData.html_url,
        location: userData.location,
        name: userData.name,
        login: userData.login,
        twitter_url: "https://twitter.com/"+userData.twitter_username,
        twitter_username: userData.twitter_username,
        public_repos: userData.public_repos,
      }
    }
    const ans = {repos: repos, user: user};
    return ans;
  }

  /**
   * Resets the component values based on the current page number, username, and page size.
   */
  async resetValues() {
    try {
      this.repos = [];
      this.user = null;
      this.showValue = null;
      this.maxPageNo = 0;
      this.pageSizeArray = [];
      for(let i=0;i<this.pageSize;i++)    this.pageSizeArray.push(1);
      console.log(this.pageSizeArray);

      if (this.pageNo <= 0) {
        throw new Error('Page number must be greater than 0.');
      }

      const sourceRepos = this.apiService.getRepos(this.username, this.pageNo, this.pageSize);
      const sourceUser = this.apiService.getUser(this.username);
      const ans = await this.getDataFromObservable(sourceRepos, sourceUser);

      this.repos = ans.repos;
      this.user = ans.user; 
      const no_of_repos = this.user?this.user.public_repos:0;
      this.maxPageNo = Math.ceil( no_of_repos/ this.pageSize);

      if (this.repos.length === 0) {
        this.showValue = 'No repositories to show.';
      } else {
        this.showValue = null;
      }
    } catch (error) {
      this.repos = [];

      if (error instanceof HttpErrorResponse) {
        this.showValue = error.error.message;
      } else if (error instanceof Error) {
        this.showValue = error.message;
      } else {
        this.showValue = 'An unexpected error occurred.';
      }
    }
  }

  /**
   * Navigates to a specific page based on the selected value.
   * @param value The selected page number.
   */
  async navigate(value: any) {
    this.pageNo = Number(value);
    this.resetValues();
  }
}
