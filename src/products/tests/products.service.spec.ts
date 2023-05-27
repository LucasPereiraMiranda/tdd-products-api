import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Product } from '../products.entity';
import { ProductsService } from '../products.service';
import { repositoryFactoryMock } from '../../common/tests/repositoryFactory.mock';
import {
  mockedProduct1,
  mockedProduct2,
  mockedUpdatedProduct,
} from './mocks/products.mock';

import { MockType } from '../../common/tests/mockType';

describe('ProductsService', () => {
  let productsService: ProductsService;
  let productsRepository: MockType<Repository<Product>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useFactory: repositoryFactoryMock,
        },
      ],
    }).compile();

    productsService = module.get<ProductsService>(ProductsService);
    productsRepository = module.get(getRepositoryToken(Product));
  });

  it('should be defined', () => {
    expect(productsService).toBeDefined();
    expect(productsRepository).toBeDefined();
  });
});
