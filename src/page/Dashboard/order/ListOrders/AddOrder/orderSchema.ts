import { PaymentMethod } from "@my-project/shared";
import * as yup from "yup";

export const orderSchema = yup
  .object({
    customerName: yup
      .string()
      .required("Vui lòng nhập tên khách hàng")
      .min(2, "Tên ít nhất phải có 2 kí tự"),
    customerEmail: yup
      .string()
      .required("Vui lòng nhập email khách hàng")
      .email("Email không hợp lệ"),
    customerPhone: yup
      .string()
      .required("Vui lòng nhập sđt khách hàng")
      .matches(/^(0|\+84)[3|5|7|8|9][0-9]{8}$/, "Số điện thoại không hợp lệ"),
    customerAddress: yup.string().required("Vui lòng nhập địa chỉ khách hàng"),
    customerProvince: yup.string().required("Vui lòng chọn tỉnh thành"),
    customerDistrict: yup.string().required("Vui lòng chọn huyện"),
    customerWard: yup.string().required("Chọn phường"),
    paymentMethod: yup
      .mixed<PaymentMethod>()
      .oneOf(
        Object.values(PaymentMethod),
        "Phương thức thanh toán không hợp lệ"
      )
      .required("Vui lòng chọn phương thức thanh toán"),
    customerNote: yup.string().optional().default(""),
    orderItems: yup
      .array()
      .of(
        yup.object({
          productId: yup.number().required(),
          variantId: yup.number().required(),
          quantity: yup.number().min(1, "Số lượng tối thiểu là 1").required(),
          price: yup.number().required(),
        })
      )
      .min(1, "Đơn hàng phải có ít nhất một sản phẩm")
      .optional()
      .required("Vui lòng thêm sản phẩm"),
    couponCode: yup.string().optional().default(""),
  })
  .required();
