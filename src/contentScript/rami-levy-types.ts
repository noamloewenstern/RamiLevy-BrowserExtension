export interface RamiLevyCache {
  authuser: Authuser;
  cart: Cart;
  menu: Menu;
  filters: Filters;
  list: List;
  checkout: Checkout;
  checkoutMall: CheckoutMall;
  preferences: Preferences;
}

export interface Authuser {
  user: User;
  guestToken: null;
  shopLists: ShopList[];
}

export interface ShopList {
  id: number;
  uuid: string;
  name: string;
  updated_at: string;
  items_count: number;
  items: number[];
  images: string[];
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  token: string;
  user_id: string;
  meta: null;
  store_id: string;
  locale: null;
  identity_card: string;
  accounting_card_id: null;
  business: number;
  birth_date: string;
  phone: string;
  additional_phone: string;
  sex_id: number;
  edit_order: null;
  send_email: number;
  send_sms: number;
  subscribe_at: string;
  subscribe_ip: string;
  club_accept_at: string;
  club_accept_ip: string;
  club_accept: number;
  send_club_database: number;
  disabled_at: null;
  activated_at: null;
  deleted_at: null;
  area_id: number;
  deactivated_at: null;
  customer_id_club: number;
  name: string;
  orders: Order[];
  cards: Cards;
  addresses: Addresses;
  popularProducts: string;
  features: any[];
  coupons: Coupons;
}

export interface Addresses {
  '495506': The495506;
}

export interface The495506 {
  id: number;
  apartment: string;
  area: null;
  area_id: null;
  city: string;
  city_id: number;
  default: number;
  entrance: null;
  floor: string;
  name: string;
  store_id: null;
  street: string;
  street_id: number;
  street_number: string;
  zip: string;
}

export interface Cards {
  '888757': The888757;
}

export interface The888757 {
  id: number;
  token: string;
  expiration_month: string;
  expiration_year: string;
  last_digits: string;
  card_type: string;
  is_club: number;
  is_direct: number;
}

export interface Coupons {
  id: number;
  first_name: string;
  last_name: string;
  identity_number: string;
  birthday: string;
  channels: Channel[];
  coupons: any[];
  default_print: DefaultPrint;
  wallet: Wallet;
}

export interface Channel {
  id: number;
  name: string;
}

export interface DefaultPrint {
  action: string;
  type: string;
  value: string;
}

export interface Wallet {
  phone: string;
  is_rami_levy_card: boolean;
  channel_id: number;
}

export interface Order {
  id: number;
  final_price: number;
  supply_at: string;
  from_hour: string;
  to_hour: string;
  created_at: string;
  site_id: number;
  supply: Supply;
}

export interface Supply {
  id: number;
  order_id: number;
  area_id: number;
  area: null;
  city_id: number;
  city: string;
  street_id: number;
  street: string;
  street_number: string;
  structure_id: null;
  apartment: number;
  entrance: null;
  floor: number;
  elevator: null;
  default: null;
  self_pick_up: null;
  name: string;
  zip: number;
  created_at: string;
  updated_at: string;
  is_old_order: number;
}

export interface Cart {
  items: Item[];
  itemsPreference: ItemsPreference;
  price: number;
  priceMall: number;
  priceInfo: PriceInfo;
  priceInfoMall: PriceInfo;
  storeIdMall: null;
  areaIdMall: null;
  loadingCart: boolean;
  loadingCartMall: boolean;
  storeId: string;
  areaId: string;
  source: null;
  showModalAddAddress: boolean;
  showModalDeliveryArea: boolean;
  myFeatures: any[];
}

export interface Item {
  kashrut?: ItemKashrut;
  full_desc?: string;
  features?: any[];
  price: Price;
  prop?: Prop;
  id: number;
  multiplication?: number;
  department?: Department | null;
  barcode?: number;
  slug?: string;
  group?: Department | null;
  recipes?: Recipe[];
  images?: Images;
  department_id?: number | null;
  subGroup?: Department | null;
  exceptionDays?: any[];
  preference?: any[];
  kashruts?: number[];
  available_in?: number[];
  gs?: Gs;
  sale?: Sale[];
  mainImage?: number;
  group_id?: number | null;
  name: string;
  site_id: number;
  sub_group_id?: number | null;
  short_desc?: string;
  lables?: Lable[];
  properties?: Property[];
  is360?: number;
  shortName?: string;
  src?: Images;
  url?: URL;
  amount: number;
  checkAvailable?: boolean;
  isAvailable: boolean;
  finalCart: FinalCart | null;
  sumPrice: number;
  finalPrice: number;
  is_delivery?: boolean;
  contentTitle?: string;
  showCheapest?: boolean;
}

export interface Department {
  name: string;
  id: number;
  sort: number;
  slug: string;
}

