import React, { FC } from "react";
import { Box, Input, useNavigate } from "zmp-ui";

export const SearchBar: FC = () => {
  const navigate = useNavigate();
  return (
    <Box p={4} className="bg-white">
      <Input.Search
        className="cus-input-search"
        onFocus={() => navigate("/search")}
        placeholder="Tìm sản phẩm..."
      />
    </Box>
  );
};
