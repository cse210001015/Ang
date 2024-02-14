import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ApiService } from './services/api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { UserInterface } from './interfaces/MainInterfaces';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let apiService: ApiService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [HttpClientTestingModule, FormsModule],
      providers: [ApiService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService);
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should reset values correctly', async () => {
    const mockRepos = [{ full_name: 'repo1', html_url: 'url1', description: 'desc1', topics: ['topic1'] }];
    const mockUser: UserInterface = { name: 'John', avatar_url: 'avatar', bio: 'Bio', html_url: 'userUrl', location: 'Location', twitter_username: 'twitter', public_repos: 5, login: 'john', twitter_url: 'https://twitter.com/twitter' };
    spyOn(apiService, 'getRepos').and.returnValue(of(mockRepos));
    spyOn(apiService, 'getUser').and.returnValue(of(mockUser));

    component.pageNo = 2;
    component.pageSize = 10;
    await component.resetValues();

    expect(component.repos).toEqual(mockRepos);
    expect(component.user).toEqual(mockUser);
    expect(component.maxPageNo).toEqual(1);
    expect(component.showValue).toBeNull();
  });

  it('should navigate to the specified page', async () => {
    spyOn(component, 'resetValues');
    component.pageNo = 1;
    component.navigate(2);

    expect(component.pageNo).toEqual(2);
    expect(component.resetValues).toHaveBeenCalled();
  });

  it('should handle error when resetting values', async () => {
    spyOn(apiService, 'getRepos').and.throwError('No such username.');
    spyOn(apiService, 'getUser').and.throwError('No such username.');

    await component.resetValues();

    expect(component.repos).toEqual([]);
    expect(component.user).toBeNull();
    expect(component.maxPageNo).toEqual(0);
    expect(component.showValue).toEqual('No such username.');
  });

  it('should convert repos to promise correctly', async () => {
    const mockRepos = [{ full_name: 'repo1', html_url: 'url1', description: 'desc1', topics: ['topic1'] }];
    const reposObservable = of(mockRepos);

    const promise = await component.convertReposToPromise(reposObservable);

    expect(promise).toEqual(mockRepos);
  });

  it('should convert user to promise correctly', async () => {
    const mockUser = { name: 'John', avatar_url: 'avatar', bio: 'Bio', html_url: 'userUrl', location: 'Location', twitter_username: 'twitter', public_repos: 5 };
    const userObservable = of(mockUser);

    const promise = await component.convertUserToPromise(userObservable);

    expect(promise).toEqual(mockUser);
  });

  it('should handle user skeleton template correctly when user data is null', () => {
    component.user = null;
    component.showValue = null;
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('#user_skeleton')).toBeTruthy();
  });

  it('should display repositories correctly', () => {
    const mockRepos = [{ full_name: 'repo1', html_url: 'url1', description: 'desc1', topics: ['topic1'] }];
    component.repos = mockRepos;
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    console.log(compiled);
    expect(compiled.querySelectorAll('#repo').length).toEqual(mockRepos.length);
  });
});
