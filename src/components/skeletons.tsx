import React, { FC, HTMLProps, PropsWithChildren } from "react";
import cx from "utils/helpers";
import { Box, Text } from "zmp-ui";
import { BodyTextProps } from "zmp-ui/text";

export const TextSkeleton: FC<HTMLProps<HTMLDivElement>> = ({
  className,
}) => {
  return (
    <div
      className={cx('bg-skeleton w-full h-6 animate-pulse rounded-md', className)}
    />
  );
};

export const ImageSkeleton: FC<HTMLProps<HTMLImageElement>> = ({
  className,
  ...props
}) => {
  return (
    <div
      {...props}
      className={cx('bg-skeleton animate-pulse', className)}
    />
  );
};

export const ProductItemSkeleton: FC = () => {
  return (
    <Box flex className="space-x-3 shadow-md h-28">
      <ImageSkeleton className="w-1/2 h-full aspect-square rounded-lg" />
      <Box className="space-y-3 w-full h-fit py-2">
        <TextSkeleton className="w-full" />
        <TextSkeleton />
        <TextSkeleton />
      </Box>
    </Box>
  );
};

export const ProductSlideSkeleton: FC = () => {
  return (
    <div className="space-y-3">
      <ImageSkeleton className="w-full aspect-video rounded-lg" />
      <Box className="space-y-1">
        <TextSkeleton />
        <TextSkeleton />
        <TextSkeleton />
      </Box>
    </div>
  );
};

export const ProductSearchResultSkeleton: FC = () => {
  return (
    <div className="flex items-center space-x-4">
      <ImageSkeleton className="w-[88px] h-[88px] rounded-lg" />
      <Box className="space-y-2">
        <TextSkeleton />
        <TextSkeleton />
      </Box>
    </div>
  );
};
