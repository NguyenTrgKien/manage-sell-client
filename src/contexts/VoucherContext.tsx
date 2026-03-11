import { createContext, useContext, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { getVouchers } from "../api/voucher.api";

interface VoucherContextType {
  hasVoucher: boolean;
}

export const VoucherContext = createContext<VoucherContextType>({
  hasVoucher: false,
});

export const useVoucherContext = () => useContext(VoucherContext);

function VoucherProvider({ children }: { children: ReactNode }) {
  const { data: dataVoucher, isLoading } = useQuery({
    queryKey: ["vouchers"],
    queryFn: getVouchers,
  });

  const hasVoucher = !isLoading && !!dataVoucher?.data?.length;

  return (
    <VoucherContext.Provider value={{ hasVoucher }}>
      {children}
    </VoucherContext.Provider>
  );
}

export default VoucherProvider;
