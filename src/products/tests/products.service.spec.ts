import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Product } from '../products.entity';
import { ProductsService } from '../products.service';

const mockProduct1: Product = new Product(
  'Smartphone',
  9999.9,
  'The best Smatphone in the world!',
);
const mockProduct2: Product = new Product(
  'Notebook',
  150000.0,
  'The best Notebook in the world!',
);
const mockUpdatedProduct: Product = new Product(
  'Smartphone last generation',
  12999,
  'The best last generation Smartphone in the world!',
);

const productArray = [mockProduct1, mockProduct2];

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: Repository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: {
            find: jest.fn().mockResolvedValue(productArray),
            create: jest.fn().mockResolvedValue(mockProduct1),
            save: jest.fn().mockResolvedValue(mockProduct1),
            findOne: jest.fn().mockResolvedValue(mockProduct1),
            delete: jest.fn().mockResolvedValue(mockProduct1),
            update: jest.fn().mockResolvedValue(mockUpdatedProduct),

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

    service = module.get<ProductsService>(ProductsService);
    repository = module.get(getRepositoryToken(Product));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('create()', () => {
    it('should create a product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Smartphone',
        value: 9999.9,
        description: 'The best Smatphone in the world!',
      };
      expect(service.create(createProductDto)).resolves.toEqual(mockProduct1);
      expect(repository.save).toBeCalledTimes(1);
      expect(repository.save).toBeCalledWith(createProductDto);
    });
  });

  describe('findAll()', () => {
    it('should find all products, returning a array', async () => {
      const products = await service.findAll();
      expect(products).toEqual(productArray);
    });
  });

  describe('findOne()', () => {
    it('should find one product, by id', async () => {
      const productsSpyRepository = jest.spyOn(repository, 'findOne');
      expect(service.findOne(1)).resolves.toEqual(mockProduct1);
      expect(productsSpyRepository).toBeCalledWith(1);
    });

    it('should throw a BadRequestException if the id not exists', async () => {
      const badId = 10;
      const productsSpyRepository = jest
        .spyOn(repository, 'findOne')
        .mockRejectedValueOnce(
          new BadRequestException(`The product with id ${badId} not exists`),
        );
      expect(service.findOne(badId)).resolves.toEqual({
        message: `The product with id ${badId} not exists`,
      });
      expect(productsSpyRepository).toBeCalledWith(badId);
      expect(productsSpyRepository).toBeCalledTimes(1);
    });
  });

  describe('remove()', () => {
    it('should delete one product, by id', async () => {
      const id = 1;
      expect(service.remove(id)).resolves.toEqual(mockProduct1);
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
      const product = await service.create(createProductDto);

      expect(product).toHaveProperty('name');
      expect(product).toHaveProperty('value');
      expect(product).toHaveProperty('description');

      expect(service.update(id, updateProductDto)).resolves.toEqual(
        mockUpdatedProduct,
      );
    });
  });
});
