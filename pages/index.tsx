import { useState } from "react";
import { useDebounce } from "use-debounce";
import Home from "../components/Home";
import { useSearchContext } from "../context/search-context";
import { useFetchData } from "../hooks/useFetchData";
import { ICompany } from "../models/Company";
import { IJob } from "../models/Job";

type PageResult<T> = {
  data: {
    results: T[];
    totalPages: number;
    totalCount: number;
    page: number;
    size: number;
  };
  success: boolean;
};

export type SearchData = {
  add: string;
  ind: string;
  exp: string;
  sal: string;
};

const Index = () => {
  const { query } = useSearchContext();
  const [queryDebounce] = useDebounce(query, 500);
  const [jobPage, setJobPage] = useState(1);
  const [companyPage, setCompanyPage] = useState(1);

  // filter
  const [searchData, setSearchData] = useState<SearchData>({
    add: "",
    ind: "",
    exp: "",
    sal: "",
  });

  const [companiesPageData, fetchCompanyLoading, fetchCompanyError] =
    useFetchData<PageResult<ICompany>>(
      "/api/companies",
      [companyPage, searchData, queryDebounce],
      {
        params: {
          ...searchData,
          page: companyPage,
          q: queryDebounce,
        },
      }
    );

  const [jobsPageData, fetchJobLoading, fetchJobError] = useFetchData<
    PageResult<IJob>
  >("/api/jobs", [jobPage, searchData, queryDebounce], {
    params: {
      ...searchData,
      page: jobPage,
      q: queryDebounce,
    },
  });

  const handleChange = (filer: string, value: string | number) => {
    setSearchData({
      ...searchData,
      [filer]: value,
    });
  };

  return (
    <Home
      jobData={jobsPageData?.data.results || []}
      setPage={setJobPage}
      totalPages={jobsPageData?.data.totalPages || 0}
      companyData={companiesPageData?.data.results || []}
      setCompanyPage={setCompanyPage}
      totalCompanyPages={companiesPageData?.data.totalPages || 0}
      searchData={searchData}
      handleChange={handleChange}
      isError={fetchCompanyError || fetchJobError}
      isLoading={fetchCompanyLoading || fetchJobLoading}
    />
  );
};

export default Index;
