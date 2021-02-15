import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
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
  'The best Computer in the world!',
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
            save: jest.fn(),
            findOne: jest.fn().mockResolvedValue(product1),

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
      const createProduct1Dto = {
        name: 'Smartphone',
        value: 9999.9,
        description: 'The best Smatphone in the world!',
      };
      expect(productsService.create(createProduct1Dto)).resolves.toEqual(
        product1,
      );
      expect(productsRepository.create).toBeCalledTimes(1);
      expect(productsRepository.create).toBeCalledWith(createProduct1Dto);
    });
  });

  describe('findAll()', () => {
    it('should find all products, returning a array', async () => {
      const products = await productsService.findAll();
      expect(products).toEqual(productArray);
    });
  });
});
