import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // @Post()
  @MessagePattern({ cmd: 'create_product' })
  // create(@Body() createProductDto: CreateProductDto) {
  create(@Payload() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
    // return createProductDto;
  }
  @MessagePattern({ cmd: 'find_all_products' })
  // @Get()
  // findAll(@Query() paginationDto: PaginationDto) {
  findAll(@Payload() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }

  @MessagePattern({ cmd: 'find_one_product' })
  // @Get(':id')
  // findOne(@Param('id', ParseIntPipe) id: number) {
  findOne(@Payload('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @MessagePattern({ cmd: 'update_product' })
  // @Patch(':id')
  update(
    // @Param('id', ParseIntPipe) id: string,
    @Payload('id', ParseIntPipe) id: number,
    // @Body() updateProductDto: UpdateProductDto,
    @Payload() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(updateProductDto.id, updateProductDto);
  }

  @MessagePattern({ cmd: 'delete_product' })
  // @Delete(':id')
  remove(@Payload('id', ParseIntPipe) id: number) {
    // remove(@Param('id', ParseIntPipe) id: string) {
    return this.productsService.remove(+id);
  }
}
