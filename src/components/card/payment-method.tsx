import { CreditCardIcon } from 'components/icon/credit-card';
import { HandMoneyIcon } from 'components/icon/hand-money';
import React, { FC } from 'react';
import MomoLogo from 'static/momo_square_pinkbg.svg';
import ZaloPayLogo from 'static/zalopay-logo.png';
import cx from 'utils/helpers';

export enum PAYMENT_OPTION {
  "ZALOPAY" = "ZALOPAY",
  "MOMO" = "MOMO",
  "CREDIT_CARD" = "CREDIT_CARD",
  "BANK_TRANSFER" = "BANK_TRANSFER",
  "COD" = "COD"
}

const PaymentCard = ({ method, text, isActive }: { method?: PAYMENT_OPTION, text: string, isActive: boolean }) => {
  const renderLogo: FC = (method: PAYMENT_OPTION | '') => {
    switch (method) {
      case PAYMENT_OPTION.CREDIT_CARD:
        return (<CreditCardIcon isActive={isActive} />)
      case PAYMENT_OPTION.ZALOPAY:
        return (<img src={ZaloPayLogo} width='24px' />)
      case PAYMENT_OPTION.MOMO:
        return (<img src={MomoLogo} width='24px' />)
      case PAYMENT_OPTION.COD:
      default:
        return (<HandMoneyIcon isActive={isActive} />)
    }
  }

  return (
    <div className="flex items-center gap-3">
      {renderLogo(method || '')}
      <p className={cx(
        isActive ? "text-primary" : "text-slate-400",
        "font-light"
      )}>
        {text}
      </p>
    </div>
  );
};

export default PaymentCard;
