import { DisplayPrice, getDiscountInPercent } from "components/display/price";
import { ProductPicker } from "components/product/picker";
import { Section } from "components/section";
import { ProductSlideSkeleton } from "components/skeletons";
import React, { FC, Suspense } from "react";
import { useRecoilValue } from "recoil";
import { recommendProductsState } from "state";
import { Swiper, SwiperSlide } from "swiper/react";
import { convertStringToNumber } from "utils/helpers";
import { calcFinalPrice } from "utils/price";
import { Box, Text } from "zmp-ui";

export const RecommendContent: FC = () => {
  const recommendProducts = useRecoilValue(recommendProductsState);

  return (
    <Section title="Gợi ý cho bạn" padding="title-only">
      <Swiper slidesPerView={1.25} spaceBetween={16} className="px-4">
        {recommendProducts.map((product) => (
          <SwiperSlide key={product.sku}>
            <ProductPicker product={product}>
              {({ open }) => (
                <div onClick={open} className="space-y-3">
                  <Box
                    className="relative aspect-video rounded-lg bg-cover bg-center bg-skeleton shadow-lg"
                    style={{ backgroundImage: `url(${product.image})` }}
                  >
                    {product.priceSale && (
                      <Text
                        size="xxxxSmall"
                        className="absolute right-2 top-2 uppercase bg-green text-white h-4 px-[6px] rounded-full"
                      >
                        {/* {"-"} */}
                        {/* {convertStringToNumber(product.priceSale) * 100}% */}
                        {/* {product.priceSale.type === "percent" ? ( */}
                        {/* `$?{product.priceSale.percent * 100}%` */}
                        {/* // ) : ( */}
                        <DisplayPrice>{Math.round(getDiscountInPercent(product.priceBefore, product.priceSale || "0") * 100)}</DisplayPrice>
                        <span>%</span>
                      </Text>
                    )}
                  </Box>
                  <Box className="space-y-1">
                    <Text size="small">{product.name}</Text>
                    <Text size="xxSmall" className="line-through text-red">
                      <DisplayPrice useCurrency>{convertStringToNumber(product.priceBefore)}</DisplayPrice>
                    </Text>
                    <Text size="large" className="font-medium text-primary">
                      <DisplayPrice useCurrency>
                        {calcFinalPrice(product)}
                      </DisplayPrice>;
                    </Text>
                  </Box>
                </div>
              )}
            </ProductPicker>
          </SwiperSlide>
        ))}
      </Swiper>
    </Section>
  );
};

export const RecommendFallback: FC = () => {
  const recommendProducts = [...new Array(3)];

  return (
    <Section title="Gợi ý cho bạn" padding="title-only">
      <Swiper slidesPerView={1.25} spaceBetween={16} className="px-4">
        {recommendProducts.map((_, i) => (
          <SwiperSlide key={i}>
            <ProductSlideSkeleton />
          </SwiperSlide>
        ))}
      </Swiper>
    </Section>
  );
};

export const Recommend: FC = () => {
  return (
    <Suspense fallback={<RecommendFallback />}>
      <RecommendContent />
    </Suspense>
  );
};
