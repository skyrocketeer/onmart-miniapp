import { Divider } from "components/divider";
import { MainLayout } from "components/layout/layout-main";
import React, { FC, Suspense } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { voucherData, voucherState } from "state";
import { Box, Header, Text } from "zmp-ui";
import logo from "static/logo.png";
import { BookmarkIcon } from "components/icon/bookmark";

const VoucherList = () => {
  const [selected, setSelected] = useRecoilState(voucherState)
  const voucherList = useRecoilValue(voucherData);

  const handleSelectVoucher = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, id: string): void => {
    setSelected({ ...selected, code: selected.code === id ? '' : id });
  }

  return (
    <Box className="space-y-6 m-4">
      {voucherList.map(voucher => (
        <Box key={voucher.id} flex className="items-center border border-slate-200 rounded-md shadow-md p-3 space-x-4">
          <img className="w-10 h-10 rounded-full" src={logo} />
          <Box className="space-y-1 w-full">
            <Text.Header>{voucher.code}</Text.Header>
            <Text
              size="small"
              className="text-gray"
            >
              {voucher.description}
            </Text>
          </Box>
          <Box role="button" onClick={(e) => handleSelectVoucher(e, voucher.id)}>
            <BookmarkIcon isActive={selected.code === voucher.id} />
          </Box>
        </Box>
      ))}
    </Box>
  )
};

const VoucherListSkeleton = () => {
  const arr = [...new Array(4)];
  return (
    <Box className="space-y-6 m-4">
      {arr.map((_, i) => (
        <div key={i}>
          <div className="w-full h-16 bg-skeleton aspect-square rounded-lg animate-pulse" />
        </div>
      ))}
    </Box>
  )
}

const VoucherPage: FC = () => {
  return (
    <MainLayout>
      <Header title="Mã khuyến mãi" showBackIcon={true} />
      <Divider />
      <Suspense fallback={<VoucherListSkeleton />}>
        <VoucherList />
      </Suspense>
    </MainLayout>
  );
};

export default VoucherPage;
