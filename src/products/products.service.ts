import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '../../generated/prisma';
import { PaginationDto } from 'src/common';
import e from 'express';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductsService');
  onModuleInit() {
    this.$connect();
    this.logger.log('Connected to the database');
  }
  async create(createProductDto: CreateProductDto) {
    return this.product.create({ data: createProductDto });
  }
  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10, available } = paginationDto;

    let where = {};

    if (available === 'true') {
      where = { available: true };
    } else if (available === 'false') {
      where = { available: false };
    }

    const totalProducts = await this.product.count({ where });
    const lastPage = Math.ceil(totalProducts / limit);

    return {
      data: await this.product.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
      }),
      meta: {
        total: totalProducts,
        page: page,
        limit: limit,
        lastPage: lastPage,
      },
    };
  }

  async findOne(id: number) {
    const product = await this.product.findUnique({
      where: { id, available: true },
    });
    if (!product) {
      this.logger.error(`Product with id ${id} not found`);
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const { id: __, ...data } = updateProductDto;

    await this.findOne(id);

    return this.product.update({
      where: { id },
      data: data,
    });
  }

  async remove(id: number) {
    // try {
    //   return await this.product.delete({ where: { id } });
    // } catch (error) {
    //   if (error.code === 'P2025') {
    //     this.logger.warn(`Delete failed: Product with id ${id} not found`);
    //     throw new NotFoundException(`Product with id ${id} not found`);
    //   }
    //   this.logger.error(`Unexpected error on delete: ${error.message}`);
    //   throw error;
    // }

    try {
      const product = await this.product.update({
        where: { id },
        data: { available: false },
      });
      return product;
    } catch (error) {
      if (error.code === 'P2025') {
        this.logger.warn(`Delete failed: Product with id ${id} not found`);
        throw new NotFoundException(`Product with id ${id} not found`);
      }
      this.logger.error(`Unexpected error on delete: ${error.message}`);
      throw error;
    }
  }
}