export interface FinalCart {
  countUsesSale: CountUsesSale;
  FormatedSavePrice: number;
  FormatedTotalPrice: number;
  FormatedSavePriceClub: number;
  FormatedSavePriceWallet: number;
  FormatedTotalPriceClub: number;
  FormatedTotalPriceWallet: number;
  FormatedTotalPriceWithoutDiscount: number;
  finalPriceClub: number;
  finalPriceWallet: number;
  PromotionId: number[] | null;
  PromotionIdClub: null;
  department_id?: number | null;
  group_id?: number | null;
  site_id: number;
  id: number;
  name: string;
  price: number;
  quantity: number;
  sub_group_id?: number | null;
  is_delivery: boolean;
  isClub: boolean;
  isWallet: boolean;
}

export interface CountUsesSale {
  '542696'?: number;
}

export interface Gs {
  Ingredient_Sequence_and_Name: string;
  Product_Dimensions: ProductDimensions | null;
  Contains_Sulfur_Dioxide: null;
  Alcohol_Percentage_in_Product: null;
  BrandName: string;
  Product_Description_English: string;
  Country_of_Origin: null | string;
  Fat_Percentage_in_Product: null;
  Allergen_Type_Code_and_Containment_May_Contain: number[];
  pH: null;
  Serving_Size_Description: ServingSizeDescription;
  litzman: boolean | string;
  Food_Symbol_Red: FoodSymbolRed[] | null;
  Allergen_Type_Code_and_Containment: number[];
  Color_Number: null;
  Search_Tags: string[];
  internal_product_description: string;
  Color: null;
  Diet_Information: number[];
  Nutritional_Values: NutritionalValue[];
  Fruit_Percentage_in_Product: null;
  Serving_Suggestion: string;
  Forbidden_Under_the_Age_of_18: null;
  name: string;
  Hazard_Precautionary_Statement: string;
  short_name: string;
  Consumer_Storage_Instructions: string;
  Net_Content: NetContent | null;
  Healthy_Product: string;
  Cream_Percentage_in_Product: null;
}

export interface FoodSymbolRed {
  code: Code;
  value: Value;
}

export enum Code {
  Fsr1 = 'FSR1',
  Fsr2 = 'FSR2',
  Fsr4 = 'FSR4',
  Fsr5 = 'FSR5',
}

export enum Value {
  ללאסימון = 'ללא סימון',
  נתרןבכמותגבוהה = 'נתרן בכמות גבוהה',
  סמלירוק = 'סמל ירוק',
  שומןרוויבכמותגבוהה = 'שומן רווי בכמות גבוהה',
}

export interface NetContent {
  UOM: NetContentUOM | null;
  text: string;
  value: string;
  display?: string;
}

export enum NetContentUOM {
  גרם = 'גרם',
  יחידות = 'יחידות',
  ליטר = 'ליטר',
  מל = 'מל',
  ממ = 'ממ',
  סמ = 'סמ',
  קג = 'קג',
}

export interface NutritionalValue {
  code: string;
  label: string;
  fields: Field[];
}

export interface Field {
  col_code: string;
  field_id: string;
  col_field_id: string;
  UOM: FieldUOM;
  col_label: ColLabel;
  text: string;
  value: string;
  field_name: string;
}

export enum FieldUOM {
  Empty = '',
  גרם = 'גרם',
  מג = 'מג',
  קלוריות = 'קלוריות',
}

export enum ColLabel {
  ל100גרם = 'ל-100 גרם',
  ל100גרםמוצרלפניבישול = 'ל-100 גרם מוצר לפני בישול',
  ל100גרםמוצרמבושל = 'ל-100 גרם מוצר מבושל',
  ל100גרםתבשילמוכן = 'ל-100 גרם תבשיל מוכן',
  ל100מל = 'ל-100 מל',
}

export interface ProductDimensions {
  Product_Gross_Weight?: NetContent;
  Net_Weight?: NetContent;
  Product_Height: NetContent;
  Price_Comparison_Content: NetContent[] | NetContent;
  Product_Width: NetContent;
  Product_Depth: NetContent;
}

export enum ServingSizeDescription {
  Empty = '',
  The5קג = '5 ק"ג',
  ללא = '* ללא',
  שקיק35 = 'שקיק= 3.5',
}

export interface Images {
  small: string;
  original: string;
  trim: string;
  transparent: string;
  gallery?: any[];
}

export interface ItemKashrut {
  Kosher_for_Passover_Remark: string;
  Board_of_Supervision: number[];
  Cooking_Israel: number[];
  Kosher_Supervision_Type: number[];
  Kosher_for_Passover: number[];
  Rabbinate: number[];
  Israel_Milk: number[];
  Sheviit_Orlah_Tevel: number[];
}

export interface Lable {
  image: string;
  name: string;
  id: number;
}

