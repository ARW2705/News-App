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
  catErrs: CategoryError[] = [];
  articles: Article[] = [];
  previewArticles: Article[] = [];
  categoryArticles: Article[] = [];
  quickviews: string[] = ['top', 'cat'];
  currentQuickview: number = 0;
  previewLimit: number = 5;
  previewIndex: number = 0;
  totalResults: number = 0;
  errMsg: string = '';
  mainArticle: Article = null;
  showQuickview: string = this.quickviews[this.currentQuickview];

  constructor(public newsService: NewsService,
    public userService: UserService,
    public router: Router,
    public cdRef: ChangeDetectorRef) { }

  // Get a headline for each category
  getHeadlinesByCategory(): void {
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

  // Get a headline for each category using user saved settings (settings applied server side)
  getPreferredByCategory(): void {
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

  // Get top headlines using user saved settings (settings applied server side)
  getPreferredHeadlines(): void {
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

  getTopHeadlines(): void {
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

  // On image error, replace image with default photo
  imageError(event: any): void {
    event.target.src = photoNotFound;
    event.target.classList.add('photo-not-found');
  }

  // Load next or previous set of articles to display
  loadArticlesByIndex(direction: string): void {
    if (direction == 'next') {
      ++this.previewIndex;
    } else if (direction == 'prev') {
      --this.previewIndex;
    }
    const index = this.previewIndex * this.previewLimit + 1;
    this.previewArticles = this.articles.slice(index, index + this.previewLimit);
  }

  /**
   * Set load articles by index button disabled attribute
   * Disable next button if already at end of articles
   * Disable prev button if already at the beginning of articles
  **/
  moreArticlesAvailable(direction: string): boolean {
    if (direction == 'next') {
      return  (this.previewIndex + 1) * this.previewLimit < this.totalResults - 1
              ? true
              : false;
    } else if (direction == 'prev') {
      return this.previewIndex ? true: false;
    }
  }

  // Route to categories page
  navigateToCategory(): void {
    this.router.navigate(['/category'], {queryParams: {category: this.mainArticle.category}});
  }

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

  // Assign values returned from NewsAPI
  processHeadlines(news: any): void {
    this.articles = null;
    this.articles = news.articles;
    this.previewIndex = 0;
    this.totalResults = news.articles.length;
    this.mainArticle = this.articles[0];
    this.previewArticles = this.articles.slice(1, this.previewLimit);
    this.cdRef.detectChanges();
  }

  // Select article from quickview to display in main section
  selectArticle(source: string, index: number): void {
    if (source == 'category') {
      this.mainArticle = this.categoryArticles[index];
    } else if (source == 'top') {
      this.mainArticle = this.previewArticles[index];
    }
  }

  // Page through displayed quickview section
  slideQuickview(direction: string): void {
    if (direction == 'next') {
      this.currentQuickview++;
    } else {
      this.currentQuickview--;
    }
    this.showQuickview = this.quickviews[this.currentQuickview];
  }

}
