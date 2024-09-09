import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './modules/products/products.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { SubcategoriesModule } from './modules/subcategories/subcategories.module';
import { ProvidersModule } from './modules/providers/providers.module';
import { FilesModule } from './helpers/files/files.module';

@Module({
  imports: [

    //? Configuración Global
    ConfigModule.forRoot({ isGlobal: true }),

    //? Módulos tipo Helper
    FilesModule,

    //? Módulos del MS
    ProductsModule,
    CategoriesModule,
    SubcategoriesModule,
    ProvidersModule

  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
