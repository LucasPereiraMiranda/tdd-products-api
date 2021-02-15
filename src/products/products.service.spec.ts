import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './products.entity';
import { ProductsService } from './products.service';

const product1: Product = new Product(
  'Smartphone',
  9999.9,
  'The best Smatphone in the world!',
);
const product2: Product = new Product(
  'Notebook',
  150000.0,
  'The best Notebook in the world!',
);
const updatedProduct: Product = new Product(
  'Smartphone last generation',
  12999,
  'The best last generation Smartphone in the world!',
);

const productArray = [product1, product2];

describe('ProductsService', () => {
  let productsService: ProductsService;
  let productsRepository: Repository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: {
            find: jest.fn().mockResolvedValue(productArray),
            create: jest.fn().mockResolvedValue(product1),
            findOne: jest.fn().mockResolvedValue(product1),
            delete: jest.fn().mockResolvedValue(product1),
            update: jest.fn().mockResolvedValue(updatedProduct),

            metadata: {
              columns: [
                { propetyName: 'id', isPrimary: true },
                { propertyName: 'createdAt' },
                { propertyName: 'updatedAt' },
              ],
              relations: [],
            },
          },
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
      expect(productsService.create(createProductDto)).resolves.toEqual(
        product1,
      );
      expect(productsRepository.create).toBeCalledTimes(1);
      expect(productsRepository.create).toBeCalledWith(createProductDto);
    });
  });

  describe('findAll()', () => {
    it('should find all products, returning a array', async () => {
      const products = await productsService.findAll();
      expect(products).toEqual(productArray);
    });
  });

  describe('findOne()', () => {
    it('should find one product, by id', async () => {
      const productsSpyRepository = jest.spyOn(productsRepository, 'findOne');
      expect(productsService.findOne(1)).resolves.toEqual(product1);
      expect(productsSpyRepository).toBeCalledWith(1);
    });

    it('should throw a BadRequestException if the id not exists', async () => {
      const badId = 10;
      const productsSpyRepository = jest
        .spyOn(productsRepository, 'findOne')
        .mockRejectedValueOnce(
          new BadRequestException(`The product with id ${badId} not exists`),
        );
      expect(productsService.findOne(badId)).resolves.toEqual({
        message: `The product with id ${badId} not exists`,
      });
      expect(productsSpyRepository).toBeCalledWith(badId);
      expect(productsSpyRepository).toBeCalledTimes(1);
    });
  });

  describe('remove()', () => {
    it('should delete one product, by id', async () => {
      const id = 1;
      expect(productsService.findOne(id)).resolves.toEqual(product1);
    });
  });

  describe('update()', () => {
    it('should update one product, by id', async () => {
      const id = 1;

      const createProductDto: CreateProductDto = {
        name: 'Smartphone',
        value: 9999.9,
        description: 'The best Smatphone in the world!',
      };
      const updateProductDto: UpdateProductDto = {
        name: 'Smartphone last generation',
        value: 12999,
        description: 'The best last generation Smartphone in the world!',
      };
      const product = await productsService.create(createProductDto);

      expect(product).toHaveProperty('name');
      expect(product).toHaveProperty('value');
      expect(product).toHaveProperty('description');

      expect(productsService.update(id, updateProductDto)).resolves.toEqual(
        updatedProduct,
      );
    });
  });
});
