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
                id: +id,
                name: 'Notebook',
                value: 150000.0,
                description: 'The best Notebook in the world!',
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
            remove: jest.fn().mockImplementation((id: string) =>
              Promise.resolve({
                id: +id,
                name: 'Smartphone',
                value: 9999.9,
                description: 'The best Smatphone in the world!',
              }),
            ),
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
    describe('findOne()', () => {
      const id = '1';
      it('should find one product, by id', async () => {
        await expect(controller.findOne(id)).resolves.toEqual({
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
        await expect(controller.update(id, updateProductDto)).resolves.toEqual({
          id: +id,
          ...updateProductDto,
        });
      });
    });
    describe('remove()', () => {
      const id = '1';
      it('should delete a product and return this', async () => {
        await expect(controller.remove(id)).resolves.toEqual({
          id: +id,
          name: 'Smartphone',
          value: 9999.9,
          description: 'The best Smatphone in the world!',
        });
      });
    });
  });
});
