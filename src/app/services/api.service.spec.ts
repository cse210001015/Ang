import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifies that no requests are outstanding after each test
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch user repositories', () => {
    const githubUsername = 'johnpapa';
    const pageNo = 1;
    const pageSize = 2;

    service.getRepos(githubUsername, pageNo, pageSize).subscribe(repos => {
      expect(repos).toHaveSize(2);
    })

    const req = httpMock.expectOne(`https://api.github.com/users/${githubUsername}/repos?page=${pageNo}&per_page=${pageSize}`);
    expect(req.request.method).toBe('GET');
  });

  it('should fetch user', () => {
    const githubUsername = 'johnpapa';

    service.getUser(githubUsername).subscribe(user => {
      expect(user).toBeDefined();
    });

    const req = httpMock.expectOne(`https://api.github.com/users/${githubUsername}`);
    expect(req.request.method).toBe('GET');
  });
});
