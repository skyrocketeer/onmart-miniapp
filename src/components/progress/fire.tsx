import React from 'react';
import { Box, Text } from 'zmp-ui';

const FireProgressBar = ({ progress }) => {
  return (
    <Box className="relative pt-1">
      <Box className="overflow-hidden h-8 mb-4 text-xs flex rounded-lg bg-slate-200 items-center justify-center">
        <Box className="absolute z-40 flex space-x-1 items-center">
          <Text size='xSmall'>Chỉ còn</Text>
          <Text className='text-lg text-red font-semibold'>{progress}</Text>
          <Text size='xSmall'>sản phẩm</Text>
        </Box>
        <Box className="absolute left-0 h-8 w-12 rounded-lg bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600" />
      </Box>
    </Box>
  )
};

export default FireProgressBar
