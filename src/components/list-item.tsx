import React, { FC, MouseEventHandler, ReactNode } from "react";
import cx from "utils/helpers";
import { Box, Icon, Text } from "zmp-ui";

export interface ListItemProps {
  title: ReactNode;
  subtitle: ReactNode;
  onClick?: MouseEventHandler<HTMLDivElement>;
  isDisabled?: boolean;
}

export const ListItem: FC<ListItemProps> = ({ title, subtitle, onClick, isDisabled }) => {
  return (
    <Box flex className="space-x-2" onClick={onClick}>
      <Box className="flex-1 space-y-[2px]">
        <Text size="small" className={cx("font-medium text-sm", isDisabled ? "text-slate-400" : "text-primary")}>
          {title}
        </Text>
        <Text size="xSmall" className="text-gray">
          {subtitle}
        </Text>
      </Box>
      <Icon icon="zi-chevron-right" />
    </Box>
  );
};
