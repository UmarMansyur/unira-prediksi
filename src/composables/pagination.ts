import { useQuery, useQueryClient } from "@tanstack/vue-query";
import { computed, ref, watch } from "vue";
import useAPI from "./api";
import _ from "lodash";

export default function usePagination(
  queryKey: string[],
  endpoint: string
) {
  const page = ref(1);
  const limit = ref<number>(10);
  const search = ref("");
  const sortBy = ref("");
  const sortOrder = ref("asc");
  const listButton = ref<number[]>([]);
  const isSearch = ref(false);
  const filter = ref("");

  const { getResource } = useAPI();
  const queryClient = useQueryClient();

  const setPage = (v: number) => {
    page.value = v;
    queryClient.invalidateQueries({ queryKey });
  };

  const setLimit = (v: any) => {
    console.log(v);
    limit.value = v;
    queryClient.invalidateQueries({ queryKey });
  };

  const nextPage = () => {
    if (page.value < totalPage.value) {
      page.value += 1;
      queryClient.invalidateQueries({ queryKey });
    }
  };

  const prevPage = () => {
    if (page.value > 1) {
      page.value -= 1;
      queryClient.invalidateQueries({ queryKey });
    }
  };

  const debouncedInvalidate = _.debounce(() => {
    queryClient.invalidateQueries({ queryKey });
  }, 500);

  const setSearch = (v: string) => {
    search.value = v;
    page.value = 1;
    isSearch.value = true;
    debouncedInvalidate();
  };

  const setFilter = (v: string) => {
    if (v === "") {
      return;
    }
    filter.value = v;
    page.value = 1;
    isSearch.value = true;
    queryClient.invalidateQueries({ queryKey });
  };

  const setSorting = (field: string, order = "asc") => {
    sortBy.value = field;
    sortOrder.value = order;
    queryClient.invalidateQueries({ queryKey });
  };

  const fetchAPI = async (isAuth = true) => {
    let resource = endpoint;
    let params = [];
    if (search.value) {
      params.push(`search=${search.value}`);
    }

    if (page.value) {
      params.push(`page=${page.value}`);
    }

    if (limit.value) {
      params.push(`limit=${limit.value}`);
    }

    if (sortBy.value) {
      params.push(`sortBy=${sortBy.value}`);
    }

    if (sortOrder.value) {
      params.push(`sortOrder=${sortOrder.value}`);
    }

    if (filter.value) {
      params.push(filter.value);
    }

    if (params.length > 0) {
      if (resource.indexOf("?") === -1) {
        resource += `?${params.join("&")}`;
      } else {
        resource += `&${params.join("&")}`;
      }
    }
    isSearch.value = true;
    const response = await getResource(resource, isAuth);
    isSearch.value = false;
    return response;
  };

  const {
    isPending,
    error,
    isSuccess,
    data: queryData,
  } = useQuery({
    queryKey,
    queryFn: () => fetchAPI(),
    enabled: true,
  });

  const isLoading = computed(() => isPending.value || isSearch.value);
  const isError = computed(() => !!error.value);
  const data = computed(() => queryData.value?.data?.data || []);
  const meta = computed(() => queryData.value?.meta || {});
  const currentPage = computed(
    () => queryData.value?.data?.current_page || page.value
  );
  const totalPage = computed(() => queryData.value?.data?.total_page || 0);
  const totalData = computed(() => queryData.value?.data?.total_data || 0);

  const startData = computed(() => {
    if (totalData.value === 0) {
      return 0;
    }
    return (currentPage.value - 1) * limit.value + 1;
  });

  const endData = computed(() => {
    if (totalData.value === 0) {
      return 0;
    }
    return Math.min(currentPage.value * limit.value, totalData.value);
  });

  const updateListButton = () => {
    listButton.value = [];

    if (totalPage.value <= 0) {
      return;
    }

    if (totalPage.value <= 3) {
      for (let i = 1; i <= totalPage.value; i++) {
        listButton.value.push(i);
      }
    } else {
      if (currentPage.value <= 2) {
        listButton.value = [1, 2, 3];
      } else if (currentPage.value >= totalPage.value - 1) {
        listButton.value = [
          totalPage.value - 2,
          totalPage.value - 1,
          totalPage.value,
        ];
      } else {
        listButton.value = [
          currentPage.value - 1,
          currentPage.value,
          currentPage.value + 1,
        ];
      }
    }
  };
  watch(
    [totalPage, currentPage],
    () => {
      updateListButton();
    },
    { immediate: true }
  );

  const refresh = () => {
    page.value = 1;
    limit.value = 10;
    search.value = "";
    sortBy.value = "";
    sortOrder.value = "asc";
    filter.value = "";
    queryClient.invalidateQueries({ queryKey });
  };

  return {
    page,
    limit,
    totalPage,
    currentPage,
    totalData,
    isLoading,
    isError,
    isSuccess,
    data,
    search,
    sortBy,
    sortOrder,
    setPage,
    setLimit,
    nextPage,
    prevPage,
    setSearch,
    setSorting,
    refresh,
    setFilter,
    filter,
    listButton,
    startData,
    endData,
    meta,
  };
}