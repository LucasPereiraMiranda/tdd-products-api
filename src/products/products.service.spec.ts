import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './products.entity';
import { ProductsService } from './products.service';

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
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
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
      const createProductDto = {
        name: 'Smartphone',
        value: 8990.99,
        description: 'The best smartphone in the world!',
      };
      await productsService.create(createProductDto);
      expect(productsRepository.create).toBeCalledWith(createProductDto);
    });
  });
});
