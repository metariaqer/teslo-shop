import { Injectable } from '@nestjs/common';
import { ProductsService } from './../products/products.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {

  constructor(
    private readonly productsService: ProductsService
  ) {}

  async runSeed() {
    await this.insertProducts();

    return true;
  }

  private async insertProducts() {
    await this.productsService.deleteAllProducts();

    const products = initialData.products;

    const insertPromise = [];

    products.forEach( async product => {
      insertPromise.push( this.productsService.create(product) );
    });

    await Promise.all( insertPromise );

    return true;
  }
}
