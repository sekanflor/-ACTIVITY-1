import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from './product.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  products: any[] = [];
  productForm: FormGroup;
  currentProductId: number | null = null;
  categories: string[] = [];
  showFormPopup = false;

  constructor(private productService: ProductService, private fb: FormBuilder) {
    this.productForm = this.fb.group({
      title: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      description: [''],
      image: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(limit?: number, sortBy?: 'price' | 'rating', order?: 'asc' | 'desc') {
    if (limit) {
      this.productService.getLimitedProducts(limit).subscribe(
        data => this.products = data,
        error => console.error('Error fetching limited products:', error)
      );
    } else if (sortBy && order) {
      this.productService.getSortedProducts(sortBy, order).subscribe(
        data => this.products = data,
        error => console.error('Error fetching sorted products:', error)
      );
    } else {
      this.productService.getProducts().subscribe(
        data => this.products = data,
        error => console.error('Error fetching products:', error)
      );
    }
  }

  loadCategories() {
    this.productService.getCategories().subscribe(
      data => this.categories = data,
      error => console.error('Error fetching categories:', error)
    );
  }

  addToCart(product: any) {
    console.log('Adding to cart:', product);
    // Implement your add-to-cart logic here
  }

  buyProduct(product: any) {
    console.log('Buying product:', product);
    // Implement your buy logic here
  }

  onSubmit() {
    if (this.productForm.valid) {
      const product = this.productForm.value;

      if (this.currentProductId) {
        // Update an existing product
        this.productService.updateProduct(this.currentProductId, product).subscribe(
          response => {
            console.log('Product updated:', response);
            this.loadProducts(); // Reload products after updating
            this.closeFormPopup(); // Close the form popup after saving
          },
          error => console.error('Error updating product:', error)
        );
      } else {
        // Add a new product
        this.productService.addProduct(product).subscribe(
          response => {
            console.log('Product added:', response);
            this.loadProducts(); // Reload products after adding
            this.closeFormPopup(); // Close the form popup after saving
          },
          error => console.error('Error adding product:', error)
        );
      }
    }
  }

  editProduct(product: any) {
    this.currentProductId = product.id;
    this.productForm.patchValue(product);
    this.showFormPopup = true; // Open the form popup
  }

  deleteProduct(productId: number) {
    this.productService.deleteProduct(productId).subscribe(
      response => {
        console.log('Product deleted:', response);
        this.loadProducts(); // Reload products after deleting
      },
      error => console.error('Error deleting product:', error)
    );
  }

  openFormPopup() {
    this.currentProductId = null;
    this.productForm.reset();
    this.showFormPopup = true; // Open the form popup
  }

  closeFormPopup() {
    this.showFormPopup = false; // Close the form popup
  }
}
