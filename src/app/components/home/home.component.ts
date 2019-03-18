import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

import { Article } from '../../shared/article';
import { CategoryError } from '../../shared/category-error';
import { categories } from '../../shared/categories';
import { photoNotFound } from '../../shared/photo-not-found';

import { NewsService } from '../../services/news.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private catErrs: CategoryError[] = [];
  private articles: Article[] = [];
  private previewArticles: Article[] = [];
  private categoryArticles: Article[] = [];
  private quickviews: string[] = ['top', 'cat'];
  private currentQuickview: number = 0;
  private previewLimit: number = 5;
  private previewIndex: number = 0;
  private totalResults: number = 0;
  errMsg: string = '';
  mainArticle: Article = null;
  showQuickview: string = this.quickviews[this.currentQuickview];

  constructor(private newsService: NewsService,
    private userService: UserService,
    private router: Router,
    private cdRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.userService.refreshLogin.subscribe(status => {
      if (status) {
        this.getPreferredHeadlines();
      } else {
        this.getTopHeadlines();
      }
    });
    if (this.userService.isLoggedIn()) {
      this.getPreferredHeadlines();
      this.getPreferredByCategory();
    } else {
      this.getTopHeadlines();
      this.getHeadlinesByCategory();
    }
  }

  processHeadlines(news: any) {
    this.articles = null;
    this.articles = news.articles;
    this.previewIndex = 0;
    this.totalResults = news.articles.length;
    this.mainArticle = this.articles[0];
    this.previewArticles = this.articles.slice(1, this.previewLimit);
    this.cdRef.detectChanges();
  }

  getTopHeadlines() {
    this.newsService.getTopHeadlines()
      .subscribe(
        news => {
          this.processHeadlines(news);
        },
        err => {
          this.errMsg = err;
        }
      );
  }

  getHeadlinesByCategory() {
    this.categoryArticles = [];
    categories.forEach(category => {
      this.newsService.getHeadlinesByCategory(category, 3)
        .subscribe(
          news => {
            this.categoryArticles.push(news.articles[0]);
          },
          err => {
            this.catErrs.push({category: category, message: err});
          }
        );
    });
  }

  getPreferredHeadlines() {
    this.newsService.getPreferredTopHeadlines()
      .subscribe(
        news => {
          this.processHeadlines(news);
        },
        err => {
          this.errMsg = err;
        }
      );
  }

  getPreferredByCategory() {
    this.categoryArticles = [];
    categories.forEach(category => {
      this.newsService.getPreferredByCategory(category, 3)
        .subscribe(
          news => {
            this.categoryArticles.push(news.articles[0]);
          },
          err => {
            this.catErrs.push({category: category, message: err});
          }
        );
    });
  }

  slideQuickview(direction: string) {
    if (direction == 'next') {
      this.currentQuickview++;
    } else {
      this.currentQuickview--;
    }
    this.showQuickview = this.quickviews[this.currentQuickview];
  }

  selectArticle(source: string, index: number) {
    if (source == 'category') {
      this.mainArticle = this.categoryArticles[index];
    } else if (source == 'top') {
      this.mainArticle = this.previewArticles[index];
    }
  }

  imageError(event: any) {
    event.target.src = photoNotFound;
    event.target.classList.add('photo-not-found');
  }

  navigateToCategory() {
    this.router.navigate(['/category'], {queryParams: {category: this.mainArticle.category}});
  }

  moreArticlesAvailable(direction: string) {
    if (direction == 'next') {
      return (this.previewIndex + 1) * this.previewLimit < this.totalResults - 1;
    } else if (direction == 'prev') {
      return this.previewIndex;
    }
  }

  loadArticlesByIndex(direction: string) {
    /*
      28
      1 - 6
      7 - 12
      13 - 18
      19 - 24
      25 - 28
    */
    if (direction == 'next') {
      ++this.previewIndex;
    } else if (direction == 'prev') {
      --this.previewIndex;
    }
    const index = this.previewIndex * this.previewLimit + 1;
    this.previewArticles = this.articles.slice(index, index + this.previewLimit);
  }

}
