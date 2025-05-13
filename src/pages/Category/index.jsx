import React, { useEffect, useState, useMemo, useCallback } from "react";
import styles from "./CategoryPage.module.scss";
import ProductCard from "../../components/ProductCard/index";
import { TiTick } from "react-icons/ti";
import BrandSidebar from "../../components/BrandsSidebar/index";
import FilterSidebar from "../../components/FilterSideBar/index";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  useParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import {
  useGetCategoriesQuery,
  useGetAllCategoryProductsQuery,
  useGetCategoryProductsQuery,
  useLazyGetAllCategoryProductsPaginatedQuery,
} from "../../app/api/categories";
import {
  useGetCollectionByIdQuery,
  useGetCollectionProductsQuery,
  useLazyGetCollectionProductsPaginatedQuery,
} from "../../app/api/collectionsApi";
import {
  useGetBrandProductsQuery,
  useLazyGetBrandProductsQuery,
} from "../../app/api/brandsApi";
import Loader from "../../components/Loader/index";
import { Result, Button } from "antd";

const CategoryPage = () => {
  const { t } = useTranslation();
  const { categoryId, collectionId, brandId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Get categories data
  const { data: categoriesData } = useGetCategoriesQuery("tree");
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Track if the category has subcategories to display
  const [hasSubcategories, setHasSubcategories] = useState(false);
  const [subcategoriesToShow, setSubcategoriesToShow] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [allProducts, setAllProducts] = useState([]);

  // Price sorting state
  const [priceSort, setPriceSort] = useState("none");

  // Search related data
  const searchResults = location.state?.searchData?.data || [];
  const searchQuery = location.state?.searchQuery || null;

  // Determine if category is a subcategory
  const isSubCategory = useMemo(() => {
    if (!categoriesData?.data || !categoryId) return false;

    const checkIsSubCategory = (categories, targetId) => {
      for (const category of categories) {
        if (category.children) {
          for (const subCategory of category.children) {
            if (subCategory.id === parseInt(targetId)) {
              return true;
            }

            // Check deeper nested levels
            if (subCategory.children) {
              const foundInNested = checkIsSubCategory([subCategory], targetId);
              if (foundInNested) return true;
            }
          }
        }
      }
      return false;
    };

    return checkIsSubCategory(categoriesData.data, parseInt(categoryId));
  }, [categoriesData, categoryId]);

  // Original query for first page data - only run on first page load
  const {
    data: categoryProducts = [],
    error: categoryError,
    isLoading: categoryLoading,
  } = useGetAllCategoryProductsQuery(selectedCategory, {
    skip: !selectedCategory || !categoryId || !isSubCategory || currentPage > 1,
  });

  // New lazy query for subcategory pagination
  const [
    fetchSubcategoryProducts,
    {
      data: paginatedSubcategoryProducts,
      isLoading: subcategoryProductsLoading,
    },
  ] = useLazyGetAllCategoryProductsPaginatedQuery();

  // Paginated category products query
  const {
    data: paginatedCategoryProducts,
    isLoading: paginatedCategoryLoading,
    isFetching: paginatedCategoryFetching,
  } = useGetCategoryProductsQuery(
    { categoryId, page: currentPage },
    { skip: !categoryId || isSubCategory || searchQuery }
  );

  // Brand products with lazy loading for pagination
  const [
    fetchBrandProducts,
    { data: paginatedBrandProducts, isLoading: brandProductsFetching },
  ] = useLazyGetBrandProductsQuery();

  // Regular brand products query for initial data
  const {
    data: brandProducts = [],
    isLoading: brandProductsLoading,
    error: brandProductsError,
  } = useGetBrandProductsQuery(brandId, {
    skip: !brandId || currentPage > 1,
  });

  // Collection data
  const {
    data: collectionData,
    error: collectionError,
    isLoading: collectionLoading,
  } = useGetCollectionByIdQuery(collectionId, {
    skip: !collectionId,
  });

  // New paginated collection products (lazy query)
  const [
    fetchCollectionProducts,
    {
      data: paginatedCollectionProducts,
      isLoading: paginatedCollectionLoading,
    },
  ] = useLazyGetCollectionProductsPaginatedQuery();

  // Original collection products query for first page data
  const {
    data: collectionProducts = { data: [] },
    error: collectionProductsError,
    isLoading: collectionProductsLoading,
  } = useGetCollectionProductsQuery(collectionId, {
    skip: !collectionId || currentPage > 1,
  });

  // Load subcategory products when page changes
  useEffect(() => {
    if (categoryId && isSubCategory && selectedCategory && currentPage > 1) {
      fetchSubcategoryProducts({
        category: selectedCategory,
        page: currentPage,
        limit: 6,
      });
    }
  }, [
    categoryId,
    isSubCategory,
    selectedCategory,
    currentPage,
    fetchSubcategoryProducts,
  ]);

  // Fetch collection products when page changes
  useEffect(() => {
    if (collectionId && currentPage > 1) {
      fetchCollectionProducts({
        collectionId,
        page: currentPage,
        limit: 6,
      });
    }
  }, [collectionId, currentPage, fetchCollectionProducts]);

  // Fetch more brand products when page changes
  useEffect(() => {
    if (brandId && currentPage > 1) {
      fetchBrandProducts({
        type: undefined,
        page: currentPage,
        limit: 6,
        id: brandId,
      });
    }
  }, [brandId, currentPage, fetchBrandProducts]);

  const isProductInList = (list, newProduct) => {
    return list.some((product) => product.id === newProduct.id);
  };

  useEffect(() => {
    if (
      paginatedCategoryProducts &&
      categoryId &&
      !isSubCategory &&
      !searchQuery
    ) {
      if (
        paginatedCategoryProducts.data &&
        paginatedCategoryProducts.data.length > 0
      ) {
        setAllProducts((prevProducts) => {
          if (currentPage === 1) {
            return [...paginatedCategoryProducts.data];
          }

          const newProducts = paginatedCategoryProducts.data.filter(
            (newProduct) => !isProductInList(prevProducts, newProduct)
          );

          return [...prevProducts, ...newProducts];
        });

        setHasMore(!!paginatedCategoryProducts.pagination.next_page_url);
      } else if (currentPage === 1) {
        setAllProducts([]);
        setHasMore(false);
      } else {
        setHasMore(false);
      }
    }

    if (
      paginatedSubcategoryProducts &&
      categoryId &&
      isSubCategory &&
      !searchQuery
    ) {
      if (
        paginatedSubcategoryProducts.data &&
        paginatedSubcategoryProducts.data.length > 0
      ) {
        setAllProducts((prevProducts) => {
          if (currentPage === 1) {
            return [...paginatedSubcategoryProducts.data];
          }

          const newProducts = paginatedSubcategoryProducts.data.filter(
            (newProduct) => !isProductInList(prevProducts, newProduct)
          );

          return [...prevProducts, ...newProducts];
        });

        setHasMore(
          paginatedSubcategoryProducts.pagination?.hasMorePages || false
        );
      } else if (currentPage > 1) {
        setHasMore(false);
      }
    }

    if (paginatedBrandProducts && brandId) {
      if (paginatedBrandProducts.length > 0) {
        setAllProducts((prevProducts) => {
          if (currentPage === 1) {
            return [...paginatedBrandProducts];
          }

          const newProducts = paginatedBrandProducts.filter(
            (newProduct) => !isProductInList(prevProducts, newProduct)
          );

          return [...prevProducts, ...newProducts];
        });

        setHasMore(paginatedBrandProducts.length === 6);
      } else if (currentPage > 1) {
        setHasMore(false);
      }
    }

    if (paginatedCollectionProducts && collectionId) {
      if (
        paginatedCollectionProducts.data &&
        paginatedCollectionProducts.data.length > 0
      ) {
        setAllProducts((prevProducts) => {
          if (currentPage === 1) {
            return [...paginatedCollectionProducts.data];
          }

          const newProducts = paginatedCollectionProducts.data.filter(
            (newProduct) => !isProductInList(prevProducts, newProduct)
          );

          return [...prevProducts, ...newProducts];
        });

        setHasMore(!!paginatedCollectionProducts.pagination?.next_page_url);
      } else if (currentPage > 1) {
        setHasMore(false);
      }
    }
  }, [
    paginatedCategoryProducts,
    paginatedBrandProducts,
    paginatedCollectionProducts,
    paginatedSubcategoryProducts,
    currentPage,
    categoryId,
    brandId,
    collectionId,
    isSubCategory,
    searchQuery,
  ]);

  const findCategoryById = (categories, id) => {
    if (!categories) return null;

    const parsedId = typeof id === "string" ? parseInt(id) : id;

    for (const category of categories) {
      if (category.id === parsedId) return category;
      if (category.children) {
        const found = findCategoryById(category.children, parsedId);
        if (found) return found;
      }
    }
    return null;
  };

  // Get parent category for the current subcategory
  const getParentCategory = (categories, childId) => {
    if (!categories) return null;

    const parsedChildId =
      typeof childId === "string" ? parseInt(childId) : childId;

    for (const category of categories) {
      if (category.children) {
        for (const child of category.children) {
          if (child.id === parsedChildId) {
            return category;
          }

          // Check deeper nested levels
          if (child.children) {
            const foundInNested = getParentCategory([child], parsedChildId);
            if (foundInNested) return child;
          }
        }
      }
    }

    return null;
  };

  // Find and setup the selected category and its subcategories
  useEffect(() => {
    if (categoriesData?.data && categoryId) {
      const category = findCategoryById(
        categoriesData.data,
        parseInt(categoryId)
      );

      if (selectedCategory?.id !== category?.id) {
        // Reset product-related states
        setAllProducts([]);
        setHasMore(true);
        setCurrentPage(1);
        setSelectedCategory(category);

        // Set subcategories to display in sidebar
        // Set subcategories to display in sidebar
        if (category) {
          if (category.children && category.children.length > 0) {
            // If the category has children, show them
            setHasSubcategories(true);
            setSubcategoriesToShow(category.children);
          } else {
            // If this is a subcategory without children, don't show any category in sidebar
            setHasSubcategories(false);
            setSubcategoriesToShow([]);
          }
        }
      }
    }
  }, [categoriesData, categoryId, selectedCategory]);

  useEffect(() => {
    setCurrentPage(1);
    setAllProducts([]);
    setHasMore(true);
  }, [categoryId, brandId, collectionId, searchQuery, location.key]);

  useEffect(() => {
    if (
      categoryId &&
      isSubCategory &&
      categoryProducts?.length > 0 &&
      currentPage === 1
    ) {
      setAllProducts(categoryProducts);
    } else if (brandId && brandProducts?.length > 0 && currentPage === 1) {
      setAllProducts(brandProducts);
    } else if (
      collectionId &&
      collectionProducts?.data?.length > 0 &&
      currentPage === 1
    ) {
      setAllProducts(collectionProducts.data);
    }
  }, [
    categoryId,
    categoryProducts,
    brandId,
    brandProducts,
    collectionId,
    collectionProducts,
    currentPage,
    isSubCategory,
  ]);

  const loadMoreData = useCallback(() => {
    if (
      !hasMore ||
      paginatedCategoryFetching ||
      brandProductsFetching ||
      paginatedCollectionLoading ||
      subcategoryProductsLoading
    )
      return;

    setCurrentPage((prevPage) => prevPage + 1);
  }, [
    hasMore,
    paginatedCategoryFetching,
    brandProductsFetching,
    paginatedCollectionLoading,
    subcategoryProductsLoading,
  ]);

  const isLoading =
    categoryLoading ||
    collectionLoading ||
    collectionProductsLoading ||
    brandProductsLoading ||
    (paginatedCategoryLoading && currentPage === 1) ||
    (subcategoryProductsLoading && currentPage === 1) ||
    (paginatedCollectionLoading && currentPage === 1);

  const hasError =
    categoryError ||
    collectionError ||
    collectionProductsError ||
    brandProductsError;

  const products = useMemo(() => {
    let productsList = [];

    if (searchQuery) productsList = [...searchResults];
    else productsList = [...allProducts];

    if (priceSort === "lowToHigh") {
      return [...productsList].sort(
        (a, b) => (a.price_amount || 0) - (b.price_amount || 0)
      );
    } else if (priceSort === "highToLow") {
      return [...productsList].sort(
        (a, b) => (b.price_amount || 0) - (a.price_amount || 0)
      );
    }

    return productsList;
  }, [searchQuery, searchResults, priceSort, allProducts]);

  const totalItems = useMemo(() => {
    if (
      paginatedCategoryProducts?.pagination &&
      !isSubCategory &&
      !searchQuery &&
      categoryId
    ) {
      return paginatedCategoryProducts.pagination.total || products.length || 0;
    }
    return products.length || 0;
  }, [
    paginatedCategoryProducts,
    products,
    isSubCategory,
    searchQuery,
    categoryId,
  ]);

  const handlePriceSortChange = (sortType) => {
    setPriceSort(sortType);
  };

  const handleAddToCart = (product) => {
    console.log("Adding to cart:", product);
  };

  const handleToggleFavorite = (product) => {
    console.log("Toggling favorite:", product);
  };

  const handleSubCategorySelect = (subCategoryId) => {
    // Reset product-related states
    setAllProducts([]);
    setCurrentPage(1);
    setHasMore(true);
    setPriceSort("none");

    // Use the existing category data instead of fetching again
    const newCategory = findCategoryById(
      categoriesData?.data,
      parseInt(subCategoryId)
    );
    setSelectedCategory(newCategory);

    // Update URL without full navigation
    navigate(`/category/${subCategoryId}`, { replace: true });

    // Fetch products for new subcategory
    if (newCategory) {
      fetchSubcategoryProducts({
        category: newCategory,
        page: 1,
        limit: 6,
      });
    }
  };

  const handleCategoryClick = (categoryId) => {
    setAllProducts([]);
    setCurrentPage(1);
    setHasMore(true);
    navigate(`/category/${categoryId}`);
  };

  const renderBreadcrumbs = () => {
    if (!categoriesData?.data || !selectedCategory) return null;

    const breadcrumbs = [];
    let currentCategory = selectedCategory;
    let parentId = currentCategory.parent_id;

    // Add the current category first
    breadcrumbs.unshift(currentCategory);

    // Then add all parent categories
    while (parentId) {
      const parentCategory = findCategoryById(categoriesData.data, parentId);
      if (parentCategory) {
        breadcrumbs.unshift(parentCategory);
        parentId = parentCategory.parent_id;
      } else {
        break;
      }
    }

    return (
      <div className={styles.breadcrumb}>
        {breadcrumbs.map((category, index) => (
          <React.Fragment key={category.id}>
            <span
              className={styles.breadcrumbItem}
              onClick={() => handleCategoryClick(category.id)}
            >
              {category.name}
            </span>
            {index < breadcrumbs.length - 1 && (
              <span className={styles.separator}>/</span>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  // Page title based on context
  const pageTitle = useMemo(() => {
    if (searchQuery) return `${t("search.resultsFor")}: "${searchQuery}"`;
    if (brandId) return "Brand Products";
    if (categoryId && selectedCategory) return selectedCategory.name;
    if (categoryId) return "Category";
    if (collectionData?.data?.name) return collectionData.data.name;
    return "Collection";
  }, [searchQuery, brandId, categoryId, selectedCategory, collectionData, t]);

  const renderSubCategories = () => {
    if (!selectedCategory?.children || searchQuery) return null;

    return (
      <div className={styles.subCategories}>
        {selectedCategory.children.map((subCategory) => (
          <button
            key={subCategory.id}
            onClick={() => handleSubCategorySelect(subCategory.id)}
          >
            {subCategory.name}
          </button>
        ))}
      </div>
    );
  };

  if (isLoading) return <Loader />;
  if (hasError)
    return (
      <div>
        <Result
          status="500"
          title="500"
          subTitle="Näbelli ýalňyşlyk ýüze çykdy."
          extra={
            <Button type="primary" onClick={() => navigate("/")}>
              Baş sahypa gidiň
            </Button>
          }
        />
      </div>
    );

  return (
    <div
      className={styles.categoryPage}
      style={{ flexDirection: "column" }}
      key={`category-${categoryId || collectionId || brandId}-${
        searchQuery ? "search" : ""
      }`}
    >
      {categoryId && renderBreadcrumbs()}
      <h2>{pageTitle}</h2>
      <p className={styles.sum}>
        {t("category.total")}: {totalItems} {t("category.items")}
      </p>
      <div className={styles.bars}>
        <button className={styles.sum}>
          <strong>{t("category.total")}:</strong> <br />
          {totalItems} {t("category.items")}
        </button>
        <BrandSidebar />
        <FilterSidebar
          onPriceSortChange={handlePriceSortChange}
          currentPriceSort={priceSort}
        />
      </div>

      {renderSubCategories()}

      <div className={styles.Container}>
        <aside className={styles.sidebar}>
          {!searchQuery &&
            hasSubcategories &&
            subcategoriesToShow.length > 0 && (
              <div className={styles.filterSection}>
                <h3>{t("category.subCategories")}</h3>
                <ul>
                  {subcategoriesToShow.map((subCategory) => (
                    <li
                      key={subCategory.id}
                      onClick={() => handleSubCategorySelect(subCategory.id)}
                      className={
                        parseInt(categoryId) === subCategory.id
                          ? styles.activeSubcategory
                          : ""
                      }
                    >
                      {subCategory.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          <div className={styles.filterSection}>
            <h3>{t("category.composition")}</h3>
            <label>
              <input
                type="radio"
                name="sort"
                checked={priceSort === "none"}
                onChange={() => handlePriceSortChange("none")}
              />
              <span className={styles.customRadio}></span>
              {t("category.neverMind")}
            </label>
            <label>
              <input
                type="radio"
                name="sort"
                checked={priceSort === "lowToHigh"}
                onChange={() => handlePriceSortChange("lowToHigh")}
              />
              <span className={styles.customRadio}></span>
              {t("category.From_cheap_to_expensive")}
            </label>
            <label>
              <input
                type="radio"
                name="sort"
                checked={priceSort === "highToLow"}
                onChange={() => handlePriceSortChange("highToLow")}
              />
              <span className={styles.customRadio}></span>
              {t("category.From_expensive_to_cheap")}
            </label>
          </div>
          <div className={styles.filterSection}>
            <h3>{t("navbar.brands")}</h3>
            <input type="text" placeholder="Gözleg" />
            <ul>
              <li>
                <label>
                  <input type="checkbox" />
                  <span className={styles.customCheckbox}>
                    <TiTick className={styles.checkIcon} />
                  </span>
                  Mahmood Rice
                </label>
              </li>
              <li>
                <label>
                  <input type="checkbox" />
                  <span className={styles.customCheckbox}>
                    <TiTick className={styles.checkIcon} />
                  </span>
                  Mahmood Tea
                </label>
              </li>
            </ul>
          </div>
        </aside>

        <main className={styles.productsContainer}>
          {products.length > 0 ? (
            <InfiniteScroll
              dataLength={products.length}
              next={loadMoreData}
              hasMore={hasMore}
              scrollThreshold={0.8}
              style={{ overflow: "visible" }}
              loader={
                <div className={styles.loaderContainer}>
                  <Loader />
                </div>
              }
              className={styles.productGrid}
              key={`scroll-${categoryId || collectionId || brandId}`}
            >
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onToggleFavorite={handleToggleFavorite}
                  showFavoriteButton={true}
                  showAddToCart={true}
                />
              ))}
            </InfiniteScroll>
          ) : (
            <div>{t("search.noResults")}</div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CategoryPage;
