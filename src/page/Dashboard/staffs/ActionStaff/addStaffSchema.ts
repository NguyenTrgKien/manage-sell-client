import { Gender, StaffPosition, UserRole } from "@nguyentrungkien/shared";
import * as yup from "yup";

export const addStaffSchema = (isEdit = false) =>
  yup
    .object({
      gender: yup
        .string()
        .oneOf(Object.values(Gender), "Giới tính không hợp lệ")
        .required("Vui lòng chọn giới tính"),
      user: yup.object().shape({
        username: yup.string().required("Tên đăng nhập là bắt buộc"),
        email: yup
          .string()
          .email("Email không hợp lệ")
          .required("Email là bắt buộc"),
        password: isEdit
          ? yup.string().notRequired()
          : yup
              .string()
              .min(6, "Mật khẩu phải từ 6 ký tự trở lên")
              .required("Mật khẩu là bắt buộc"),
        phone: yup
          .string()
          .matches(/^\d{10,15}$/, "Số điện thoại không hợp lệ")
          .required("Số điện thoại là bắt buộc"),
        role: yup
          .string()
          .oneOf(Object.values(UserRole), "Vai trò không hợp lệ")
          .required("Vai trò là bắt buộc"),
      }),
      birthday: yup
        .string()
        .required("Ngày sinh là bắt buộc")
        .test("is-valid-date", "Ngày sinh không hợp lệ", (value) => {
          if (!value) return false;
          const date = new Date(value);
          return date <= new Date();
        }),
      salary: yup
        .number()
        .typeError("Lương phải là số")
        .min(1, "Vui lòng thêm lương")
        .required("Lương là bắt buộc"),
      startDate: yup.string().required("Ngày bắt đầu là bắt buộc"),
      position: yup
        .string()
        .oneOf(Object.values(StaffPosition), "Vị trí không hợp lệ")
        .required("Vị trí là bắt buộc"),
      avatar: yup
        .mixed<File>()
        .optional() // Đổi thành optional
        .test("fileSize", "Dung lượng ảnh tối đa 10MB", (value) => {
          if (!value) return true;
          return (value as File).size <= 10 * 1024 * 1024;
        })
        .test(
          "fileType",
          "Chỉ chấp nhận định dạng .jpg, .jpeg, .png",
          (value) => {
            if (!value) return true;
            return ["image/jpeg", "image/png", "image/jpg"].includes(
              (value as File).type
            );
          }
        )
        .test("required-on-add", "Vui lòng chọn hình ảnh", function (value) {
          if (!isEdit && !value) {
            return false;
          }
          return true;
        }),
    })
    .required();
