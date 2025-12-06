export interface ProvinceType {
  code: number;
  codename: string;
  division_type: string;
  phone_code: number;
  name: string;
  districts: DistrictsType[];
}

export interface DistrictsType {
  code: number;
  codename: string;
  division_type: string;
  name: string;
  province_code: string;
  wards: WardsType[];
}

export interface WardsType {
  code: number;
  codename: string;
  division_type: string;
  short_codename: string;
  name: string;
}
