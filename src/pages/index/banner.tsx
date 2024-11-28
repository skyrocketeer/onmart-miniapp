import React, { FC, useCallback, useEffect, useState } from "react";
import { Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { API_URL } from "utils/constant";
import { Box } from "zmp-ui";

export const Banner: FC = () => {
  const [banners, setBanners] = useState<string[]>([]);

  const getBannerList = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/sheet/banners`);
      if (response.ok) {
        const result = await response.json();
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

  return banners.length > 0 ? (
    <Box className="bg-white" pb={4}>
      <Swiper
        modules={[Pagination]}
        pagination={{
          clickable: true,
        }}
        autoplay
        loop
      >
        {banners.map((url, index) => (
          <SwiperSlide key={index} className="px-4">
            <Box
              className="w-full rounded-lg aspect-[2/1] bg-cover bg-center"
              style={{ backgroundImage: `url(${url})` }}
            />
          </SwiperSlide>
        ))
        }
      </Swiper>
    </Box>) :
    (<Box className="w-full px-4">
      <Box
        className="w-full rounded-lg aspect-[2/1] animate-pulse"
        style={{ backgroundColor: "#E0E0E0" }}
      />
    </Box>
    );
};
