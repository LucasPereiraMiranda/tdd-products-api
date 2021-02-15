import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './products.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const { name, value, description } = createProductDto;
    const product = new Product();
    product.name = name;
    product.value = value;
    product.description = description;
    return this.productRepository.create(createProductDto);
  }

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find();
  }
}