export interface Price {
  price: number;
  finalPrice?: number;
  saleOldPrice?: number;
  saved?: number;
}

export interface Prop {
  unit: number | null;
  sw_shakil: number;
  by_kilo: number;
  by_kilo_content: number;
  status: number;
}

export interface Property {
  item_id: number;
  property_parent_id: number;
  id: number;
  sort: null;
  property_parent_name: string;
  value: null;
  property_id: number;
  property_name: string;
}

export interface Recipe {
  video_url: string;
  image_url: string;
  name: string;
  sort_order: number;
  content: string;
}

export interface Sale {
  code: number;
  sw_kefel: number;
  k_cmt: null;
  deleted_by: null | string;
  k_acz_dis: null;
  active: number;
  created_at: string;
  cmt: number;
  label: string;
  type: number;
  is_wallet: number;
  deleted_at: null;
  max_in_doc: null;
  is_personal: number;
  updated_at: string;
  approved_at: null;
  name: string;
  k_scm: null;
  from: string;
  id: number;
  to: string;
  scm: number;
  pending_approval: number;
  is_club: number;
  showCheapest: boolean;
  site_id: number;
  subtitle: string;
  title: string;
}

export interface URL {
  siteUrl: string;
  siteName: SiteName;
  subGroupUrl: string;
  productUrl: string;
}

export enum SiteName {
  קניותאונליין = 'קניות אונליין',
}

export interface ItemsPreference {}

export interface PriceInfo {
  priceClub: number;
  priceWallet: number;
  discount: number;
  discountClub: number;
  discountWallet: number;
  finalPrice: number;
}

export interface Checkout {
  isChangeDetailsOrder: boolean;
  notes: CheckoutNotes;
  address: CheckoutAddress;
  payment: Payment;
  loadingSupplies: boolean;
  loadingDelivery: boolean;
  upDetailsModal: boolean;
}

export interface CheckoutAddress {
  addressSelect: number;
  supplyDay: null;
}

export interface CheckoutNotes {
  selectedDeliveryPerson: string;
  selectedShipping: string;
  nameOrder: null;
  fullName: string;
  phone: string;
  pelefon: null;
}

export interface Payment {
  tokenList?: any[];
  paymentCardSelect: null;
  selectClubCard: null;
  typePayment: null | string;
  numberPaymentsSelect: number;
  askCustomerClub: number;
}

export interface CheckoutMall {
  notes: CheckoutMallNotes;
  address: CheckoutMallAddress;
  payment: Payment;
  loadingSupplies: boolean;
  loadingDelivery: boolean;
  upDetailsModal: boolean;
}

export interface CheckoutMallAddress {
  addressSelect: null;
  detailsAddress: null;
}

export interface CheckoutMallNotes {
  fullName: string;
  phone: null;
  pelefon: null;
}

export interface Filters {
  kosherPesach: boolean;
  mehadrin: boolean;
  kashruts: KashrutElement[];
}

export interface KashrutElement {
  id: number;
  name: string;
  is_leading: number;
  media_url: null | string;
  value: boolean;
  sort: number;
}

export interface List {
  buy: any[];
}

export interface Menu {
  data: Datum[];
  slugs: Slugs;
}

export interface Datum {
  id?: number;
  department_id?: number;
  name?: string;
  title?: string;
  slug?: string;
  site_id?: number | null;
  sort?: number;
  icon?: null | string;
  created_at?: null;
  updated_at?: string;
  deleted_at?: null;
  d_id?: number;
  count?: number;
  items?: Group[];
}

export interface Group {
  g_id?: number;
  id?: number;
  group_id?: number;
  department_id?: number | null;
  name?: string;
  title?: string;
  slug?: string;
  img?: Img | null;
  type_group?: TypeGroup;
  link?: null;
  link_type?: null;
  sort?: number;
  count_col?: number;
  created_at?: null;
  updated_at?: string;
  deleted_at?: null;
  count?: number;
  items?: SubGroup[];
}

export enum Img {
  Null = 'null',
}

export interface SubGroup {
  sg_id?: number;
  id?: number;
  sub_group_id?: number;
  group_id?: number | null;
  name?: string;
  title?: string;
  slug?: string;
  sort?: number;
  created_at?: null;
  updated_at?: string;
  deleted_at?: null;
  count?: number;
}

export enum TypeGroup {
  MenuGroup = 'menuGroup',
}

export interface Slugs {
  sites: Sites;
  departments: { [key: string]: Datum };
  groups: { [key: string]: Group };
  subGroups: { [key: string]: SubGroup };
}

export interface Sites {
  '': Empty;
}

export interface Empty {
  id: number;
  name: string;
  created_at: null;
  updated_at: null;
}

export interface Preferences {
  display: string;
  isMiniCart: boolean;
  isShowPopupBegin: boolean;
}
