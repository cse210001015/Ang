export interface RepoInterface
{
    full_name: string;
    html_url: string;
    description: string;
    topics: string[];
}

export interface DataInterface 
{
    repos: RepoInterface[];
    user: any;
}

export interface UserInterface
{
    avatar_url: string;
    bio: string;
    html_url: string;
    location: string;
    name: string;
    login: string;
    twitter_url: string;
    twitter_username: string;
    public_repos: number;
}