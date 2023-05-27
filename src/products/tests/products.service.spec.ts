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

  describe('create()', () => {
    it('should create a product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Smartphone',
        value: 9999.9,
        description: 'The best Smatphone in the world!',
      };

      jest
        .spyOn(productsRepository, 'save')
        .mockResolvedValue(mockedProduct1 as never);

      expect(productsService.create(createProductDto)).resolves.toEqual(
        mockedProduct1,
      );
      expect(productsRepository.save).toBeCalledTimes(1);
      expect(productsRepository.save).toBeCalledWith(createProductDto);
    });
  });

  describe('findAll()', () => {
    it('should find all products, returning a array', async () => {
      jest
        .spyOn(productsRepository, 'find')
        .mockResolvedValue([mockedProduct1, mockedProduct2] as never);

      const products = await productsService.findAll();
      expect(products).toEqual([mockedProduct1, mockedProduct2]);
    });
  });

  describe('findOne()', () => {
    it('should find one product, by id', async () => {
      jest
        .spyOn(productsRepository, 'findOne')
        .mockResolvedValue(mockedProduct1 as never);

      expect(productsService.findOne(1)).resolves.toEqual(mockedProduct1);
    });

    it('should throw a BadRequestException if the id not exists', async () => {
      const badId = 10;
      jest
        .spyOn(productsRepository, 'findOne')
        .mockRejectedValueOnce(
          new BadRequestException(
            `The product with id ${badId} not exists`,
          ) as never,
        );
      expect(productsService.findOne(badId)).rejects.toThrow();
    });
  });

  describe('remove()', () => {
    it('should delete one product, by id', async () => {
      const id = 1;

      jest
        .spyOn(productsRepository, 'findOne')
        .mockResolvedValue(mockedProduct1 as never);

      jest
        .spyOn(productsRepository, 'remove')
        .mockResolvedValue(undefined as never);

      expect(productsService.remove(id)).resolves.toBe(mockedProduct1);
    });
  });
});
