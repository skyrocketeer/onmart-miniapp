import { ProductItem } from "components/product/item";
import { Section } from "components/section";
import { ProductItemSkeleton } from "components/skeletons";
import React, { FC, Suspense } from "react";
import { useRecoilValue } from "recoil";
import { productsState } from "state";
import { Box } from "zmp-ui";
import { isInStock } from 'utils/product'

export const ProductListContent: FC = () => {
  const products = useRecoilValue(productsState);

  return (
    <Section title="Danh sách sản phẩm">
      <Box className="grid gap-4">
        {products.filter(product => isInStock(product.inStock)).map((product) => (
          <ProductItem key={product.sku} product={product} />
        ))}
      </Box>
    </Section>
  );
};

export const ProductListFallback: FC = () => {
  const products = [...new Array(12)];

  return (
    <Section title="Danh sách sản phẩm">
      <Box className="grid grid-cols-2 gap-4">
        {products.map((_, i) => (
          <ProductItemSkeleton key={i} />
        ))}
      </Box>
    </Section>
  );
};

export const ProductList: FC = () => {
  return (
    <Suspense fallback={<ProductListFallback />}>
      <ProductListContent />
    </Suspense>
  );
};
