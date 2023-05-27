import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from '../products.controller';
import { ProductsService } from '../products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryFactoryMock } from '../../common/tests/repositoryFactory.mock';
import { Product } from '../products.entity';
import { mockedProduct1, mockedProduct2 } from './mocks/products.mock';

describe('ProductsController', () => {
  let productsController: ProductsController;
  let productsService: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useFactory: repositoryFactoryMock,
        },
      ],
    }).compile();

    productsController = module.get<ProductsController>(ProductsController);
    productsService = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(productsController).toBeDefined();
  });

  describe('findAll()', () => {
    it('should find one array of products', async () => {
      jest
        .spyOn(productsService, 'findAll')
        .mockResolvedValue([mockedProduct1, mockedProduct2] as any);
      await expect(productsController.findAll()).resolves.toEqual([
        mockedProduct1,
        mockedProduct2,
      ]);
    });

    describe('create()', () => {
      it('should create one products', async () => {
        jest
          .spyOn(productsService, 'create')
          .mockResolvedValue(mockedProduct1 as any);

        await expect(
          productsController.create(mockedProduct1),
        ).resolves.toEqual(mockedProduct1);
      });
    });
    describe('findOne()', () => {
      const id = '1';
      it('should find one product, by id', async () => {
        jest
          .spyOn(productsService, 'findOne')
          .mockResolvedValue(mockedProduct1 as any);

        await expect(productsController.findOne(id)).resolves.toEqual(
          mockedProduct1,
        );
      });
    });

    describe('update()', () => {
      const id = '1';
      it('should update a product', async () => {
        jest.spyOn(productsService, 'update').mockResolvedValue({
          id: +id,
          ...mockedProduct1,
        } as any);

        await expect(
          productsController.update(id, mockedProduct1),
        ).resolves.toEqual({
          id: +id,
          ...mockedProduct1,
        });
      });
    });

    describe('remove()', () => {
      const id = '1';
      it('should delete a product and return this', async () => {
        jest
          .spyOn(productsService, 'remove')
          .mockResolvedValue(mockedProduct1 as any);

        await expect(productsController.remove(id)).resolves.toEqual(
          mockedProduct1,
        );
      });
    });
  });
});
