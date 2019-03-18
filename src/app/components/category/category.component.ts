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
  private category: string = '';
  private articles: Article[] = null;
  private stored: Article[] = [];
  private totalResults: number = 0;
  private articlesPerPage: number = 20;
  private pageIndex: number = 1;
  categoryClass: string = '';
  errMsg: string = '';

  constructor(private newsService: NewsService,
    private route: ActivatedRoute,
    private userService: UserService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.articles = null;
      this.category = params.category;
      this.categoryClass = `${this.category.toLowerCase()}-color`;
      this.getArticlesByCategory();
    });
    this.userService.refreshLogin.subscribe(status => {
      if (status) {

      }
    });
  }

  getArticlesByCategory() {
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

  getPreferredArticlesByCategory() {
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

  moreArticlesAvailable() {
    return this.pageIndex < Math.ceil(this.totalResults / this.articlesPerPage);
  }

  loadMoreArticles() {
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

  loadMorePreferredArticles() {
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

  imageError(event: any) {
    event.target.src = photoNotFound;
    event.target.classList.add('photo-not-found');
  }

}
