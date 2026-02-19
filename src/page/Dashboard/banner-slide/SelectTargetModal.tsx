import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faClose,
  faCheck,
  faChevronRight,
  faChevronLeft,
  faBox,
  faTag,
} from "@fortawesome/free-solid-svg-icons";
import { useQuery } from "@tanstack/react-query";
import { BannerRedirectType } from "../../../utils/ui.type";
import { getProduct } from "../../../api/product.api";
import { getAllCategory } from "../../../api/category.api";
import type { ProductT } from "../../../utils/types";
import MotionWrapper from "../../../components/ui/MotionWrapper";

export interface TargetItem {
  slug: string;
  name: string;
  img?: string;
}

interface RawCategory {
  id: number;
  categoryName: string;
  slug: string;
  image?: string;
  parentId: number | null;
  children: RawCategory[];
  isActive: boolean;
}

interface SelectTargetModalProps {
  open: boolean;
  redirectType: BannerRedirectType;
  selectedSlug?: string;
  selectType: "product" | "category";
  onSelect: (item: TargetItem) => void;
  onClose: () => void;
}

const LIMIT = 12;

const TYPE_CONFIG = {
  product: {
    title: "Chọn sản phẩm",
    icon: faBox,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-50",
    searchPlaceholder: "Tìm kiếm sản phẩm theo tên...",
    emptyText: "Không tìm thấy sản phẩm nào",
    badgeClass: "bg-blue-50 text-blue-600 border-blue-200",
  },
  category: {
    title: "Chọn danh mục",
    icon: faTag,
    iconColor: "text-orange-500",
    iconBg: "bg-orange-50",
    searchPlaceholder: "Tìm kiếm danh mục...",
    emptyText: "Không tìm thấy danh mục nào",
    badgeClass: "bg-orange-50 text-orange-600 border-orange-200",
  },
};

async function fetchProducts(): Promise<{ data: TargetItem[]; total: number }> {
  const res = (await getProduct({
    queryKey: ["product", { page: 1, limit: 1000 }],
  })) as any;

  return {
    data: (res.data ?? []).map((p: ProductT) => ({
      slug: p.slug,
      name: p.productName,
      img: p.mainImage,
    })),
    total: res.total ?? 0,
  };
}

async function fetchCategories() {
  const res = await getAllCategory();

  const flatten = (cats: RawCategory[]): TargetItem[] =>
    cats.flatMap((c) => [
      { slug: c.slug, name: c.categoryName, img: c.image },
      ...(c.children?.length ? flatten(c.children) : []),
    ]);

  const flat = flatten(res);
  return { data: flat, total: flat.length, rawData: res };
}

