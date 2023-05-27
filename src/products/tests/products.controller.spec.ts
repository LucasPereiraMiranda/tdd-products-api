import { Test, TestingModule } from '@nestjs/testing';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ProductsController } from '../products.controller';
import { ProductsService } from '../products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { repositoryFactoryMock } from '../../common/tests/repositoryFactory.mock';
import { Product } from '../products.entity';

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
      await expect(productsController.findAll()).resolves.toEqual([
        {
          name: 'Smartphone',
          value: 9999.9,
          description: 'The best Smatphone in the world!',
        },
        {
          name: 'Notebook',
          value: 150000.0,
          description: 'The best Notebook in the world!',
        },
      ]);
    });

    describe('create()', () => {
      it('should create one products', async () => {
        const createProductDto: CreateProductDto = {
          name: 'Smartphone',
          value: 9999.9,
          description: 'The best Smatphone in the world!',
        };
        await expect(
          productsController.create(createProductDto),
        ).resolves.toEqual({
          name: 'Smartphone',
          value: 9999.9,
          description: 'The best Smatphone in the world!',
        });
      });
    });
    describe('findOne()', () => {
      const id = '1';
      it('should find one product, by id', async () => {
        await expect(productsController.findOne(id)).resolves.toEqual({
          id: +id,
          name: 'Notebook',
          value: 150000.0,
          description: 'The best Notebook in the world!',
        });
      });
    });
    describe('update()', () => {
      const id = '1';
      it('should update a product', async () => {
        const updateProductDto: UpdateProductDto = {
          name: 'Smartphone last generation',
          value: 12999,
          description: 'The best last generation Smartphone in the world!',
        };
        await expect(
          productsController.update(id, updateProductDto),
        ).resolves.toEqual({
          id: +id,
          ...updateProductDto,
        });
      });
    });
    describe('remove()', () => {
      const id = '1';
      it('should delete a product and return this', async () => {
        await expect(productsController.remove(id)).resolves.toEqual({
          id: +id,
          name: 'Smartphone',
          value: 9999.9,
          description: 'The best Smatphone in the world!',
        });
      });
    });
  });
});
