import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { baseURL } from '../shared/baseurl';
import { apiVersion } from '../shared/api-version';
import { preFilter } from '../shared/pre-filter';
import { Article } from '../shared/article';
import { Source } from '../shared/source';

import { ProcessHttpErrorService } from './process-http-error.service';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  constructor(public http: HttpClient,
    public processHttpError: ProcessHttpErrorService) { }

  /**
   * Filter articles with minimum required data
   *
   * @params: articles - array of articles
   *
   * @return: array of articles that have an author, title, description, and content
  **/
  filterUseableArticles(articles: Article[]): Article[] {
    return articles.filter(article => {
      return article.author
             && article.title
             && article.description
             && article.content;
    });
  }

  /**
   * Remove news source from title and character count from content
   *
   * @params: article - article to format
   * @params: [category] - assign article category if given
   *
   * @return: formatted article
  **/
  formatArticle(article: Article, category?: string): Article {
    if (category) article.category = category;
    article.title = article.title.replace(/-([^-]+)$/, '');
    article.content = article.content.replace(/\[([^\[]+)$/, '');
    return article;
  }

  /**
   * Get 'headlines' with category query param from NewsAPI
   *
   * @params: category - name of category to query
   * @params: pageSize - number of articles per result page
   * @params: pageIndex - the page number of results to get (based on pageSize)
   *
   * @return: Observable - array of headlines from given category
  **/
  getHeadlinesByCategory(category: string, pageSize: number = 10, pageIndex: number = 1): Observable<any> {
    const params = new HttpParams()
      .set('category', category)
      .set('pageSize', pageSize.toString())
      .set('page', pageIndex.toString());

    return this.http.get(baseURL + apiVersion + 'news', {params})
      .pipe(
        map((response: any) => {
          response.articles = this.filterUseableArticles(response.articles)
            .map(article => {
              return this.formatArticle(article, category);
            });
          return response;
        }),
        catchError(err => this.processHttpError.handleError(err))
      );
  }

  /**
   * Get 'headlines' by category from NewsAPI using settings stored in user on server
   *
   * @params: category - name of category to query
   * @params: pageSize - number of articles per result page
   * @params: pageIndex - the page number of results to get (based on pageSize)
   *
   * @return: Observable - array of headlines from given category
  **/
  getPreferredByCategory(category: string, pageSize: number = 10, pageIndex: number = 1): Observable<any> {
    const params = new HttpParams()
      .set('category', category)
      .set('pageSize', pageSize.toString())
      .set('page', pageIndex.toString());

    return this.http.get(baseURL + apiVersion + 'news', {params})
      .pipe(
        map((response: any) => {
          response.articles = this.filterUseableArticles(response.articles)
            .map(article => {
              return this.formatArticle(article, category);
            });
          return response;
        }),
        catchError(err => this.processHttpError.handleError(err))
      );
  }

  /**
   * Get 'top headlines' from NewsAPI using settings stored in user on server
   *
   * @params: pageSize - number of articles per result page
   * @params: pageIndex - the page number of results to get (based on pageSize)
   *
   * @return: Observable - array of top headlines
  **/
  getPreferredTopHeadlines(pageSize: number = 10, pageIndex: number = 1): Observable<any> {
    const params = new HttpParams()
      .set('pageSize', pageSize.toString())
      .set('page', pageIndex.toString());

    return this.http.get(baseURL + apiVersion + 'news/preferred', {params})
      .pipe(
        map((response: any) => {
          response.articles = this.filterUseableArticles(response.articles)
            .map(article => {
              return this.formatArticle(article)
            });
          return response;
        }),
        catchError(err => this.processHttpError.handleError(err))
      );
  }

  /**
   * Get list of possible sources from NewsAPI
   *
   * @return: Observable - array of filtered news sources
  **/
  getSources(): Observable<any> {
    return this.http.get(baseURL + apiVersion + 'news/sources')
      .pipe(
        map((response: any) => {
          response.sources = this.preFilterSources(response.sources);
          return response;
        }),
        catchError(err => this.processHttpError.handleError(err))
      );
  }

  /**
   * Get 'top headlines' from NewsAPI
   *
   * @params: pageSize - number of articles per result page
   * @params: pageIndex - the page number of results to get (based on pageSize)
   *
   * @return: Observable - array of formatted articles
  **/
  getTopHeadlines(pageSize: number = 50, pageIndex: number = 1): Observable<any> {
    const params = new HttpParams()
      .set('pageSize', pageSize.toString())
      .set('page', pageIndex.toString());

    return this.http.get(baseURL + apiVersion + 'news', {params})
      .pipe(
        map((response: any) => {
          response.articles = this.filterUseableArticles(response.articles)
            .map(article => {
              return this.formatArticle(article);
            });
          return response;
        }),
        catchError(err => this.processHttpError.handleError(err))
      );
  }

  /**
   * Filter non-news sources
   *
   * @params: sources: array of sources from NewsAPI
   *
   * @return: array of sources not found in pre filter array
  **/
  preFilterSources(sources: Source[]): Source[] {
    return sources.filter(source => {
      return !preFilter.some(element => {
        return source.id.includes(element);
      });
    });
  }

}
