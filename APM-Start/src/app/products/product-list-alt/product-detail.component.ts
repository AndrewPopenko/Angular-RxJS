import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ProductService } from '../product.service';
import { catchError, combineLatest, EMPTY, filter, map, Subject } from "rxjs";

@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailComponent {
  private errorMessageSubject = new Subject();
  errorMessage$ = this.errorMessageSubject.asObservable();
  product$ = this.productService.selectedProduct$
    .pipe(
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      })
    );

  pageTitle$ = this.productService.selectedProduct$
    .pipe(
      map(p => p ? `Product Detail for: ${p.productName}` : null)
    )


  productSuppliers$ = this.productService.selectedProductSuppliers$
    .pipe(
      catchError(err => {
        this.errorMessageSubject.next(err);
        return EMPTY;
      })
    )

  vm$ = combineLatest([
    this.product$,
    this.productSuppliers$,
    this.pageTitle$
  ])
    .pipe(
      filter(([product]) => Boolean(product)),
      map(([product, productSuppliers, pageTitle]) => ({
        product, productSuppliers, pageTitle
      }))
    )

  constructor(private productService: ProductService) {
  }

}
