import React, { FC, useCallback, useEffect, useState } from "react";
import { Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { getDefaultBanner } from "utils/async";
import { API_URL } from "utils/constant";
import { Box } from "zmp-ui";

export const Banner: FC = () => {
  const [banners, setBanners] = useState<string[]>([]);

  const getBannerList = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/sheet/banners`);
      if (response.ok) {
        const result = await response.json();
        console.log('Banner:', result);
        setBanners(result);
      } else {
        console.error('Error fetching data:', response.statusText);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    }
  }, []);

  useEffect(() => {
    getBannerList();
  }, [getBannerList]);

  return (
    <Box className="bg-white" pb={4}>
      <Swiper
        modules={[Pagination]}
        pagination={{
          clickable: true,
        }}
        autoplay
        loop
      >
        {banners.length > 0 ? (
          banners.map((url, index) => (
            <SwiperSlide key={index} className="px-4">
              <Box
                className="w-full rounded-lg aspect-[2/1] bg-cover bg-center"
                style={{ backgroundImage: `url(${url})` }}
              />
            </SwiperSlide>
          ))
        ) : (
          <Box className="w-full px-4">
            <img src={getDefaultBanner()}
              className="rounded-lg w-96" />
          </Box>
        )}
      </Swiper>
    </Box>
  );
};
