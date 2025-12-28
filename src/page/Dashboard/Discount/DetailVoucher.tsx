import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MotionWrapper from "../../../components/ui/MotionWrapper";
import {
  faXmark,
  faTicket,
  faCalendar,
  faPercent,
  faDollarSign,
  faGlobe,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";
import type { VoucherT } from "../../../utils/voucher.type";

interface DetailVoucherProp {
  open: boolean;
  onClose: () => void;
  dataDetail: VoucherT | null;
}

function DetailVoucher({ open, onClose, dataDetail }: DetailVoucherProp) {
  if (!dataDetail) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-700";
      case "INACTIVE":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "Đang hoạt động";
      case "INACTIVE":
        return "Ngừng hoạt động";
      default:
        return status;
    }
  };

  const getTypeText = (type: string) => {
    return type === "PERCENT" ? "Phần trăm" : "Số tiền cố định";
  };

  const InfoRow = ({
    icon,
    label,
    value,
  }: {
    icon: any;
    label: string;
    value: string | number;
  }) => (
    <div className="flex items-start gap-[1.5rem] py-[1.2rem] border-b border-gray-100 last:border-b-0">
      <div className="w-[2rem] flex justify-center mt-[0.2rem]">
        <FontAwesomeIcon icon={icon} className="text-blue-500 text-[1.4rem]" />
      </div>
      <div className="flex-1">
        <p className="text-[1.2rem] text-gray-500 mb-[0.3rem]">{label}</p>
        <p className="text-[1.5rem] text-gray-800 font-medium">{value}</p>
      </div>
    </div>
  );

  return (
    <MotionWrapper
      open={open}
      className="relative w-[60rem] max-h-[76vh] hide-scrollbar overflow-y-auto bg-white rounded-[1rem] shadow-xl px-[3rem] py-[2.5rem]"
    >
      <div
        className="absolute top-[1.5rem] right-[1.5rem] w-[3rem] h-[3rem] bg-gray-100 flex items-center justify-center rounded-full hover:bg-gray-200 cursor-pointer transition-colors"
        onClick={() => onClose()}
      >
        <FontAwesomeIcon icon={faXmark} className="text-gray-500" />
      </div>

      <div className="mb-[2rem]">
        <p className="text-[2rem] text-gray-800 font-semibold mb-[0.5rem]">
          Chi tiết voucher
        </p>
        <p className="text-[1.3rem] text-gray-500">
          Thông tin đầy đủ về voucher khuyến mãi
        </p>
      </div>

      <div className="shadow-md rounded-[1rem] p-[2rem] mb-[2rem]">
        <div className="flex items-center justify-between mb-[1rem]">
          <div className="flex items-center gap-[1rem]">
            <div className="w-[4rem] h-[4rem] bg-white rounded-full flex items-center justify-center shadow-sm">
              <FontAwesomeIcon
                icon={faTicket}
                className="text-blue-600 text-[2rem]"
              />
            </div>
            <div>
              <p className="text-[1.8rem] font-bold">{dataDetail.name}</p>
              <p className="text-[1.3rem] text-gray-600">
                Mã voucher: {dataDetail.voucherCode}
              </p>
            </div>
          </div>
          <span
            className={`px-[1.5rem] py-[0.6rem] rounded-full text-[1.2rem] font-semibold ${getStatusColor(dataDetail.status)}`}
          >
            {getStatusText(dataDetail.status)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-[2rem] mb-[2rem]">
        <div className="bg-blue-50 shadow-md rounded-[1rem] p-[2rem]">
          <div className="flex items-center gap-[1rem] mb-[1rem]">
            <FontAwesomeIcon
              icon={dataDetail.type === "PERCENT" ? faPercent : faDollarSign}
              className="text-blue-600 text-[1.8rem]"
            />
            <p className="text-[1.3rem] text-gray-600">Giá trị giảm</p>
          </div>
          <p className="text-[2.4rem] font-bold text-blue-600">
            {dataDetail.type === "PERCENT"
              ? `${dataDetail.value}%`
              : formatCurrency(dataDetail.value)}
          </p>
          <p className="text-[1.2rem] text-gray-500 mt-[0.5rem]">
            {getTypeText(dataDetail.type)}
          </p>
        </div>

        <div className="bg-purple-50 shadow-md rounded-[1rem] p-[2rem]">
          <div className="flex items-center gap-[1rem] mb-[1rem]">
            <FontAwesomeIcon
              icon={faChartLine}
              className="text-purple-600 text-[1.8rem]"
            />
            <p className="text-[1.3rem] text-gray-600">Sử dụng</p>
          </div>
          <p className="text-[2.4rem] font-bold text-purple-600">
            {dataDetail.usedCount}/{dataDetail.usageLimit}
          </p>
          <p className="text-[1.2rem] text-gray-500 mt-[0.5rem]">
            Còn lại: {dataDetail.usageLimit - dataDetail.usedCount}
          </p>
        </div>
      </div>

      <div className="bg-gray-50 shadow-md rounded-[1rem] p-[2rem] mb-[2rem]">
        <InfoRow
          icon={faDollarSign}
          label="Giá trị đơn hàng tối thiểu"
          value={formatCurrency(dataDetail.minOrderValue)}
        />
        <InfoRow
          icon={faDollarSign}
          label="Giảm tối đa"
          value={formatCurrency(dataDetail.maxDiscount)}
        />
        <InfoRow
          icon={faGlobe}
          label="Phạm vi áp dụng"
          value={dataDetail.isGlobal ? "Toàn bộ hệ thống" : "Giới hạn"}
        />
        <InfoRow
          icon={faCalendar}
          label="Ngày bắt đầu"
          value={formatDate(dataDetail.startDate)}
        />
        <InfoRow
          icon={faCalendar}
          label="Ngày kết thúc"
          value={formatDate(dataDetail.endDate)}
        />
      </div>

      <div className="bg-gray-50 shadow-md rounded-[1rem] p-[1.5rem] mb-[2rem]">
        <p className="text-gray-500 mb-[0.5rem]">Thời gian tạo</p>
        <p className="text-gray-700">{formatDate(dataDetail.createdAt)}</p>
        <p className="text-gray-500 mt-[1rem] mb-[0.5rem]">Cập nhật lần cuối</p>
        <p className="text-gray-700">{formatDate(dataDetail.updatedAt)}</p>
      </div>

      <div className="flex items-center justify-end gap-[1rem]">
        <button
          className="px-[2.5rem] py-[1rem] rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 text-[1.4rem] font-medium transition-colors"
          onClick={() => onClose()}
        >
          Đóng
        </button>
      </div>
    </MotionWrapper>
  );
}

export default DetailVoucher;
