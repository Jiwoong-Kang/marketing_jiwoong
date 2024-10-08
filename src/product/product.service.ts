import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { PageOptionsDto } from '@common/dtos/page-options.dto';
import { PageDto } from '@common/dtos/page.dto';
import { PageMetaDto } from '@common/dtos/page-meta.dto';
import { BufferedFile } from '@root/minio-client/file.model';
import { MinioClientService } from '@root/minio-client/minio-client.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly minioClientService: MinioClientService,
  ) {}

  async getProducts(pageOptionsDto: PageOptionsDto): Promise<PageDto<Product>> {
    // const products = await this.productRepository.find();
    // return { count: products.length, data: products };
    const queryBuilder = this.productRepository.createQueryBuilder('product');
    queryBuilder
      .orderBy('product.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
  }

  async getProduct(id: string) {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    return product;
  }

  async postProduct(
    image?: BufferedFile,
    createdProductDto?: CreateProductDto,
  ) {
    const productImg = await this.minioClientService.createProductImg(
      image,
      'product',
      createdProductDto.category,
    );
    const newProduct = await this.productRepository.create({
      productImg,
      ...createdProductDto,
    });
    await this.productRepository.save(newProduct);
    return newProduct;
  }

  async deleteProducts() {
    const deleteResponse = await this.productRepository.delete({});
    if (!deleteResponse) {
      throw new HttpException('Something new Error', HttpStatus.NOT_FOUND);
    }
    return 'Deleted every product';
  }

  async deleteProductById(id: string) {
    const deleteResponse = await this.productRepository.delete({ id });
    if (!deleteResponse) {
      throw new HttpException('Products not Found', HttpStatus.NOT_FOUND);
    }
    return 'Deleted the product';
  }

  async updateProductById(
    id: string,
    image?: BufferedFile,
    updateProductDto?: CreateProductDto,
  ) {
    const productImg = await this.minioClientService.uploadProductImg(
      id,
      image,
      'Product',
    );
    await this.productRepository.update(id, {
      ...updateProductDto,
      productImg,
    });
    const updatedProduct = await this.productRepository.findOneBy({ id });
    if (updatedProduct) {
      return updatedProduct;
    }
    throw new HttpException('Update Denied', HttpStatus.NOT_FOUND);
  }
}
