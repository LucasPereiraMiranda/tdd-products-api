import { Test, TestingModule } from '@nestjs/testing';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ProductsController } from '../products.controller';
import { ProductsService } from '../products.service';

describe('ProductsController', () => {
  let controller: ProductsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([
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
            ]),
            findOne: jest.fn().mockImplementation((id: string) =>
              Promise.resolve({
                name: 'Notebook',
                value: 150000.0,
                description: 'The best Notebook in the world!',
                id,
              }),
            ),
            create: jest
              .fn()
              .mockImplementation((createProductDto: CreateProductDto) =>
                Promise.resolve({ ...createProductDto }),
              ),
            update: jest
              .fn()
              .mockImplementation(
                (id: string, updateProductDto: UpdateProductDto) =>
                  Promise.resolve({ id, ...updateProductDto }),
              ),
            remove: jest
              .fn()
              .mockImplementation((id: string) => Promise.resolve({ id })),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll()', () => {
    it('should find one array of products', async () => {
      await expect(controller.findAll()).resolves.toEqual([
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
        await expect(controller.create(createProductDto)).resolves.toEqual({
          name: 'Smartphone',
          value: 9999.9,
          description: 'The best Smatphone in the world!',
        });
      });
    });
  });
});
