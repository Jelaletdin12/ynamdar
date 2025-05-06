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
            if (subCategory.id === targetId) {
              return true;
            }
          }
          const foundInNested = checkIsSubCategory(category.children, targetId);
          if (foundInNested) return true;
        }
      }
      return false;
    };

    return checkIsSubCategory(categoriesData.data, parseInt(categoryId));
  }, [categoriesData, categoryId]);

  // API queries with conditional skipping
  // Original query for backwards compatibility
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

  // Original collection products query for backward compatibility
  const {
    data: collectionProducts = { data: [] },
    error: collectionProductsError,
    isLoading: collectionProductsLoading,
  } = useGetCollectionProductsQuery(collectionId, {
    skip: !collectionId || currentPage > 1,
  });

  // Load subcategory products when category changes or page changes
  useEffect(() => {
    if (categoryId && isSubCategory && selectedCategory) {
      fetchSubcategoryProducts({
        category: selectedCategory,
        page: currentPage,
        limit: 6, // Adjust based on your needs
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
    if (collectionId && currentPage >= 1) {
      fetchCollectionProducts({
        collectionId,
        page: currentPage,
        limit: 6, // Adjust based on your needs
      });
    }
  }, [collectionId, currentPage, fetchCollectionProducts]);

  // Fetch more brand products when page changes
  useEffect(() => {
    if (brandId && currentPage >= 1) {
      fetchBrandProducts({
        type: undefined,
        page: currentPage,
        limit: 6, // Adjust based on your API's default limit
        id: brandId,
      });
    }
  }, [brandId, currentPage, fetchBrandProducts]);

  // Update products list when pagination data arrives
  useEffect(() => {
    // Handle category pagination
    if (
      paginatedCategoryProducts &&
      categoryId &&
      !isSubCategory &&
      !searchQuery
    ) {
      if (paginatedCategoryProducts.data.length > 0) {
        if (currentPage === 1) {
          setAllProducts(paginatedCategoryProducts.data);
        } else {
          setAllProducts((prev) => [
            ...prev,
            ...paginatedCategoryProducts.data,
          ]);
        }

        // Check if there's a next page
        setHasMore(!!paginatedCategoryProducts.pagination.next_page_url);
      } else {
        setHasMore(false);
      }
    }

    // Handle subcategory pagination
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
        if (currentPage === 1) {
          setAllProducts(paginatedSubcategoryProducts.data);
        } else {
          setAllProducts((prev) => [
            ...prev,
            ...paginatedSubcategoryProducts.data,
          ]);
        }

        // Check if there's more pages
        setHasMore(
          paginatedSubcategoryProducts.pagination?.hasMorePages || false
        );
      } else {
        setHasMore(false);
      }
    }

    // Handle brand pagination
    if (paginatedBrandProducts && brandId) {
      if (paginatedBrandProducts.length > 0) {
        if (currentPage === 1) {
          setAllProducts(paginatedBrandProducts);
        } else {
          setAllProducts((prev) => [...prev, ...paginatedBrandProducts]);
        }

        // Assume there's more if we got a full page
        setHasMore(paginatedBrandProducts.length === 6); // Adjust based on your API's limit
      } else {
        setHasMore(false);
      }
    }

    // Handle collection pagination
    if (paginatedCollectionProducts && collectionId) {
      if (
        paginatedCollectionProducts.data &&
        paginatedCollectionProducts.data.length > 0
      ) {
        if (currentPage === 1) {
          setAllProducts(paginatedCollectionProducts.data);
        } else {
          setAllProducts((prev) => [
            ...prev,
            ...paginatedCollectionProducts.data,
          ]);
        }

        // Check if there's a next page
        setHasMore(!!paginatedCollectionProducts.pagination?.next_page_url);
      } else {
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

  // Helper function to find category by ID
  const findCategoryById = (categories, id) => {
    if (!categories) return null;

    for (const category of categories) {
      if (category.id === id) return category;
      if (category.children) {
        const found = findCategoryById(category.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  // Update selected category when category data changes
  useEffect(() => {
    if (categoriesData?.data && categoryId) {
      const category = findCategoryById(
        categoriesData.data,
        parseInt(categoryId)
      );
      setSelectedCategory(category);

      // Reset pagination when category changes
      setCurrentPage(1);
      setAllProducts([]);
      setHasMore(true);
    }
  }, [categoriesData, categoryId]);

  // Reset pagination when route changes
  useEffect(() => {
    setCurrentPage(1);
    setAllProducts([]);
    setHasMore(true);
  }, [categoryId, brandId, collectionId, searchQuery]);

  // Initialize allProducts for first page
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

  // Load more function for infinite scroll
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

  // Loading and error states
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

  // Determine which products to display with sorting applied
  const products = useMemo(() => {
    let productsList = [];

    // Get base products list
    if (searchQuery) productsList = [...searchResults];
    else if (brandId) productsList = [...allProducts];
    else if (categoryId && isSubCategory) productsList = [...allProducts];
    else if (categoryId) productsList = [...allProducts];
    else if (collectionId) productsList = [...allProducts];
    else productsList = [];

    // Apply sorting
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
  }, [
    searchQuery,
    searchResults,
    brandId,
    categoryId,
    collectionId,
    priceSort,
    allProducts,
    isSubCategory,
  ]);

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

  // Handle price sort change
  const handlePriceSortChange = (sortType) => {
    setPriceSort(sortType);
  };

  // Event handlers
  const handleAddToCart = (product) => {
    console.log("Adding to cart:", product);
  };

  const handleToggleFavorite = (product) => {
    console.log("Toggling favorite:", product);
  };

  const handleSubCategorySelect = (subCategoryId) => {
    navigate(`/category/${subCategoryId}`);
  };

  const handleCategoryClick = (categoryId) => {
    navigate(`/category/${categoryId}`);
  };

  // Generate breadcrumbs for subcategories
  const renderBreadcrumbs = () => {
    if (!isSubCategory || !categoriesData?.data || !selectedCategory)
      return null;

    const breadcrumbs = [];
    let currentCategory = selectedCategory;

    while (currentCategory) {
      breadcrumbs.unshift(currentCategory);
      currentCategory = findCategoryById(
        categoriesData.data,
        currentCategory.parent_id
      );
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
    if (brandId) return "Brand Products"; // Could be improved by fetching brand name
    if (categoryId && selectedCategory) return selectedCategory.name;
    if (categoryId) return "Category";
    if (collectionData?.data?.name) return collectionData.data.name;
    return "Collection";
  }, [searchQuery, brandId, categoryId, selectedCategory, collectionData, t]);

  // Display subcategories section
  const renderSubCategories = () => {
    if (!selectedCategory?.children || searchQuery || isSubCategory)
      return null;

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

  // Determine if we should use infinite scroll
  const shouldUseInfiniteScroll = useMemo(() => {
    return true; // Now we always use infinite scroll for better consistency
  }, []);

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
    <div className={styles.categoryPage} style={{ flexDirection: "column" }}>
      {renderBreadcrumbs()}
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
          {!searchQuery && selectedCategory?.children && !isSubCategory && (
            <div className={styles.filterSection}>
              <h3>{t("category.subCategories")}</h3>
              <ul>
                {selectedCategory.children.map((subCategory) => (
                  <li
                    key={subCategory.id}
                    onClick={() => handleSubCategorySelect(subCategory.id)}
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
            shouldUseInfiniteScroll ? (
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
              <div className={styles.productGrid}>
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
              </div>
            )
          ) : (
            <div>{t("search.noResults")}</div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CategoryPage;
