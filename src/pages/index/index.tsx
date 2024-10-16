import { Divider } from "components/divider";
import { MainLayout } from "components/layout/layout-main";
import { SearchBar } from "components/top-search-bar";
import React, { Suspense } from "react";
import { Box } from "zmp-ui";
import { Banner } from "./banner";
import { Categories } from "./categories";
import { ProductList } from "./product-list";
import { Recommend } from "./recommend";
import { Welcome } from "./welcome";

const HomePage: React.FunctionComponent = () => {
  return (
    <MainLayout>
      <Welcome />
      <Box className="flex-1 overflow-auto">
        <SearchBar />
        <Banner />
        <Suspense>
          <Categories />
        </Suspense>
        <Divider />
        {/* <Recommend /> */}
        <Divider />
        <ProductList />
      </Box>
    </MainLayout>
  );
};

export default HomePage;