function CategoryGroup({
  parent,
  selectedSlug,
  onSelect,
}: {
  parent: RawCategory;
  selectedSlug?: string;
  onSelect: (item: TargetItem) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const isParentSelected = parent.slug === selectedSlug;
  const hasChildren = parent.children?.length > 0;

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <div
        className={`flex items-center gap-3 px-[1.5rem] py-[1.2rem] ${
          isParentSelected ? "bg-cyan-50" : "bg-gray-50"
        }`}
      >
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className={`w-[2.4rem] h-[2.4rem] flex items-center justify-center rounded-md transition flex-shrink-0 ${
            hasChildren
              ? "text-gray-400 hover:text-gray-600 hover:bg-gray-200"
              : "invisible"
          }`}
        >
          <FontAwesomeIcon
            icon={faChevronRight}
            className={`text-[1.1rem] transition-transform duration-200 ${
              expanded ? "rotate-90" : ""
            }`}
          />
        </button>

        <button
          type="button"
          onClick={() =>
            onSelect({
              slug: parent.slug,
              name: parent.categoryName,
              img: parent.image,
            })
          }
          className="flex items-center gap-[1rem] flex-1 text-left rounded-lg transition"
        >
          {parent.image ? (
            <img
              src={parent.image}
              alt={parent.categoryName}
              className="w-[4rem] h-[4rem] object-cover rounded-lg flex-shrink-0"
            />
          ) : (
            <div className="w-[4rem] h-[4rem] rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
              <FontAwesomeIcon icon={faTag} className="text-gray-400" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p
              className={`text-[1.4rem] font-semibold truncate ${
                isParentSelected ? "text-cyan-600" : "text-gray-800"
              }`}
            >
              {parent.categoryName}
            </p>
            {hasChildren && (
              <p className="text-[1.2rem] text-gray-400">
                {parent.children.length} danh mục con
              </p>
            )}
          </div>
          {isParentSelected && (
            <div className="w-[2.4rem] h-[2.4rem] rounded-full bg-cyan-500 flex items-center justify-center flex-shrink-0 mr-2">
              <FontAwesomeIcon
                icon={faCheck}
                className="text-white text-[1.2rem]"
              />
            </div>
          )}
        </button>
      </div>

      {expanded &&
        hasChildren &&
        parent.children.map((child) => {
          const isChildSelected = child.slug === selectedSlug;
          return (
            <button
              key={child.slug}
              type="button"
              onClick={() =>
                onSelect({
                  slug: child.slug,
                  name: child.categoryName,
                  img: child.image,
                })
              }
              className={`w-full flex items-center gap-[1rem] pl-[6rem] pr-[1.5rem] py-[1rem] border-t border-gray-100 transition ${
                isChildSelected ? "bg-cyan-50" : "bg-white hover:bg-gray-50"
              }`}
            >
              {child.image ? (
                <img
                  src={child.image}
                  alt={child.categoryName}
                  className="w-[3.5rem] h-[3.5rem] object-cover rounded-lg flex-shrink-0"
                />
              ) : (
                <div className="w-[3.5rem] h-[3.5rem] rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon
                    icon={faTag}
                    className="text-gray-300 text-[1.2rem]"
                  />
                </div>
              )}
              <span
                className={`text-[1.3rem] flex-1 text-left truncate ${
                  isChildSelected
                    ? "text-cyan-600 font-medium"
                    : "text-gray-600"
                }`}
              >
                {child.categoryName}
              </span>

              <span className="text-[1.1rem] px-2 py-0.5 rounded-full border bg-orange-50 text-orange-600 border-orange-200 font-medium flex-shrink-0">
                {child.slug}
              </span>

              {isChildSelected && (
                <div className="w-[2.4rem] h-[2.4rem] rounded-full bg-cyan-500 flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon
                    icon={faCheck}
                    className="text-white text-[1.2rem]"
                  />
                </div>
              )}
            </button>
          );
        })}
    </div>
  );
}

export default function SelectTargetModal({
  open,
  selectedSlug,
  selectType,
  onSelect,
  onClose,
}: SelectTargetModalProps) {
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [page, setPage] = useState(1);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const config = TYPE_CONFIG[selectType];

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedKeyword(keyword);
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [keyword]);

  useEffect(() => {
    if (open) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      setKeyword("");
      setDebouncedKeyword("");
      setPage(1);
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["select-target-modal", selectType, debouncedKeyword, page],
    queryFn: () =>
      selectType === "product" ? fetchProducts() : fetchCategories(),
    enabled: open,
    placeholderData: (prev) => prev,
  });

  const items: TargetItem[] = data?.data ?? [];
  const rawCategories: RawCategory[] = (data as any)?.rawData ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / LIMIT);

  const filteredItems = debouncedKeyword
    ? items.filter((i) =>
        i.name.toLowerCase().includes(debouncedKeyword.toLowerCase()),
      )
    : items;

  const filteredRawCategories = debouncedKeyword
    ? rawCategories
        .map((parent) => ({
          ...parent,
          children: parent.children.filter((c) =>
            c.categoryName
              .toLowerCase()
              .includes(debouncedKeyword.toLowerCase()),
          ),
        }))
        .filter(
          (parent) =>
            parent.categoryName
              .toLowerCase()
              .includes(debouncedKeyword.toLowerCase()) ||
            parent.children.length > 0,
        )
    : rawCategories;

  const pagedProducts = filteredItems.slice((page - 1) * LIMIT, page * LIMIT);
  const productTotalPages = Math.ceil(filteredItems.length / LIMIT);

  return (
    <MotionWrapper
      className="relative w-[80%] md:w-[65%] h-auto bg-white space-y-[1.5rem] rounded-[1rem] shadow-xl p-[2rem]"
      open={open}
    >
      <div className="flex items-center gap-[1rem]">
        <div
          className={`w-[4rem] h-[4rem] rounded-xl flex items-center justify-center ${config.iconBg}`}
        >
          <FontAwesomeIcon
            icon={config.icon}
            className={`text-[1.8rem] ${config.iconColor}`}
          />
        </div>
        <div>
          <h2 className="text-[1.8rem] font-bold text-gray-800">
            {config.title}
          </h2>
          {total > 0 && (
            <p className="text-[1.2rem] text-gray-400 mt-0.5">
              {total} kết quả
              {debouncedKeyword ? ` cho "${debouncedKeyword}"` : ""}
            </p>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="absolute top-[1rem] right-[1rem] w-[3.5rem] h-[3.5rem] rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
      >
        <FontAwesomeIcon icon={faClose} className="text-[1.8rem]" />
      </button>

      <div className="relative">
        <FontAwesomeIcon
          icon={faSearch}
          className="absolute left-[1.5rem] top-1/2 -translate-y-1/2 text-gray-400 text-[1.4rem]"
        />
        <input
          ref={searchInputRef}
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder={config.searchPlaceholder}
          className="w-full h-[4.5rem] pl-[4.5rem] pr-[4rem] border border-gray-200 rounded-xl text-gray-700 text-[1.4rem] outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 bg-white transition"
        />
        {keyword && (
          <button
            type="button"
            onClick={() => setKeyword("")}
            className="absolute right-[1.5rem] top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <FontAwesomeIcon icon={faClose} />
          </button>
        )}
      </div>

      <div
        className={`overflow-y-auto max-h-[50rem] transition-opacity ${
          isFetching ? "opacity-60 pointer-events-none" : ""
        }`}
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[30rem] gap-4">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-cyan-500 rounded-full animate-spin" />
            <p className="text-gray-400 text-[1.4rem]">Đang tải...</p>
          </div>
        ) : selectType === "category" ? (
          filteredRawCategories.length === 0 ? (
            <EmptyState config={config} keyword={debouncedKeyword} />
          ) : (
            <div className="space-y-[1rem]">
              {filteredRawCategories.map((parent) => (
                <CategoryGroup
                  key={parent.slug}
                  parent={parent}
                  selectedSlug={selectedSlug}
                  onSelect={(item) => {
                    onSelect(item);
                    onClose();
                  }}
                />
              ))}
            </div>
          )
        ) : pagedProducts.length === 0 ? (
          <EmptyState config={config} keyword={debouncedKeyword} />
        ) : (
          <div className="grid grid-cols-5 gap-[1.5rem]">
            {pagedProducts.map((item) => {
              const isSelected = item.slug === selectedSlug;

              return (
                <div
                  key={item.slug}
                  onClick={() => {
                    onSelect(item);
                    onClose();
                  }}
                  className={`relative group rounded-xl border-2 text-left transition-all duration-200 ${
                    isSelected
                      ? "border-blue-400 shadow-lg shadow-blue-100"
                      : "border-gray-100 hover:border-blue-300 hover:shadow-md"
                  }`}
                >
                  <div className="relative w-full bg-gray-100 overflow-hidden">
                    {item.img ? (
                      <img
                        src={item.img}
                        alt={item.name}
                        className="w-full h-[18rem] object-cover"
                      />
                    ) : (
                      <div className="w-full h-[18rem] flex items-center justify-center">
                        <FontAwesomeIcon
                          icon={faBox}
                          className="text-[3.5rem] text-gray-300"
                        />
                      </div>
                    )}
                    {isSelected && (
                      <div className="absolute inset-0 bg-gray-500/20 flex items-center justify-center">
                        <div className="w-[3.5rem] h-[3.5rem] rounded-full bg-blue-500 flex items-center justify-center shadow-lg">
                          <FontAwesomeIcon
                            icon={faCheck}
                            className="text-white text-[1.6rem]"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-2.5">
                    <p
                      className={`text-[1.3rem] leading-tight line-clamp-2 ${
                        isSelected
                          ? "text-blue-700 font-semibold"
                          : "text-gray-800"
                      }`}
                    >
                      {item.name}
                    </p>
                    <div className="mt-[.8rem]">
                      <span className="text-[1rem] px-2 py-0.5 rounded-full border font-medium bg-blue-50 text-blue-600 border-blue-200">
                        {item.slug}
                      </span>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="absolute top-[.8rem] right-[.8rem]">
                      <span className="bg-blue-500 text-white text-[1rem] px-2 py-0.5 rounded-full font-semibold shadow">
                        Đã chọn
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectType === "product" && productTotalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-100 pt-[1.5rem]">
          <p className="text-[1.3rem] text-gray-500">
            Trang {page}/{productTotalPages} · {filteredItems.length} sản phẩm
          </p>
          <div className="flex items-center gap-[.8rem]">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="w-[3.5rem] h-[3.5rem] rounded-lg flex items-center justify-center border border-gray-200 text-gray-600 hover:border-cyan-400 hover:text-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            {Array.from({ length: Math.min(5, productTotalPages) }, (_, i) => {
              let p: number;
              if (productTotalPages <= 5) p = i + 1;
              else if (page <= 3) p = i + 1;
              else if (page >= productTotalPages - 2)
                p = productTotalPages - 4 + i;
              else p = page - 2 + i;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPage(p)}
                  className={`w-[3.5rem] h-[3.5rem] rounded-lg flex items-center justify-center text-[1.3rem] font-medium transition ${
                    page === p
                      ? "bg-cyan-500 text-white shadow-sm"
                      : "border border-gray-200 text-gray-600 hover:border-cyan-400 hover:text-cyan-500"
                  }`}
                >
                  {p}
                </button>
              );
            })}
            <button
              type="button"
              disabled={page >= productTotalPages}
              onClick={() => setPage((p) => p + 1)}
              className="w-[3.5rem] h-[3.5rem] rounded-lg flex items-center justify-center border border-gray-200 text-gray-600 hover:border-cyan-400 hover:text-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-end border-t border-gray-100 pt-[1.5rem]">
        <button
          type="button"
          onClick={onClose}
          className="px-[2.5rem] py-[.9rem] rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 text-[1.4rem] font-medium transition"
        >
          Đóng
        </button>
      </div>
    </MotionWrapper>
  );
}

function EmptyState({
  config,
  keyword,
}: {
  config: (typeof TYPE_CONFIG)["product" | "category"];
  keyword: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-[25rem] gap-3">
      <div className="w-[7rem] h-[7rem] rounded-full bg-gray-100 flex items-center justify-center">
        <FontAwesomeIcon
          icon={config.icon}
          className="text-[3rem] text-gray-300"
        />
      </div>
      <p className="text-gray-500 text-[1.5rem] font-medium">
        {config.emptyText}
      </p>
      {keyword && (
        <p className="text-gray-400 text-[1.3rem]">
          Thử tìm kiếm với từ khóa khác
        </p>
      )}
    </div>
  );
}
