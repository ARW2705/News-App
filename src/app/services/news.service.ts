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

  constructor(private http: HttpClient,
    private processHttpError: ProcessHttpErrorService) { }

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

  filterUseableArticles(articles: Article[]): Article[] {
    return articles.filter(article => {
      return article.author
             && article.title
             && article.description
             && article.content;
    });
  }

  preFilterSources(sources: Source[]): Source[] {
    return sources.filter(source => {
      return !preFilter.some(element => {
        return source.id.includes(element);
      });
    });
  }

  formatArticle(article: Article, category?: string): Article {
    if (category) article.category = category;
    article.title = article.title.replace(/-([^-]+)$/, '');
    article.content = article.content.replace(/\[([^\[]+)$/, '');
    return article;
  }

}
