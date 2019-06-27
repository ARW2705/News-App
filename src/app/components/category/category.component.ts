import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Article } from '../../shared/article';
import { photoNotFound } from '../../shared/photo-not-found';

import { NewsService } from '../../services/news.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  category: string = '';
  articles: Article[] = null;
  stored: Article[] = [];
  totalResults: number = 0;
  articlesPerPage: number = 20;
  pageIndex: number = 1;
  categoryClass: string = '';
  errMsg: string = '';

  constructor(public newsService: NewsService,
    public route: ActivatedRoute,
    public userService: UserService) { }

  // Get headlines by set component category
  getArticlesByCategory(): void {
    this.newsService.getHeadlinesByCategory(this.category, this.articlesPerPage)
      .subscribe(
        response => {
          if (response.totalResults > 0) {
            this.totalResults = response.totalResults;
            this.stored = response.articles;
            this.articles = this.stored.slice(0, 9);
          } else if (response.status == 'ok') {
            this.errMsg = `Articles under the category "${this.category}"
              are currently not available`;
          }
        },
        err => {
          this.errMsg = err;
        }
      );
  }

  // Get articles using user's preferred settings (settings applied server side)
  getPreferredArticlesByCategory():void {
    this.newsService.getPreferredByCategory(this.category, this.articlesPerPage)
      .subscribe(
        response => {
          if (response.totalResults > 0) {
            this.totalResults = response.totalResults;
            this.stored = response.articles;
            this.articles = this.stored.slice(0, 9);
          } else if (response.status == 'ok') {
            this.errMsg = `Articles under the category "${this.category}"
              are currently not available`;
          }
        },
        err => {
          this.errMsg = err;
        }
      );
  }

  // On image not found error, replace with default photo
  imageError(event: any): void {
    event.target.src = photoNotFound;
    event.target.classList.add('photo-not-found');
  }

  // True if there are more articles that can be displayed
  moreArticlesAvailable(): boolean {
    return this.pageIndex < Math.ceil(this.totalResults / this.articlesPerPage);
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.articles = null;
      this.category = params.category;
      this.categoryClass = `${this.category.toLowerCase()}-color`;
      this.getArticlesByCategory();
    });
    this.userService.refreshLogin.subscribe(status => {
      if (status) {
        this.articles = null;
        this.getArticlesByCategory();
      }
    });
  }

  // Get next page of articles by category
  loadMoreArticles(): void {
    this.newsService.getHeadlinesByCategory(this.category, this.articlesPerPage, this.pageIndex + 1)
      .subscribe(
        response => {
          if (response.articles.length) {
            this.pageIndex++;
            this.articles = this.articles.concat(response.articles);
          }
        },
        err => {
          this.errMsg = err;
        }
      );
  }

  // Get next page of preferred settings articles by category (settings applied server side)
  loadMorePreferredArticles():void {
    this.newsService.getPreferredByCategory(this.category, this.articlesPerPage, this.pageIndex + 1)
      .subscribe(
        response => {
          if (response.articles.length) {
            this.pageIndex++;
            this.articles = this.articles.concat(response.articles);
          }
        },
        err => {
          this.errMsg = err;
        }
      );
  }

}
